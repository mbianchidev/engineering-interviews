EXERCISE 2:

Create a new file called riemann.py.

Write a Riemann() function that can compute integrals using the Riemann sum.

The Riemann() function must accept four arguments:

func is a function whose integral we will determine
a the beginning of the area
b the end of the area
N how many rectangles we use to determine the integral.
The Riemann() function must return the correct value of the integral.

Tips:
If you give the Riemann() function the arguments a, b and N, you can immediately find the constant

Define Δx (the interval
(a,b) divided into N pieces). How?

It is not mandatory, but it is incredibly useful to plot the graph so you can clearly see what area you are integrating. This can be done in a separate program, but you could also include a piece of code in the Riemann() function itself.

Always test your function first on an integral whose result you know. This is the case with some of the functions listed above. Only when your function correctly calculates those integrals can you confidently deal with the new unknown integral.