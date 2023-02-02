package main

import (
	"MathGame/DB"
	"MathGame/Route/Game"
	"MathGame/Route/Ranking"
	"MathGame/Route/User"
	"MathGame/util"
	"log"

	"github.com/gin-gonic/autotls"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/acme/autocert"
)

func main() {
	// gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:1234")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})
	User_api := r.Group("/user")
	User.Route(User_api)

	r.Use(func(ctx *gin.Context) {
		Token, err := ctx.Cookie("Token")
		if util.BadReq(err, ctx, "Token not found") != nil {
			return
		}
		_, err = DB.GetUsertoToken(Token)
		if util.BadReq(err, ctx, "Token not found") != nil {
			return
		}
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

	m := autocert.Manager{
		Prompt:     autocert.AcceptTOS,
		HostPolicy: autocert.HostWhitelist("math.daoh.dev"),
		Cache:      autocert.DirCache("./certs"),
	}

	log.Fatal(autotls.RunWithManager(r, &m))
}
