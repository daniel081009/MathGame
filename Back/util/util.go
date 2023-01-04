package util

import (
	"github.com/gin-gonic/gin"
)

func Req(dan any, c *gin.Context) int {
	err := c.ShouldBind(&dan)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{
			"message": "bad request",
		})
		return 0
	}
	return 1
}
