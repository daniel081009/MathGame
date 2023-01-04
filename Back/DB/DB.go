package DB

import (
	"MathGame/Byte"
	"MathGame/Jwt"
	"MathGame/Struct"
	"errors"
	"fmt"
	"log"

	"github.com/boltdb/bolt"
)

const (
	Dbpath     = "my.db"
	MainBucket = "MainBucket"
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
			userd, _ := Byte.BytetoStruct(v)
			user = userd
		} else {
			return errors.New("user not found")
		}
		return nil
	})
	return user, nil
}

func GetUsertoUserName(UserName string) (Struct.User, error) {
	var user Struct.User
	db := DB()
	defer db.Close()
	db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(MainBucket))
		v := b.Get([]byte(UserName))
		if v != nil {
			userd, _ := Byte.BytetoStruct(v)
			user = userd
		} else {
			return errors.New("user not found")
		}
		return nil
	})
	return user, nil
}
