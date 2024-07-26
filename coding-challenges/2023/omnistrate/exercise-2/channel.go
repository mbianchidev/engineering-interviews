// Question 2
// This question will simulate the logging process.
// 
// You have an application that writes logs to the file system. Given limitations on the type of disk we are using writing to disk can take up to 1 second. 
// 
// We have a logger library that is writing directly to disk. Our sample application takes over 15 seconds to write 30 log records. # 
// Can you implement a solution to avoid writing to disk in the main thread?  Assuming running logs in parallel will not increase the log time for each record, can you write a solution to # write the logs in parallel? 

// We learned that concurrent writing to disk causes bottlenecks as records are competing by resources. What other solution you think can help us reduce the contingency?
// 
// Test cases + expected results:
// 
// - Starvation
// - Locks 
// - Deadlocks
// - Thread safety
// - Fail gracefully

package main

import (
	"fmt"
	"log"
	"os"
	"sync"
)

var strBuffChan = make(chan string, 250)
var numLogWriters = 5
var numLogEntries = 10
var wg sync.WaitGroup

func main() {
	logFile, err := os.Create("log.txt")
	if err != nil {
		log.Fatal("Error opening log file:", err)
	}
	defer logFile.Close()

	log.SetOutput(logFile)

	for i := 0; i < numLogWriters; i++ {
		wg.Add(1)
		go logWriter(i)
	}

	for i := 1; i <= numLogEntries; i++ {
		logEntry := fmt.Sprintf("Log entry %d", i)
		strBuffChan <- logEntry
	}

	close(strBuffChan)

	wg.Wait()
}

func logWriter() {
	defer wg.Done()

	for logEntry := range strBuffChan {
		log.Println(logEntry)
	}
}
