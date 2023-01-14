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

	r.Run()
}

// package main

// import (
// 	"MathGame/DB"
// 	"MathGame/System"
// 	"MathGame/util"
// 	"fmt"
// 	"time"
// )

// func main() {
// 	pro, _ := System.CreateProblem(1, 1, 2)

// 	game := System.Game{
// 		Id: util.RandString(10),
// 		Setting: System.Setting{
// 			Level:       1,
// 			Type:        1,
// 			RunningTime: 30,
// 		},
// 		Problem:   pro,
// 		StartTime: time.Now(),
// 	}
// 	game.End([]System.TLog{
// 		{
// 			Problem_Id:  1,
// 			User_Answer: 1,
// 			Answer:      1,
// 			Time:        1,
// 			Ok:          true,
// 		},
// 		{
// 			Problem_Id:  1,
// 			User_Answer: 1,
// 			Answer:      1,
// 			Time:        1,
// 			Ok:          true,
// 		},
// 		{
// 			Problem_Id:  1,
// 			User_Answer: 1,
// 			Answer:      1,
// 			Time:        1,
// 			Ok:          true,
// 		},
// 		{
// 			Problem_Id:  1,
// 			User_Answer: 1,
// 			Answer:      1,
// 			Time:        1,
// 			Ok:          true,
// 		},
// 	})

// 	DB.UpdateGameLog("test", game)
// 	game.Id = util.RandString(10)
// 	DB.UpdateGameLog("test", game)
// 	data, err := DB.GetGameLog("test")
// 	fmt.Println(len(data), err)

// 	// rank, err := DB.GetRankOne(game.Setting.Type)
// 	// if err != nil {
// 	// 	fmt.Println(err)
// 	// }
// 	// fmt.Println(rank)

// 	// fmt.Println(rank.NewRank(System.Rank{
// 	// 	UserName: "test",
// 	// 	Game:     game,
// 	// }, 3))

// 	// game.Id = util.RandString(10)
// 	// game.Score = 1
// 	// fmt.Println(rank.NewRank(System.Rank{
// 	// 	UserName: "test",
// 	// 	Game:     game,
// 	// }, 3))

// 	// DB.UpdateRank(game.Setting.Type, rank)

// 	// fmt.Println(len(rank.Rank))
// }
