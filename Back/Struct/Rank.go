package Struct

type Rank struct {
	UserName string
	Game     Game
}

type Ranking struct {
	Rank []Rank
}

func (r *Ranking) Init() {
	if r.Rank == nil {
		r.Rank = []Rank{}
	}
}
func (r *Ranking) NewRank(rank Rank) int {
	ranknum := 0
	if len(r.Rank) == 0 {
		r.Rank = append(r.Rank, rank)
		return 1
	}

	for i := len(r.Rank) - 1; i >= 0; i-- {
		if r.Rank[i].Game.Score > rank.Game.Score {
			ranknum = i + 2
			r.Rank = append(r.Rank[:i+1], append([]Rank{rank}, r.Rank[i+1:]...)...)
			break
		} else if i == 0 {
			r.Rank = append([]Rank{rank}, r.Rank...)
			ranknum = 1
			break
		}
	}

	return ranknum
}
