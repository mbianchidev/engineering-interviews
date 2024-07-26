# Async Log write
Part 1:

This question will simulate the logging process.

You have an application that writes logs to the file system. Given limitations on the type of disk we are using writing to disk can take up to 1 second.

We have a logger library that is writing directly to disk. Our sample application takes over 15 seconds to write 30 log records. Can you implement a solution to avoid writing to disk in the main thread? Assuming running logs in parallel will not increase the log time for each record, can you write a solution to write the logs in parallel?

Part 2:

We learned that concurrent writing to disk causes bottlenecks as records are competing by resources. What other solution you think can help us reduce the contingency? (hint: batch writes) Can you implement a solution with that writes to disk in a different thread when the written data reaches a certain size?

Code Quality:

Can you define test cases for the code you implemented? Are you considering edge cases and load? Can you find a solution to mock the disk writes so we can test the correct behaviour of the without writing to disk?

Expansion (if there is time):

Can you think in any drawback on using this approach? (ie potential data loss)

Are you using any lock mechanism that can create contention?

What other factors do you think can limit the scalability of the system?