package main

import (
	"MathGame/DB"
	"MathGame/Route/Game"
	"MathGame/Route/Ranking"
	"MathGame/Route/User"
	"MathGame/util"

	"github.com/gin-gonic/gin"
)

func main() {
	// gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	User_api := r.Group("/user")
	User.Route(User_api)

	r.Use(func(ctx *gin.Context) {
		Token, err := ctx.Cookie("Token")
		util.BadReq(err, ctx)
		_, err = DB.GetUsertoToken(Token)
		util.BadReq(err, ctx)
	})

	Game_api := r.Group("/game")
	Game.Route(Game_api)

	Rank := r.Group("/rank")
	Ranking.Route(Rank)

	r.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "OK!",
		})
	})

	r.Run()
}
