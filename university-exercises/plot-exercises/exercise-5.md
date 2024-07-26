Exercise 5

Write a program that displays the distribution of numbers from the random function.

Graphically representing a function, as in the previous module, is one way to display data. This is not always the most logical way. For example, when the Volkskrant graphs the height of people in the Netherlands, it uses a so-called histogram (also called a bar graph or frequency distribution) in which the data are grouped together. For example, it records how many (percentage of) people are in a certain height range, for example between 160 and 165 cm, but also between 165-170, 170-175, etc. This way of representing the data immediately gives a good picture of the relationships between different groups.

Example: 10,000 random numbers
The idea of a random number is that it is evenly distributed between 0 and 1. To get an idea of whether the distribution is indeed "flat," we can look at the frequency of numbers that were generated for 10,000 random numbers .

Below is a small program that first generates 10,000 random numbers and puts them into a list. The plt.hist() command specifies that we want to determine the frequency of numbers in areas of 0.02 (after all, 50 bin between the minimum and maximum values we expect: 0.00 and 1.00).
In Python you use the plt.hist() option to group the data and then display it using. plt.show() or plt.savefig(). When grouping you can specify how many pieces (containers) you want to split the data into.
We use the extra xlim option here to show that no numbers were generated outside the range 0.00-1.00. Check the web documentation to see what options are available to give the histogram the shape you want: relevant number of bins, color, axis captions, legend, text, etc. Etc.

Assignment: distribution of the sum of random numbers
We have just seen that the random numbers themselves are evenly distributed between 0 and 1, but what about the distribution of the sum of 100 random numbers? If we do an "experiment" in which we generate 100 random numbers and sum them, the average number will be 50 (because the average number is 0.5), but for an individual experiment it is rarely exactly 50, of course. The question is, how often do you find that the sum is less than 40? And is it as common as the number of experiments in which the sum is greater than 60?

Write a sum_random_numbers() function that displays the distribution of 10,000 experiments. Display the results between x = 30 and x = 70.

Generate 100 random numbers for each "experiment" and calculate the sum. Repeat the operation 10,000 times and save the sum in a list for each of the experiments. Finally, create a frequency distribution (histogram) of the distribution. Also write on the screen the percentage (in percent) of experiments in which the sum is less than 40 and greater than 60, respectively.

Note: Print the percentage < 40 on one line and the percentage > 60 on the next. Also, do not just print the percentage, but explain exactly what the number is.