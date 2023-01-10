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
		util.Req(&req, c)

		d, e := DB.GetUsertoUserName(req.UserName)
		if d.Password != req.Password {
			c.AbortWithStatusJSON(401, gin.H{
				"message": "Bad Request",
			})
			return
		}

		if e != nil {
			c.AbortWithStatusJSON(401, gin.H{
				"message": "Bad Request",
			})
			return
		}
		token, _ := Jwt.GetJwtToken(d.UserName)
		c.SetCookie("Token", token, 36000, "/", "localhost", false, true)
		c.JSON(200, gin.H{
			"message": "OK",
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
		fmt.Println(req)

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
		if util.BadReq(e, c) != nil {
			return
		}

		c.JSON(200, gin.H{
			"message": "OK!",
		})
	})
}
