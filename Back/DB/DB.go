package DB

import (
	"MathGame/Jwt"
	"MathGame/System"
	"MathGame/util"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/boltdb/bolt"
)

const (
	UserPath   = "user.db"
	GamePath   = "game.db"
	RankPath   = "Rank.db"
	UserBucket = "UserBucket"
	RankBucket = "RankBucket"
)

func DB(path string) bolt.DB {
	db, err := bolt.Open(path, 0600, &bolt.Options{Timeout: 100 * time.Millisecond})
	if err != nil {
		log.Fatal(err)
	}

	db.Update(func(tx *bolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists([]byte(UserBucket))
		if err != nil {
			return fmt.Errorf("create bucker: %s", err)
		}
		_, err = tx.CreateBucketIfNotExists([]byte(RankBucket))
		if err != nil {
			return fmt.Errorf("create bucker: %s", err)
		}
		return nil
	})

	return *db
}
func GetUsertoToken(Token string) (System.User, error) {
	var user System.User
	db := DB(UserPath)
	defer db.Close()
	e := db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(UserBucket))
		token, e := Jwt.ParseJwtToken(Token)
		if e != nil {
			return errors.New("token error")
		}

		v := b.Get([]byte(token.UserName))
		if v != nil {
			util.BytetoStruct(v, &user)
		} else {
			return errors.New("user not found")
		}
		return nil
	})
	if e != nil {
		return System.User{}, e
	}
	return user, nil
}
func DBUpdateUser(user System.User) error {
	db := DB(UserPath)
	defer db.Close()
	err := db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(UserBucket))
		e := b.Put([]byte(user.UserName), util.StructtoByte(user))
		return e
	})
	return err
}

func GetUsertoUserName(UserName string) (System.User, error) {
	var user System.User
	db := DB(UserPath)
	defer db.Close()
	db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(UserBucket))
		v := b.Get([]byte(UserName))
		if v != nil {
			user = System.User{}
			util.BytetoStruct(v, &user)
		} else {
			return errors.New("user not found")
		}
		return nil
	})
	return user, nil
}
func GetGameLog(UserName string) (map[string]System.Game, error) {
	db := DB(GamePath)
	defer db.Close()

	var GameLog map[string]System.Game = make(map[string]System.Game)
	err := db.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte(UserName))
		if err != nil {
			return err
		}
		c := b.Cursor()
		for k, v := c.First(); k != nil; k, v = c.Next() {
			var game System.Game
			util.BytetoStruct(v, &game)
			GameLog[game.Id] = game
		}
		return nil
	})

	return GameLog, err
}
func GetGameLogOne(UserName string, Id string) (System.Game, error) {
	db := DB(GamePath)
	defer db.Close()

	var game System.Game
	err := db.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte(UserName))
		if err != nil {
			return err
		}
		v := b.Get([]byte(Id))
		if v != nil {
			util.BytetoStruct(v, &game)
		} else {
			return errors.New("game not found")
		}
		return nil
	})

	return game, err
}
func UpdateGameLog(UserName string, game System.Game) error {
	db := DB(GamePath)
	defer db.Close()

	err := db.Update(func(tx *bolt.Tx) error {
		b, err := tx.CreateBucketIfNotExists([]byte(UserName))
		if err != nil {
			return err
		}

		err = b.Put([]byte(game.Id), util.StructtoByte(game))
		return err
	})
	return err
}
func GetRank() (map[int]System.Ranking, error) {
	db := DB(RankPath)
	defer db.Close()

	var Rank map[int]System.Ranking
	e := db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(RankBucket))
		c := b.Cursor()
		for k, v := c.First(); k != nil; k, v = c.Next() {
			var rank System.Ranking
			util.BytetoStruct(v, &rank)
			Rank[util.ByteToInt(k)] = rank
		}
		return nil
	})
	return Rank, e
}
func GetRankOne(id int) (System.Ranking, error) {
	db := DB(RankPath)
	defer db.Close()

	var Rank System.Ranking
	e := db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(RankBucket))
		util.BytetoStruct(b.Get(util.IntoByte(id)), &Rank)
		return nil
	})
	return Rank, e
}
func UpdateRank(id int, Rank System.Ranking) error {
	db := DB(RankPath)
	defer db.Close()

	err := db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(RankBucket))
		err := b.Put(util.IntoByte(id), util.StructtoByte(Rank))
		return err
	})
	return err
}
