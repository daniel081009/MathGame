package util

import (
	"math/rand"
	"strconv"

	"github.com/gin-gonic/gin"
)

func Req(dan any, c *gin.Context) int {
	err := c.ShouldBind(&dan)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{
			"message": "bad request body",
		})
		return 0
	}
	return 1
}
func BadReq(err error, ctx *gin.Context) {
	if err != nil {
		ctx.AbortWithStatusJSON(400, gin.H{
			"message": "bad request",
		})
	}
}
func StrToInt(s string) int {
	n, err := strconv.Atoi(s)
	if err != nil {
		return 0
	}
	return n
}

func RandInt(min int, max int) int {
	return min + rand.Intn(max-min)
}
