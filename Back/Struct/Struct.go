package Struct

import (
	"errors"
	"time"
)

type User struct {
	UserName string
	Password string
	Game     map[int]Game
}

func (u *User) CreateGame(Type int, Level int, RunningTime int) error {
	if u.Game == nil {
		u.Game = map[int]Game{}
	}
	if Level < 0 || Level > 2 {
		return errors.New("level must be 0~2")
	}
	id := len(u.Game)
	u.Game[id] = Game{
		Type: Type,
		// Problem:     map[int]Problem{},
		StartTime:   time.Now(),
		TLog:        []TLog{},
		Level:       Level,
		RunningTime: RunningTime,
		EndGame:     0,
	}
	go func() {
		RunningTime++
		time.Sleep(time.Second * time.Duration(RunningTime))
		if u.Game[id].EndGame != 0 {
			return
		}
		if data, ok := u.Game[id]; ok {
			data.EndGame = 2
			data.EndTime = time.Now()
			u.Game[id] = data
		}
	}()
	time.Sleep(time.Second * time.Duration(1))
	if data, ok := u.Game[id]; ok {
		data.End(50)
		u.Game[id] = data
	}
	return nil
}

type Game struct {
	Type  int // 0:+ 1:-  2:*  3:/
	Score int
	Level int // 0: 0~10 1: 0~99 2: 0~1000
	// Problem     map[int]Problem
	TLog        []TLog
	RunningTime int // 30 = 30s, 60 = 1m , 180 = 3m, 3000 = 5m
	StartTime   time.Time
	EndTime     time.Time
	EndGame     int // 0 = not end, 1 = end ,2 = time out
}

func (g *Game) End(Score int) {
	g.EndTime = time.Now()
	g.Score = Score
	g.EndGame = 1
}

type Problem struct {
	Problem string
	Answer  int
}
type TLog struct {
	Problem_Id  int
	User_Answer int
	Answer      int
	Time        int
	Ok          bool
}
