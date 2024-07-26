Exercise 3

Write a function that determines the average number of random numbers (evenly distributed between 0 and 1) that you must extract to ensure that the sum of those numbers is greater than 1.00.

Use the following strategy:

Generate different random numbers each time and stop when their sum is greater than 1. (Ex: 0.1, 0.62, 0.45. In this case three draws were needed.) Use the while() construction for this.

Do this more than a large number of times (N = 1 million).

Determine the average number of throws required and print it on the screen

Specify
Create a new file called randommathematics.py.

In this file, define a randommath() function that accepts no parameters and determines the average number of random numbers to be drawn...