package main

import (
	"fmt"
	"sync"
	"time"
)

type TreeNode struct {
	Value    int
	Children []*TreeNode
}

type NodeCountCallback func(int)

const TimeoutDuration = 2 * time.Second

const CheckInterval = 1 * time.Second

// Part 0: Traverse to count all nodes in a tree
func CountNodes(node *TreeNode) int {
	if node == nil {
		return 0
	}
	count := 1
	for _, child := range node.Children {
		count += CountNodes(child)
	}
	return count
}

// Part 1: Distributed node counting with Async + Callback
func countNodesAsync(node *TreeNode, callback NodeCountCallback, wg *sync.WaitGroup) {
	defer wg.Done()
	if node == nil {
		callback(0)
		return
	}

	count := 1
	childWg := sync.WaitGroup{}
	for _, child := range node.Children {
		childWg.Add(1)
		go countNodesAsync(child, func(c int) {
			count += c
		}, &childWg)
	}

	childWg.Wait()
	callback(count)
}

// Part 2: Handling Node Failure with Timeout
func countNodesAsyncWithTimeout(node *TreeNode, callback NodeCountCallback, wg *sync.WaitGroup) {
	defer wg.Done()
	if node == nil {
		callback(0)
		return
	}

	count := 1
	childWg := sync.WaitGroup{}
	for _, child := range node.Children {
		childWg.Add(1)
		go func(cNode *TreeNode) {
			defer childWg.Done()
			done := make(chan int)
			go countNodesAsyncWithTimeout(cNode, func(c int) {
				done <- c
			}, &childWg)

			select {
			case childCount := <-done:
				count += childCount
			case <-time.After(TimeoutDuration):
				fmt.Printf("Child node %d failed to respond in time\n", cNode.Value)
			}
		}(child)
	}

	childWg.Wait()
	callback(count)
}

// Part 3: Handling Grey Failure
func monitorGreyFailure(node *TreeNode, wg *sync.WaitGroup, callback NodeCountCallback, monitorChan chan int) {
	select {
	case count := <-monitorChan:
		callback(count)
	case <-time.After(TimeoutDuration + CheckInterval):
		fmt.Printf("Grey failure detected in node %d\n", node.Value)
		callback(0)
	}
}

func countNodesAsyncWithGreyFailureDetection(node *TreeNode, callback NodeCountCallback, wg *sync.WaitGroup) {
	defer wg.Done()
	if node == nil {
		callback(0)
		return
	}

	count := 1
	childWg := sync.WaitGroup{}
	for _, child := range node.Children {
		childWg.Add(1)
		go func(cNode *TreeNode) {
			defer childWg.Done()
			done := make(chan int)
			go countNodesAsyncWithGreyFailureDetection(cNode, func(c int) {
				done <- c
			}, &childWg)

			// this monitors for grey failure in child node
			monitorChan := make(chan int)
			go monitorGreyFailure(cNode, &childWg, func(c int) {
				count += c
			}, monitorChan)

			select {
			case childCount := <-done:
				monitorChan <- childCount
			case <-time.After(TimeoutDuration):
				fmt.Printf("Child node %d failed to respond in time\n", cNode.Value)
			}
		}(child)
	}

	childWg.Wait()
	callback(count)
}

func main() {
	// Just init a tree with some nodes
	root := &TreeNode{
		Value: 1,
		Children: []*TreeNode{
			{Value: 2},
			{Value: 3, Children: []*TreeNode{
				{Value: 4},
				{Value: 5},
			}},
			{Value: 6},
		},
	}

	fmt.Println("Part 0: Count all nodes in tree")
	totalNodes := CountNodes(root)
	fmt.Printf("Total nodes in the tree: %d\n", totalNodes)

	fmt.Println("\nPart 1: Distributed Node Counting with Async API + Callback")
	var wg1 sync.WaitGroup
	wg1.Add(1)
	count1 := 0
	go countNodesAsync(root, func(c int) {
		count1 = c
		wg1.Done()
	}, &wg1)
	wg1.Wait()
	fmt.Printf("Total nodes in the tree: %d\n", count1)

	fmt.Println("\nPart 2: Handling Node Failure with Timeout")
	var wg2 sync.WaitGroup
	wg2.Add(1)
	count2 := 0
	go countNodesAsyncWithTimeout(root, func(c int) {
		count2 = c
		wg2.Done()
	}, &wg2)
	wg2.Wait()
	fmt.Printf("Total nodes in the tree: %d\n", count2)

	fmt.Println("\nPart 3: Handling Grey Failure")
	var wg3 sync.WaitGroup
	wg3.Add(1)
	count3 := 0
	go countNodesAsyncWithGreyFailureDetection(root, func(c int) {
		count3 = c
		wg3.Done()
	}, &wg3)
	wg3.Wait()
	fmt.Printf("Total nodes in the tree: %d\n", count3)
}
