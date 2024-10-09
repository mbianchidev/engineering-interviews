// Design a key value store which can perform all the following operations in Θ(1)
// V get(K)
// Methods required: 
// create(k, v)
// update(k, v)
// delete(k)
// (K,V) getRandom()
//
// map[int]int 

package main

import (
	"fmt"
	"math/rand"
	"time"
)

type KeyValueStore struct {
	data      map[int]int  // KV pairs
	keys      []int        // keys stored for O1 random access
	keyIndex  map[int]int  // index for efficient? deletion
}

// Creating the object and returning a pointer to it
func NewKeyValueStore() *KeyValueStore {
	return &KeyValueStore{
		data:     make(map[int]int),
		keys:     []int{},
		keyIndex: make(map[int]int),
	}
}

// Just a create operation, nothing too fancy
func (kvs *KeyValueStore) Create(key, value int) {
	if _, exists := kvs.data[key]; !exists {
		kvs.keys = append(kvs.keys, key)
		kvs.keyIndex[key] = len(kvs.keys) - 1
	}
	kvs.data[key] = value
}

// Edit
func (kvs *KeyValueStore) Update(key, value int) {
	kvs.Create(key, value) // create used to both edit and create
}

// Removing a pair
func (kvs *KeyValueStore) Delete(key int) {
	if _, exists := kvs.data[key]; exists {
		delete(kvs.data, key)
		index := kvs.keyIndex[key]
		lastKey := kvs.keys[len(kvs.keys)-1]
		kvs.keys[index] = lastKey
		kvs.keyIndex[lastKey] = index
		kvs.keys = kvs.keys[:len(kvs.keys)-1]
		delete(kvs.keyIndex, key)
	}
}

// Gets value associated with a key
func (kvs *KeyValueStore) Get(key int) (int, bool) {
	value, exists := kvs.data[key]
	return value, exists
}

// Retrieves a random pair
func (kvs *KeyValueStore) GetRandom() (int, int, bool) {
	if len(kvs.keys) == 0 {
		return 0, 0, false
	}
	rand.Seed(time.Now().UnixNano())
	randomKey := kvs.keys[rand.Intn(len(kvs.keys))]
	return randomKey, kvs.data[randomKey], true
}

func main() {
	kvs := NewKeyValueStore()

	// Init paris
	kvs.Create(1, 100)
	kvs.Create(2, 200)
	kvs.Create(3, 300)

    // Test some operations

	kvs.Update(2, 250)

	if value, exists := kvs.Get(2); exists {
		fmt.Println("Value for key 2:", value)
	}

	if key, value, exists := kvs.GetRandom(); exists {
		fmt.Printf("Random key-value: (%d, %d)\n", key, value)
	}

	kvs.Delete(2)

	if _, exists := kvs.Get(2); !exists {
		fmt.Println("Key 2 has been deleted")
	}
}
