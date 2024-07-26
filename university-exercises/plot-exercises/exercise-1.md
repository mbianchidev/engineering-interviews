Exercise 1

Create a plot.py file and write within it a program that graphically represents the function f(x)
x=1.5 in steps of
0,01
0.01 plot. Use a blue line for this.

Calculate the coordinates of the minimum. The exercise is not to use a min() function for this, but to search until the minimum is found. This can be done with the same steps
0,01
0.01 as for plotting the graph. After this exercise you can now use min() and max().

Make sure the minimum is indicated in the graph by a red dot.

Use print to also print the minimum as text.

Put your code in a function and call that function at the bottom of the program.

Tips
First fill two lists with the correct x and y values and then graph them.

Look carefully at the examples. You can use the matplotlib and numpy libraries in a similar way.

When using the libraries it is very useful to consult Google. Want to know how to make something with pyplot? Google it! Tip: Use the word "example" to search for examples.

To use matplotlib you need to import it at the top of your program:

  import matplotlib.pyplot as plt
Do you use Windows and get an error message when printing? Then try this:

  import matplotlib
  matplotlib.use('tkagg')
  import matplotlib.pyplot as plt
Don't forget that ^ itself is not an exponential in Python. You must use the ** operator to calculate a power.

To round values you can use the Python round() function (documentation).