package Ranking

import (
	"MathGame/DB"
	"MathGame/Route/Game"
	"MathGame/Struct"
	"MathGame/util"
	"fmt"

	"github.com/boltdb/bolt"
	"github.com/gin-gonic/gin"
)

func Route(rank_api *gin.RouterGroup) {
	rank_api.POST("create", func(ctx *gin.Context) {
		token := ctx.PostForm("token")
		User_Data, err := DB.GetUsertoToken(token)
		util.BadReq(err, ctx)

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
		Id, err := Game.CreateGame(&User_Data, req.Type, 1, 60, true)
		util.BadReq(err, ctx)

		err = DB.DBUpdateUser(User_Data)
		fmt.Println(err, "db")
		if util.BadReq(err, ctx) != nil {
			return
		}

		ctx.JSON(200, gin.H{
			"message": "success",
			"id":      Id,
		})
	})
	rank_api.POST("end", func(ctx *gin.Context) {
		g := struct {
			Id   int           `json:"id"`
			Tlog []Struct.TLog `json:"tlog"`
		}{}
		util.Req(&g, ctx)

		Token, _ := ctx.Cookie("Token")
		User_Data, _ := DB.GetUsertoToken(Token)
		data, exists := User_Data.Game[g.Id]
		if !exists || data.EndGame != 0 {
			ctx.AbortWithStatusJSON(400, gin.H{
				"message": "bad request",
			})
			return
		}

		data.TLog = g.Tlog
		User_Data.Game[g.Id] = data

		db := DB.DB()
		defer db.Close()
		allRank := 0
		db.Update(func(tx *bolt.Tx) error {
			b := tx.Bucket([]byte(DB.RankBucket))

			d := b.Get(util.IntoByte(data.Setting.Type))
			rank := Struct.Ranking{}
			util.BytetoStruct(d, &rank)
			allRank = rank.NewRank(Struct.Rank{UserName: User_Data.UserName, Game: data})

			e := b.Put(util.IntoByte(data.Setting.Type), util.StructtoByte(rank))
			if e != nil {
				return e
			}

			b = tx.Bucket([]byte(DB.MainBucket))
			e = b.Put([]byte(User_Data.UserName), util.StructtoByte(User_Data))

			return e
		})

		ctx.JSON(200, gin.H{
			"message": "success",
			"rank":    allRank,
		})
	})
	rank_api.GET("get", func(ctx *gin.Context) {
		token := ctx.Query("token")
		_, err := DB.GetUsertoToken(token)
		util.BadReq(err, ctx)

		// ToDo : Get Ranking Game
	})
}
