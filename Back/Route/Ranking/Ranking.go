package Ranking

import (
	"MathGame/DB"
	"MathGame/util"

	"github.com/gin-gonic/gin"
)

func Route(rank_api *gin.RouterGroup) {
	rank_api.POST("create", func(ctx *gin.Context) {
		token := ctx.PostForm("token")
		_, err := DB.GetUsertoToken(token)
		util.BadReq(err, ctx)

		// ToDo : Create Ranking Game
	})
	rank_api.POST("end", func(ctx *gin.Context) {
		token := ctx.PostForm("token")
		_, err := DB.GetUsertoToken(token)
		util.BadReq(err, ctx)

		// ToDo : End Ranking Game
		// if mybestscore > bestscore {checkRank(token, mybestscore)}
	})
	rank_api.GET("get", func(ctx *gin.Context) {
		token := ctx.Query("token")
		_, err := DB.GetUsertoToken(token)
		util.BadReq(err, ctx)

		// ToDo : Get Ranking Game
	})
}
