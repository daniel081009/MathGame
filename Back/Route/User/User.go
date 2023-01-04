package User

import (
	"MathGame/Byte"
	"MathGame/DB"
	"MathGame/Jwt"
	"MathGame/Struct"
	"MathGame/util"
	"errors"

	"github.com/boltdb/bolt"
	"github.com/gin-gonic/gin"
)

func Route(User_api *gin.RouterGroup) {
	User_api.POST("login", func(c *gin.Context) {
		req := struct {
			UserName string `json:"username" binding:"required"`
			Password string `json:"password" binding:"required"`
		}{}
		util.Req(&req, c)

		d, e := DB.GetUsertoUserName(req.UserName)
		if d.Password != req.Password {
			c.AbortWithStatusJSON(401, gin.H{
				"message": "error",
			})
		}

		if e != nil {
			c.AbortWithStatusJSON(401, gin.H{
				"message": "error",
			})
			return
		}
		token, _ := Jwt.GetJwtToken(d.UserName)
		c.SetCookie("Token", token, 36000, "/", "localhost", false, true)
		c.JSON(200, gin.H{
			"message": "OK!",
		})
	})
	User_api.POST("register", func(c *gin.Context) {
		req := struct {
			UserName string `json:"username" binding:"required"`
			Password string `json:"password" binding:"required"`
		}{}
		util.Req(&req, c)

		db := DB.DB()
		defer db.Close()

		e := db.Update(func(tx *bolt.Tx) error {
			b := tx.Bucket([]byte(DB.MainBucket))
			v := b.Get([]byte(req.UserName))
			if v != nil {
				c.AbortWithStatusJSON(401, gin.H{
					"message": "user exist",
				})
				return errors.New("user exist")
			}
			User_data := Struct.User{
				UserName: req.UserName,
				Password: req.Password,
				Game:     map[int]Struct.Game{},
			}
			b.Put([]byte(req.UserName), Byte.StructtoByte(User_data))
			return nil
		})
		if e != nil {
			return
		}

		c.JSON(200, gin.H{
			"message": "OK!",
		})
	})
}
