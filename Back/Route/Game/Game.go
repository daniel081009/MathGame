package Game

import (
	"MathGame/Byte"
	"MathGame/DB"
	"MathGame/Struct"
	"MathGame/util"

	"github.com/boltdb/bolt"
	"github.com/gin-gonic/gin"
)

func Route(Game_api *gin.RouterGroup) {
	Game_api.GET("get/:id", func(ctx *gin.Context) {
		Id := ctx.Param("id")

		Token, _ := ctx.Cookie("Token")
		D, _ := DB.GetUsertoToken(Token)
		if util.StrToInt(Id) > len(D.Game) {
			ctx.AbortWithStatusJSON(400, gin.H{
				"message": "bad request",
			})
			return
		}
		ctx.JSON(200, gin.H{
			"message": "success",
			"data":    D.Game[util.StrToInt(Id)],
		})
	})
	Game_api.GET("get", func(ctx *gin.Context) {
		Token, _ := ctx.Cookie("Token")
		D, _ := DB.GetUsertoToken(Token)
		ctx.JSON(200, gin.H{
			"message": "success",
			"data":    D.Game,
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
		} else if g.Level < 0 || g.Level > 2 {
			ctx.AbortWithStatusJSON(400, gin.H{
				"message": "bad request",
			})
			return
		} else if g.Type < 0 || g.Type > 3 {
			ctx.AbortWithStatusJSON(400, gin.H{
				"message": "bad request",
			})
			return
		}

		Token, _ := ctx.Cookie("Token")
		D, _ := DB.GetUsertoToken(Token)
		ID, e := D.CreateGame(g.Type, g.Level, g.RunningTime)
		util.BadReq(e, ctx)

		db := DB.DB()
		defer db.Close()

		e = db.Update(func(tx *bolt.Tx) error {
			b := tx.Bucket([]byte(DB.MainBucket))
			e := b.Put([]byte(D.UserName), Byte.UserStructtoByte(D))
			return e
		})
		util.BadReq(e, ctx)
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
		D, _ := DB.GetUsertoToken(Token)
		data, exists := D.Game[g.Id]
		if !exists || data.EndGame != 0 {
			ctx.AbortWithStatusJSON(400, gin.H{
				"message": "bad request",
			})
			return
		}

		data.End(D.UserName, g.Tlog)
		D.Game[g.Id] = data

		db := DB.DB()
		defer db.Close()
		util.BadReq(db.Update(func(tx *bolt.Tx) error {
			b := tx.Bucket([]byte(DB.MainBucket))
			e := b.Put([]byte(D.UserName), Byte.UserStructtoByte(D))
			return e
		}), ctx)

		ctx.JSON(200, gin.H{
			"message": "success",
		})
	})
}
