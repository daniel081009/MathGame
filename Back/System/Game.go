package System

import (
	"MathGame/util"
	"errors"
	"strconv"
	"time"
)

type Game struct {
	Id      string
	Setting Setting

	Score        int
	AverageTime  int
	Problem      []Problem
	LongProblem  []TLog
	WrongProblem []TLog
	TLog         []TLog

	RankGame  bool
	StartTime time.Time
	EndTime   time.Time
	EndGame   int // 0 = not end, 1 = end ,2 = time out
}
type Problem struct {
	Type    int // 0:+ 1:-  2:*  3:/
	Problem string
	Answer  int
}

func CreateProblem(Type int, Level int, len int) ([]Problem, error) {
	if Level < 0 || Level > 2 {
		return nil, errors.New("level must be 0~2 but " + strconv.Itoa(Level))
	}
	if Type < 0 || Type > 4 {
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
	problem := []Problem{}
	for i := 0; i < len; i++ {
		a, b := util.RandInt(min, max), util.RandInt(min, max)
		if Type == 0 {
			problem = append(problem, Problem{
				Type:    Type,
				Problem: strconv.Itoa(a) + "+" + strconv.Itoa(b),
				Answer:  a + b,
			})
		} else if Type == 1 {
			if a < b {
				a, b = b, a
			}
			problem = append(problem, Problem{
				Type:    Type,
				Problem: strconv.Itoa(a) + "-" + strconv.Itoa(b),
				Answer:  a - b,
			})
		} else if Type == 2 {
			problem = append(problem, Problem{
				Type:    Type,
				Problem: strconv.Itoa(a) + "*" + strconv.Itoa(b),
				Answer:  a * b,
			})
		} else if Type == 3 {
			a, b = util.RandInt(min, max), util.RandInt(min, max)
			c := a * b
			if c == 0 && a == 0 {
				a = 1
			}
			if c > Level {
				return CreateProblem(Type, Level, 1)
			}

			problem = append(problem, Problem{
				Type:    Type,
				Problem: strconv.Itoa(c) + "/" + strconv.Itoa(a),
				Answer:  b,
			})
		} else if Type == 4 {
			c := util.RandInt(0, 4)
			data, _ := CreateProblem(c, Level, 1)
			problem = append(problem, data[0])
		}
	}
	return problem, nil
}

type Setting struct {
	Type        int `json:"type"`        // 0:+ 1:-  2:*  3:/ , 4:all
	Level       int `json:"level"`       // 0: 0~10 1: 0~20 2: 0~50
	RunningTime int `json:"runningtime"` // 30 = 30s, 60 = 1m , 180 = 3m, 3000 = 5m
}

func (g *Game) End(TLog []TLog) {
	avg := 0
	for _, v := range TLog {
		avg += v.Time
	}
	if len(TLog) == 0 {
		g.EndGame = 2
		return
	}

	avg /= len(TLog)

	for _, v := range TLog {
		if v.Answer != v.User_Answer {
			g.WrongProblem = append(g.WrongProblem, v)
			g.Score--
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
}
