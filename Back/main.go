package main

import (
	"MathGame/DB"
	"MathGame/Route/User"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	User_api := r.Group("/user")
	User.Route(User_api)

	r.Use(func(ctx *gin.Context) {
		Token, err := ctx.Cookie("Token")
		_, E := DB.GetUsertoToken(Token)
		if err != nil || E != nil {
			ctx.AbortWithStatusJSON(401, gin.H{
				"message": "error",
			})
			return
		}
	})
	r.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "OK!",
		})
	})

	r.Run()
}
