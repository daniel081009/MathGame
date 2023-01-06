package Byte

import (
	"MathGame/Struct"
	"bytes"
	"encoding/gob"
	"log"
)

func UserStructtoByte(u Struct.User) []byte {
	buf := bytes.Buffer{}
	enc := gob.NewEncoder(&buf)
	err := enc.Encode(u)
	if err != nil {
		log.Fatal("encode error:", err)
	}
	return buf.Bytes()
}
func UserBytetoStruct(Byte []byte) (Struct.User, error) {
	dec := gob.NewDecoder(bytes.NewReader(Byte))
	u := Struct.User{}
	err := dec.Decode(&u)
	if err != nil {
		return Struct.User{}, err
	}
	return u, nil
}

func RankStructtoByte(u []Struct.Rank) []byte {
	buf := bytes.Buffer{}
	enc := gob.NewEncoder(&buf)
	err := enc.Encode(u)
	if err != nil {
		log.Fatal("encode error:", err)
	}
	return buf.Bytes()
}
func RankBytetoStruct(Byte []byte) ([]Struct.Rank, error) {
	dec := gob.NewDecoder(bytes.NewReader(Byte))
	u := []Struct.Rank{}
	err := dec.Decode(&u)
	if err != nil {
		return []Struct.Rank{}, err
	}
	return u, nil
}
