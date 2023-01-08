package Game

import (
	"MathGame/DB"
	"MathGame/Struct"
	"MathGame/util"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateGame(u *Struct.User, Type int, Level int, RunningTime int, Rank bool) (int, error) {
	if u.Game == nil {
		u.Game = map[int]Struct.Game{}
	}
	Pro, err := Struct.CreateProblem(Type, Level, 250)
	if err != nil {
		return 0, err
	}

	id := len(u.Game)
	u.Game[id] = Struct.Game{
		Setting: Struct.Setting{
			Type:        Type,
			Level:       Level,
			RunningTime: RunningTime,
		},
		StartTime: time.Now(),
		TLog:      []Struct.TLog{},
		Problem:   Pro,
		EndGame:   0,
		RankGame:  Rank,
	}
	go func() {
		RunningTime++
		time.Sleep(time.Second * time.Duration(RunningTime))
		if u.Game[id].EndGame != 0 {
			return
		}
		if data, ok := u.Game[id]; ok {
			data.EndGame = 2
			data.EndTime = time.Now()
			u.Game[id] = data
			DB.DBUpdateUser(*u)
		}
	}()
	return id, nil
}
func Route(Game_api *gin.RouterGroup) {
	Game_api.GET("get/:id", func(ctx *gin.Context) {
		Id := ctx.Param("id")

		Token, _ := ctx.Cookie("Token")
		User_Data, _ := DB.GetUsertoToken(Token)
		if util.StrToInt(Id) > len(User_Data.Game) {
			ctx.AbortWithStatusJSON(400, gin.H{
				"message": "bad request",
			})
			return
		}
		ctx.JSON(200, gin.H{
			"message": "success",
			"data":    User_Data.Game[util.StrToInt(Id)],
		})
	})
	Game_api.GET("get", func(ctx *gin.Context) {
		Token, _ := ctx.Cookie("Token")
		User_Data, _ := DB.GetUsertoToken(Token)
		ctx.JSON(200, gin.H{
			"message": "success",
			"data":    User_Data.Game,
		})
	})
	Game_api.POST("create", func(ctx *gin.Context) {
		g := Struct.Setting{}
		util.Req(&g, ctx)

		if g.RunningTime < 30 || g.RunningTime > 3000 {
			ctx.AbortWithStatusJSON(400, gin.H{
				"message": "bad request",
			})
			return
		} else if _, err := Struct.CreateProblem(g.Level, g.Type, 1); err != nil {
			ctx.AbortWithStatusJSON(400, gin.H{
				"message": "bad request",
			})
			return
		}

		Token, _ := ctx.Cookie("Token")
		User_Data, err := DB.GetUsertoToken(Token)
		if util.BadReq(err, ctx) != nil {
			return
		}

		ID, e := CreateGame(&User_Data, g.Type, g.Level, g.RunningTime, false)
		if util.BadReq(e, ctx) != nil {
			return
		}

		if util.BadReq(DB.DBUpdateUser(User_Data), ctx) != nil {
			return
		}

		ctx.JSON(200, gin.H{
			"message": "success",
			"ID":      ID,
		})
	})
	Game_api.POST("end", func(ctx *gin.Context) {
		g := struct {
			Id   int           `json:"id"`
			Tlog []Struct.TLog `json:"tlog"`
		}{}
		util.Req(&g, ctx)

		Token, _ := ctx.Cookie("Token")
		User_Data, err := DB.GetUsertoToken(Token)
		if util.BadReq(err, ctx) != nil {
			fmt.Println(err)
			return
		}

		data, exists := User_Data.Game[g.Id]
		if !exists || data.EndGame != 0 {
			ctx.AbortWithStatusJSON(400, gin.H{
				"message": "bad request",
			})
			return
		}

		data.End(User_Data.UserName, g.Tlog)
		User_Data.Game[g.Id] = data

		util.BadReq(DB.DBUpdateUser(User_Data), ctx)

		ctx.JSON(200, gin.H{
			"message": "success",
		})
	})
}
