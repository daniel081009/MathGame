package main

import (
	"MathGame/DB"
	"MathGame/Route/Game"
	"MathGame/Route/Ranking"
	"MathGame/Route/User"
	"MathGame/util"
	"log"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/autotls"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/acme/autocert"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	main := gin.Default()

	main.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	main.Use(static.Serve("/", static.LocalFile("../Front/dist", false)))

	User_api := main.Group("/user")
	User.Route(User_api)

	Game_api := main.Group("/game", func(ctx *gin.Context) {
		Token, err := ctx.Cookie("Token")
		if util.BadReq(err, ctx, "Token not found") != nil {
			return
		}
		_, err = DB.GetUsertoToken(Token)
		if util.BadReq(err, ctx, "Token not found") != nil {
			return
		}
	})
	Game.Route(Game_api)

	Rank := main.Group("/rank", func(ctx *gin.Context) {
		Token, err := ctx.Cookie("Token")
		if util.BadReq(err, ctx, "Token not found") != nil {
			return
		}
		_, err = DB.GetUsertoToken(Token)
		if util.BadReq(err, ctx, "Token not found") != nil {
			return
		}
	})
	Ranking.Route(Rank)

	m := autocert.Manager{
		Prompt:     autocert.AcceptTOS,
		HostPolicy: autocert.HostWhitelist("math.daoh.dev"),
		Cache:      autocert.DirCache("./certs"),
	}

	log.Fatal(autotls.RunWithManager(main, &m))
	// main.Run(":8080")
}
