package Game

import (
	"MathGame/DB"
	"MathGame/System"
	"MathGame/util"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateGame(UserName string, Type int, Level int, RunningTime int, Rank bool) (System.Game, error) {
	Pro, err := System.CreateProblem(Type, Level, 250)
	if err != nil {
		return System.Game{}, err
	}
	Id := util.RandString(10)
	if _, err := DB.GetGameLogOne(UserName, Id); err != nil {
		return CreateGame(UserName, Type, Level, RunningTime, Rank)
	}
	Game := System.Game{
		Id: Id,
		Setting: System.Setting{
			Type:        Type,
			Level:       Level,
			RunningTime: RunningTime,
		},
		StartTime: time.Now(),
		TLog:      []System.TLog{},
		Problem:   Pro,
		EndGame:   0,
		RankGame:  Rank,
	}
	go func() {
		RunningTime++
		time.Sleep(time.Second * time.Duration(RunningTime))
		data, err := DB.GetGameLogOne(UserName, Id)
		if err != nil {
			fmt.Println(err)
			return
		}
		if data.EndGame > 0 {
			data.EndGame = 2
			data.EndTime = time.Now()
		}
		DB.UpdateGameLog(UserName, data)
	}()
	return Game, nil
}
func Route(Game_api *gin.RouterGroup) {
	Game_api.GET("get/:id", func(ctx *gin.Context) {
		Id := ctx.Param("id")

		Token, _ := ctx.Cookie("Token")
		User_Data, _ := DB.GetUsertoToken(Token)
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
		if util.BadReq(err, ctx) != nil {
			return
		}
		User_Data, err := DB.GetUsertoToken(Token)
		if util.BadReq(err, ctx) != nil {
			return
		}
		data, err := DB.GetGameLog(User_Data.UserName)

		ctx.JSON(200, gin.H{
			"message": "success",
			"data":    data,
		})
	})
	Game_api.POST("create", func(ctx *gin.Context) {
		g := System.Setting{}
		util.Req(&g, ctx)

		if g.RunningTime < 30 || g.RunningTime > 3000 {
			ctx.AbortWithStatusJSON(400, gin.H{
				"message": "bad request",
			})
			return
		} else if _, err := System.CreateProblem(g.Level, g.Type, 1); err != nil {
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

		data, e := CreateGame(User_Data.UserName, g.Type, g.Level, g.RunningTime, false)
		if util.BadReq(e, ctx) != nil {
			return
		}

		if util.BadReq(DB.DBUpdateUser(User_Data), ctx) != nil {
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
		util.Req(&g, ctx)

		Token, _ := ctx.Cookie("Token")
		User_Data, err := DB.GetUsertoToken(Token)
		if util.BadReq(err, ctx) != nil {
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

		data.End(User_Data.UserName, g.Tlog)

		util.BadReq(DB.UpdateGameLog(User_Data.UserName, data), ctx)

		ctx.JSON(200, gin.H{
			"message": "success",
		})
	})
}
