package Struct

import (
	"MathGame/util"
	"errors"
	"strconv"
	"time"
)

type User struct {
	UserName string
	Password string
	Game     map[int]Game
	Tear     int // 0 : null, 1 : bronze, 2 : silver, 3 : gold, 4 : diamond, 5 : platinum, 6 : master, 7 : grandmaster
}

func CreateProblem(Type int, Level int, len int) (map[int]Problem, error) {
	if Level < 0 || Level > 2 {
		return nil, errors.New("level must be 0~2")
	}
	if Type < 0 || Type > 3 {
		return nil, errors.New("type must be 0~3")
	}

	min, max := 0, 0

	if Level == 0 {
		min, max = 0, 10
	} else if Level == 1 {
		min, max = 0, 20
	} else if Level == 2 {
		min, max = 0, 50
	}
	problem := map[int]Problem{}
	for i := 0; i < len; i++ {
		a, b := util.RandInt(min, max), util.RandInt(min, max)
		if Type == 0 {
			problem[i] = Problem{
				Type:    Type,
				Problem: strconv.Itoa(a) + "+" + strconv.Itoa(b),
				Answer:  a + b,
			}
		} else if Type == 1 {
			if a < b {
				a, b = b, a
			}
			problem[i] = Problem{
				Type:    Type,
				Problem: strconv.Itoa(a) + "-" + strconv.Itoa(b),
				Answer:  a - b,
			}
		} else if Type == 2 {
			problem[i] = Problem{
				Type:    Type,
				Problem: strconv.Itoa(a) + "*" + strconv.Itoa(b),
				Answer:  a * b,
			}
		} else if Type == 3 {
			if a < b {
				a, b = b, a
			}
			problem[i] = Problem{
				Type:    Type,
				Problem: strconv.Itoa(a) + "/" + strconv.Itoa(b),
				Answer:  a / b,
			}
		}
	}
	return problem, nil
}

func (u *User) CreateGame(Type int, Level int, RunningTime int) (int, error) {
	if u.Game == nil {
		u.Game = map[int]Game{}
	}
	Pro, err := CreateProblem(Type, Level, 500)
	if err != nil {
		return 0, err
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
		Problem:   Pro,
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
	Problem      map[int]Problem
	LongProblem  []TLog
	WrongProblem []TLog
	TLog         []TLog

	StartTime time.Time
	EndTime   time.Time
	EndGame   int // 0 = not end, 1 = end ,2 = time out
}
type Problem struct {
	Type    int // 0:+ 1:-  2:*  3:/
	Problem string
	Answer  int
}
type Setting struct {
	Type        int // 0:+ 1:-  2:*  3:/
	Level       int // 0: 0~10 1: 0~20 2: 0~50
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
	Problem_Id  int
	User_Answer int
	Answer      int
	Time        int
	Ok          bool
}

type Rank struct {
	UserName string
	Game     Game
}
