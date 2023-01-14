package Ranking

import (
	"MathGame/DB"
	"MathGame/Route/Game"
	"MathGame/System"
	"MathGame/util"
	"fmt"

	"github.com/boltdb/bolt"
	"github.com/gin-gonic/gin"
)

func Route(rank_api *gin.RouterGroup) {
	rank_api.GET("all/:type", func(ctx *gin.Context) {
		Type := ctx.Param("type")

		db := DB.DB(DB.RankPath)
		defer db.Close()

		var Rank System.Ranking
		if util.BadReq(db.View(func(tx *bolt.Tx) error {
			b := tx.Bucket([]byte(DB.RankBucket))

			v := b.Get(util.IntoByte(util.StrToInt(Type)))
			if v != nil {
				util.BytetoStruct(v, &Rank)
			} else {
				return fmt.Errorf("rank not found")
			}

			return nil
		}), ctx, "DB Load Err") != nil {
			return
		}

		ctx.JSON(200, gin.H{
			"message": "success",
			"rank":    Rank.Rank,
		})
	})
	rank_api.POST("create", func(ctx *gin.Context) {
		token, e := ctx.Cookie("Token")
		if util.BadReq(e, ctx, "Token Load Err") != nil {
			return
		}
		User_Data, err := DB.GetUsertoToken(token)
		if util.BadReq(err, ctx, "User Load Err") != nil {
			return
		}

		req := struct {
			Type int `json:"type"` // 0: 덧셈, 1: 뺄셈, 2: 곱셈, 3: 나눗셈, 4: 사칙연산
		}{}
		if util.Req(&req, ctx) != nil {
			return
		}

		if req.Type < 0 || req.Type > 4 {
			ctx.AbortWithStatusJSON(400, gin.H{
				"message": "bad request",
			})
			return
		}
		Game, err := Game.CreateGame(User_Data.UserName, req.Type, 1, 60, true)
		util.BadReq(err, ctx, "Game Create Err")

		util.BadReq(DB.UpdateGameLog(User_Data.UserName, Game), ctx, "DB Update Err")

		ctx.JSON(200, gin.H{
			"message": "success",
			"id":      Game.Id,
			"problem": Game.Problem,
		})
	})
	rank_api.POST("end", func(ctx *gin.Context) {
		req := struct {
			Id   string        `json:"id"`
			Tlog []System.TLog `json:"tlog"`
		}{}
		util.Req(&req, ctx)

		Token, err := ctx.Cookie("Token")
		if util.BadReq(err, ctx, "Token Load Err") != nil {
			return
		}
		User_Data, err := DB.GetUsertoToken(Token)
		if util.BadReq(err, ctx, "User Load Err") != nil {
			return
		}

		data, err := DB.GetGameLogOne(User_Data.UserName, req.Id)
		if err != nil || data.EndGame != 0 {
			ctx.AbortWithStatusJSON(400, gin.H{
				"message": "bad request",
			})
			return
		}

		data.End(req.Tlog)

		db := DB.DB(DB.RankPath)
		defer db.Close()

		allRank := 0
		e := db.Update(func(tx *bolt.Tx) error {
			b := tx.Bucket([]byte(DB.RankBucket))

			d := b.Get(util.IntoByte(data.Setting.Type))
			rank := System.Ranking{}
			util.BytetoStruct(d, &rank)
			allRank = rank.NewRank(System.Rank{UserName: User_Data.UserName, Game: data}, 10)

			e := b.Put(util.IntoByte(data.Setting.Type), util.StructtoByte(rank))
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
			return
		}

		ctx.JSON(200, gin.H{
			"message": "success",
			"rank":    allRank,
		})
	})
}
