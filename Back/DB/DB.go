package DB

import (
	"MathGame/Jwt"
	"MathGame/Struct"
	"MathGame/util"
	"errors"
	"fmt"
	"log"

	"github.com/boltdb/bolt"
)

const (
	Dbpath     = "my.db"
	MainBucket = "MainBucket"
	RankBucket = "RankBucket"
)

func DB() bolt.DB {
	db, err := bolt.Open(Dbpath, 0600, nil)
	if err != nil {
		log.Fatal(err)
	}

	db.Update(func(tx *bolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists([]byte(MainBucket))
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
func GetUsertoToken(Token string) (Struct.User, error) {
	var user Struct.User
	db := DB()
	defer db.Close()
	db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(MainBucket))
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
	return user, nil
}
func DBUpdateUser(user Struct.User) error {
	db := DB()
	defer db.Close()
	err := db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(MainBucket))
		e := b.Put([]byte(user.UserName), util.StructtoByte(user))
		return e
	})
	return err
}

func GetUsertoUserName(UserName string) (Struct.User, error) {
	var user Struct.User
	db := DB()
	defer db.Close()
	db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(MainBucket))
		v := b.Get([]byte(UserName))
		if v != nil {
			user = Struct.User{}
			util.BytetoStruct(v, &user)
		} else {
			return errors.New("user not found")
		}
		return nil
	})
	return user, nil
}
