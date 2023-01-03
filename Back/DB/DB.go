package DB

import (
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
