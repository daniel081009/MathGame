package System

type User struct {
	UserName string
	Password string
	Best     map[int]Rank
}

func (u *User) Init() {
	if u.Best == nil {
		u.Best = make(map[int]Rank)
	}
}
func (u *User) CheckBest(game Game) {
	if data, exzist := u.Best[game.Setting.Type]; !exzist {
		u.Best[game.Setting.Type] = Rank{
			UserName: u.UserName,
			Game:     game,
		}
	} else {
		if data.Game.Score < game.Score {
			u.Best[game.Setting.Type] = Rank{
				UserName: u.UserName,
				Game:     game,
			}
		}
	}
}
