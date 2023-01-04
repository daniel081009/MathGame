package Byte

import (
	"MathGame/Struct"
	"bytes"
	"encoding/gob"
	"log"
)

func StructtoByte(u Struct.User) []byte {
	buf := bytes.Buffer{}
	enc := gob.NewEncoder(&buf)
	err := enc.Encode(u)
	if err != nil {
		log.Fatal("encode error:", err)
	}
	return buf.Bytes()
}
func BytetoStruct(Byte []byte) (Struct.User, error) {
	dec := gob.NewDecoder(bytes.NewReader(Byte))
	u := Struct.User{}
	err := dec.Decode(&u)
	if err != nil {
		return Struct.User{}, err
	}
	return u, nil
}
