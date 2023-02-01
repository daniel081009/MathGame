package Ranking

import (
	"MathGame/DB"
	"MathGame/System"
	"MathGame/util"
	"fmt"

	"github.com/boltdb/bolt"
	"github.com/gin-gonic/gin"
)

func Route(rank_api *gin.RouterGroup) {
	rank_api.GET("/all", func(ctx *gin.Context) {
		db := DB.DB(DB.RankPath)
		defer db.Close()

		var Rank map[string]System.Ranking = make(map[string]System.Ranking)

		e := db.View(func(tx *bolt.Tx) error {
			b := tx.Bucket([]byte(DB.RankBucket))

			c := b.Cursor()

			for k, v := c.First(); k != nil; k, v = c.Next() {
				var R System.Ranking
				util.BytetoStruct(v, &R)
				Rank[string(k)] = R
			}
			return nil
		})
		if util.BadReq(e, ctx, "DB Load Err") != nil {
			fmt.Println(e)
			return
		}

		ctx.JSON(200, gin.H{
			"message": "success",
			"rank":    Rank,
		})
	})
	rank_api.GET("/:type/:level/:runningtime", func(ctx *gin.Context) {
		g := System.Setting{
			Type:        util.StrToInt(ctx.Param("type")),
			Level:       util.StrToInt(ctx.Param("level")),
			RunningTime: util.StrToInt(ctx.Param("runningtime")),
		}

		db := DB.DB(DB.RankPath)
		defer db.Close()

		var Rank System.Ranking
		te := db.View(func(tx *bolt.Tx) error {
			b := tx.Bucket([]byte(DB.RankBucket))

			v := b.Get([]byte(fmt.Sprintf("%d_%d_%d", g.Type, g.Level, g.RunningTime)))
			if v != nil {
				util.BytetoStruct(v, &Rank)
			} else {
				return fmt.Errorf("rank not found")
			}
			return nil
		})
		if util.BadReq(te, ctx, "DB Load Err") != nil {
			fmt.Println(te)
			return
		}

		ctx.JSON(200, gin.H{
			"message": "success",
			"rank":    Rank.Rank,
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
