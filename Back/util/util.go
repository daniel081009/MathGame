package util

import (
	"bytes"
	"encoding/gob"
	"log"
	"math/big"
	"math/rand"
	"strconv"

	"github.com/gin-gonic/gin"
)

func Req(dan any, c *gin.Context) error {
	err := c.ShouldBind(&dan)
	if BadReq(err, c) != nil {
		return err
	}
	return nil
}
func BadReq(err error, ctx *gin.Context) error {
	if err != nil {
		ctx.AbortWithStatusJSON(400, gin.H{
			"message": "bad request",
		})
	}
	return err
}

var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")

func RandString(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
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
func IntoByte(n int) []byte {
	return big.NewInt(int64(n)).Bytes()
}
func ByteToInt(b []byte) int {
	return int(big.NewInt(0).SetBytes(b).Int64())
}

func StructtoByte(u interface{}) []byte {
	buf := bytes.Buffer{}
	enc := gob.NewEncoder(&buf)
	err := enc.Encode(u)
	if err != nil {
		log.Fatal("encode error:", err)
	}
	return buf.Bytes()
}
func BytetoStruct(Byte []byte, obj any) error {
	dec := gob.NewDecoder(bytes.NewReader(Byte))
	err := dec.Decode(obj)
	if err != nil {
		return err
	}
	return nil
}
