package User

import (
	"MathGame/DB"
	"MathGame/Jwt"
	"MathGame/System"
	"MathGame/util"
	"fmt"

	"github.com/gin-gonic/gin"
)

func Route(User_api *gin.RouterGroup) {
	User_api.POST("login", func(c *gin.Context) {
		req := struct {
			UserName string `json:"username" binding:"required"`
			Password string `json:"password" binding:"required"`
		}{}
		if util.Req(&req, c) != nil {
			return
		}

		d, e := DB.GetUsertoUserName(req.UserName)
		if util.BadReq(e, c, "User not Found") != nil {
			return
		}
		if d.Password != req.Password {
			c.AbortWithStatusJSON(401, gin.H{
				"message": "Bad Request",
			})
			return
		}

		token, err := Jwt.GetJwtToken(d.UserName)
		if util.BadReq(err, c, "Jwt Token Err") != nil {
			fmt.Println(err)
			return
		}
		c.SetCookie("Token", token, 36000, "/", "localhost", false, true)
		c.JSON(200, gin.H{
			"message": "OK",
			"Token":   token,
		})
	})
	User_api.POST("register", func(c *gin.Context) {
		req := struct {
			UserName string `json:"username" binding:"required"`
			Password string `json:"password" binding:"required"`
		}{}
		if util.Req(&req, c) != nil {
			return
		}

		if _, err := DB.GetUsertoUserName(req.UserName); err != nil {
			c.AbortWithStatusJSON(401, gin.H{
				"message": "user exist",
			})
			return
		}
		e := DB.DBUpdateUser(System.User{
			UserName: req.UserName,
			Password: req.Password,
		})
		if util.BadReq(e, c, "DB Update Err") != nil {
			return
		}

		c.JSON(200, gin.H{
			"message": "OK!",
		})
	})
	d := User_api.Group("data")
	{
		d.GET("all", func(c *gin.Context) {
			token, e := c.Cookie("Token")
			if util.BadReq(e, c, "Token Load Err") != nil {
				return
			}
			User_Data, err := DB.GetUsertoToken(token)
			if util.BadReq(err, c, "DB User Load Err") != nil {
				return
			}
			games, err := DB.GetGameLog(User_Data.UserName)
			if util.BadReq(err, c, "Load Game Err") != nil {
				return
			}

			c.JSON(200, gin.H{
				"message": "OK!",
				"best":    User_Data.Best,
				"games":   games,
			})
		})
		d.GET("best", func(c *gin.Context) {
			token, e := c.Cookie("Token")
			if util.BadReq(e, c, "Load Token Err") != nil {
				return
			}
			User_Data, err := DB.GetUsertoToken(token)
			if util.BadReq(err, c, "Load User Err") != nil {
				return
			}
			c.JSON(200, gin.H{
				"message": "OK!",
				"best":    User_Data.Best,
			})
		})
	}
}
