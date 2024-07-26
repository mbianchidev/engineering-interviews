package main

import (
	"bytes"
	"fmt"
	"testing"
	"sync"
	"time"
)

var numLogWriters = 3
var numLogEntries = 5

func TestLogWriter(t *testing.T) {
	var buf bytes.Buffer
	log.SetOutput(&buf)

	for i := 0; i < numLogWriters; i++ {
		wg.Add(1)
		go logWriter(i)
	}

	for i := 1; i <= numLogEntries; i++ {
		logEntry := fmt.Sprintf("Test log entry %d", i)
		logChannel <- logEntry
	}

	close(logChannel)
	wg.Wait()

	expectedLogs := []string{
		"Processor 1 - Test log entry 1\n",
		"Processor 1 - Test log entry 2\n",
		"Processor 1 - Test log entry 3\n",
		"Processor 1 - Test log entry 4\n",
		"Processor 1 - Test log entry 5\n",
	}

	actualLogs := buf.String()

	for _, expectedLog := range expectedLogs {
		if !bytes.Contains(buf.Bytes(), []byte(expectedLog)) {
			t.Errorf("Expected log entry not found in output: %s", expectedLog)
		}
	}

	for _, unexpectedLog := range []string{"Unexpected log entry", "This should not be in the log"} {
		if bytes.Contains(buf.Bytes(), []byte(unexpectedLog)) {
			t.Errorf("Unexpected log entry found in output: %s", unexpectedLog)
		}
	}
}

// Starvation test
func TestStarvation(t *testing.T) {
	var lock sync.Mutex
	const numGoroutines = 10
	const maxWaitTime = 10 * time.Millisecond

	var wg sync.WaitGroup
	for i := 0; i < numGoroutines; i++ {
		wg.Add(1)
		go func() {
			lock.Lock()
			time.Sleep(maxWaitTime)
			lock.Unlock()
			wg.Done()
		}()
	}

	if success := waitTimeout(&wg, 2*time.Second); !success {
		t.Error("Starvation test failed: Some Goroutines are starved.")
	}
}

// Deadlock test
func TestDeadlock(t *testing.T) {
	var lock1, lock2 sync.Mutex
	const numGoroutines = 2

	var wg sync.WaitGroup
	wg.Add(numGoroutines)

	go func() {
		lock1.Lock()
		time.Sleep(10 * time.Millisecond)
		lock2.Lock()
		lock1.Unlock()
		lock2.Unlock()
		wg.Done()
	}()

	go func() {
		lock2.Lock()
		time.Sleep(10 * time.Millisecond)
		lock1.Lock()
		lock2.Unlock()
		lock1.Unlock()
		wg.Done()
	}()

	if success := waitTimeout(&wg, 2*time.Second); !success {
		t.Error("Deadlock test failed: Deadlock detected.")
	}
}

// Thread safety test
func TestThreadSafety(t *testing.T) {
	const numGoroutines = 10
	const numIterations = 1000

	var counter int
	var lock sync.Mutex

	var wg sync.WaitGroup
	for i := 0; i < numGoroutines; i++ {
		wg.Add(1)
		go func() {
			for j := 0; j < numIterations; j++ {
				lock.Lock()
				counter++
				lock.Unlock()
			}
			wg.Done()
		}()
	}

	wg.Wait()

	if counter != numGoroutines*numIterations {
		t.Error("Thread safety test failed: Counter value is inconsistent.")
	}
}

// Utility function to wait for WaitGroup with timeout
func waitTimeout(wg *sync.WaitGroup, timeout time.Duration) bool {
	c := make(chan struct{})
	go func() {
		defer close(c)
		wg.Wait()
	}()
	select {
	case <-c:
		return true // WaitGroup has completed
	case <-time.After(timeout):
		return false // Timeout occurred
	}
}
