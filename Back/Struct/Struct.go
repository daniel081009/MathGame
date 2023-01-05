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

func (u *User) CreateGame(Type int, Level int, RunningTime int) (int, error) {
	if u.Game == nil {
		u.Game = map[int]Game{}
	}
	if Level < 0 || Level > 2 {
		return 0, errors.New("level must be 0~2")
	}
	id := len(u.Game)
	u.Game[id] = Game{
		Setting: Setting{
			Type:        Type,
			Level:       Level,
			RunningTime: RunningTime,
		},
		StartTime: time.Now(),
		TLog:      []TLog{},
		EndGame:   0,
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
	return id, nil
}

type Game struct {
	Setting Setting

	Score        int
	AverageTime  int
	LongProblem  []TLog
	WrongProblem []TLog

	TLog      []TLog
	StartTime time.Time
	EndTime   time.Time
	EndGame   int // 0 = not end, 1 = end ,2 = time out
}
type Setting struct {
	Type        int // 0:+ 1:-  2:*  3:/
	Level       int // 0: 0~10 1: 0~99 2: 0~1000
	RunningTime int // 30 = 30s, 60 = 1m , 180 = 3m, 3000 = 5m
}

func (g *Game) End(UserName string, TLog []TLog) {
	avg := 0
	for _, v := range TLog {
		avg += v.Time
	}
	avg /= len(TLog)

	for _, v := range TLog {
		if !v.Ok {
			g.WrongProblem = append(g.WrongProblem, v)
		} else if v.Time > avg {
			g.LongProblem = append(g.LongProblem, v)
			g.Score++
		} else {
			g.Score++
		}
		g.TLog = append(g.TLog, v)
	}

	g.AverageTime = avg
	g.EndGame = 1
	g.EndTime = time.Now()
}

type TLog struct {
	Problem     string
	User_Answer int
	Answer      int
	Time        int
	Ok          bool
}

type Rank struct {
	UserName string
	Game     Game
}
