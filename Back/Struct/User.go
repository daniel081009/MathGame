package Struct

type User struct {
	UserName string
	Password string
	Game     map[int]Game
	Best     map[int]struct {
		Tear int // 0 : null, 1 : bronze, 2 : silver, 3 : gold, 4 : diamond, 5 : platinum, 6 : master, 7 : grandmaster
		Best Rank
	} // 0: 덧셈, 1: 뺄셈, 2: 곱셈, 3: 나눗셈, 4: 사칙연산
}
