package Ranking

import (
	"MathGame/Byte"
	"MathGame/DB"
	"MathGame/Struct"
	"fmt"

	"github.com/boltdb/bolt"
	"github.com/gin-gonic/gin"
)

func Route(rank_api *gin.RouterGroup) {
	rank_api.GET("/", func(c *gin.Context) {
		db := DB.DB()
		defer db.Close()
		All := map[string]Struct.Rank{}
		db.View(func(tx *bolt.Tx) error {
			b := tx.Bucket([]byte(DB.RankBucket))
			b.ForEach(func(k, v []byte) error {
				rank, _ := Byte.RankBytetoStruct(v)
				All[string(k)] = rank
				return nil
			})
			return nil
		})
		c.JSON(200, gin.H{
			"message": "OK!",
			"rank":    All,
		})
	})
}

func CheckRank(UserName string, game Struct.Game) {
	db := DB.DB()
	defer db.Close()

	db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(DB.RankBucket))
		v := b.Get([]byte(fmt.Sprintf("%d-%d-%d", game.Setting.Type, game.Setting.Level, game.Setting.RunningTime)))
		Best, _ := Byte.RankBytetoStruct(v)

		if Best.Game.Score < game.Score {
			Best = Struct.Rank{
				UserName: UserName,
				Game:     game,
			}
			b.Put([]byte(fmt.Sprintf("%d-%d-%d", game.Setting.Type, game.Setting.Level, game.Setting.RunningTime)), Byte.RankStructtoByte(Best))
		}

		return nil
	})
}
