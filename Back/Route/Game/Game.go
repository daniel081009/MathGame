package Game

import (
	"MathGame/DB"
	"MathGame/System"
	"MathGame/util"
	"fmt"
	"time"

	"github.com/boltdb/bolt"
	"github.com/gin-gonic/gin"
)

func CreateGame(UserName string, Type int, Level int, RunningTime int, Rank bool) (System.Game, error) {
	Pro, err := System.CreateProblem(Type, Level, 250)
	if err != nil {
		return System.Game{}, err
	}
	Id := util.RandString(10)
	Game := System.Game{
		Id: Id,
		Setting: System.Setting{
			Type:        Type,
			Level:       Level,
			RunningTime: RunningTime,
			Rank:        Rank,
		},
		StartTime: time.Now(),
		TLog:      []System.TLog{},
		Problem:   Pro,
		EndGame:   0,
	}
	go func() {
		RunningTime++
		time.Sleep(time.Second * time.Duration(RunningTime))
		data, err := DB.GetGameLogOne(UserName, Id)
		if err != nil {
			return
		}
		if data.EndGame == 0 {
			data.EndGame = 2
			data.EndTime = time.Now()
			DB.UpdateGameLog(UserName, data)
		}
	}()
	return Game, nil
}
func Route(Game_api *gin.RouterGroup) {
	Game_api.GET("get/:id", func(ctx *gin.Context) {
		Id := ctx.Param("id")

		Token, err := ctx.Cookie("Token")
		if util.BadReq(err, ctx, "Token Load Err") != nil {
			fmt.Println(err)
			return
		}
		User_Data, err := DB.GetUsertoToken(Token)
		if util.BadReq(err, ctx, "User Load Err") != nil {
			fmt.Println(err)
			return
		}
		data, err := DB.GetGameLogOne(User_Data.UserName, Id)
		if err != nil {
			ctx.AbortWithStatusJSON(400, gin.H{
				"message": "bad request",
			})
			return
		}
		ctx.JSON(200, gin.H{
			"message": "success",
			"data":    data,
		})
	})
	Game_api.GET("get", func(ctx *gin.Context) {
		Token, err := ctx.Cookie("Token")
		if util.BadReq(err, ctx, "Token Load Err") != nil {
			return
		}
		User_Data, err := DB.GetUsertoToken(Token)
		if util.BadReq(err, ctx, "User Load Err") != nil {
			return
		}
		data, err := DB.GetGameLog(User_Data.UserName)
		if util.BadReq(err, ctx, "Game Load Err") != nil {
			return
		}
		temp := map[string]System.Game{}
		for _, v := range data {
			temp[v.Id] = v
		}

		ctx.JSON(200, gin.H{
			"message": "success",
			"data":    temp,
		})
	})
	Game_api.POST("create", func(ctx *gin.Context) {
		g := System.Setting{}
		if util.Req(&g, ctx) != nil {
			return
		}

		if g.RunningTime < 30 || g.RunningTime > 3000 {
			ctx.AbortWithStatusJSON(400, gin.H{
				"message": "bad request",
			})
			return
		} else if _, err := System.CreateProblem(g.Type, g.Level, 1); err != nil {
			fmt.Println(err)
			ctx.AbortWithStatusJSON(400, gin.H{
				"message": "bad request",
			})
			return
		}

		Token, err := ctx.Cookie("Token")
		if util.BadReq(err, ctx, "Token Load Err") != nil {
			return
		}
		User_Data, err := DB.GetUsertoToken(Token)
		if util.BadReq(err, ctx, "User Load Err") != nil {
			return
		}

		data, e := CreateGame(User_Data.UserName, g.Type, g.Level, g.RunningTime, g.Rank)
		if util.BadReq(e, ctx, "Game Create Err") != nil {
			return
		}
		if util.BadReq(DB.UpdateGameLog(User_Data.UserName, data), ctx, "DB Update Err") != nil {
			return
		}

		ctx.JSON(200, gin.H{
			"message": "success",
			"ID":      data.Id,
			"problem": data.Problem,
		})
	})
	Game_api.POST("end", func(ctx *gin.Context) {
		g := struct {
			Id   string        `json:"id"`
			Tlog []System.TLog `json:"tlog"`
		}{}
		if util.BadReq(util.Req(&g, ctx), ctx, "Req Err") != nil {
			return
		}

		Token, err := ctx.Cookie("Token")
		if util.BadReq(err, ctx, "Token User Err") != nil {
			fmt.Println(err)
			return
		}
		User_Data, err := DB.GetUsertoToken(Token)
		if util.BadReq(err, ctx, "Load User Err") != nil {
			fmt.Println(err)
			return
		}
		data, err := DB.GetGameLogOne(User_Data.UserName, g.Id)
		if err != nil || data.EndGame != 0 {
			ctx.AbortWithStatusJSON(400, gin.H{
				"message": "bad request",
			})
			return
		}

		data.End(g.Tlog)
		allRank := 0
		if data.Setting.Rank {
			db := DB.DB(DB.RankPath)
			defer db.Close()
			e := db.Update(func(tx *bolt.Tx) error {
				b := tx.Bucket([]byte(DB.RankBucket))
				Id := []byte(fmt.Sprintf("%d_%d_%d", data.Setting.Type, data.Setting.Level, data.Setting.RunningTime))

				d := b.Get(Id)
				rank := System.Ranking{}
				if d != nil {
					util.BytetoStruct(d, &rank)
				}
				allRank = rank.NewRank(System.Rank{UserName: User_Data.UserName, Game: data}, 10)

				e := b.Put(Id, util.StructtoByte(rank))
				if e != nil {
					return e
				}

				User_Data.CheckBest(data)
				e = DB.DBUpdateUser(User_Data)
				if e != nil {
					return e
				}
				return nil
			})
			if util.BadReq(e, ctx, "DB Err") != nil {
				fmt.Println(e)
				return
			}
		}

		util.BadReq(DB.UpdateGameLog(User_Data.UserName, data), ctx, "Update DB Err")

		if data.Setting.Rank == true {
			ctx.JSON(200, gin.H{
				"message": "success",
				"data":    data,
				"Rank":    allRank,
			})
			return
		}
		ctx.JSON(200, gin.H{
			"message": "success",
			"data":    data,
		})
	})
}
