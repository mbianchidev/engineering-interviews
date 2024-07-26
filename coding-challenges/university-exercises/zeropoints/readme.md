Program Name: zeropoints.py

Task Description:

1. Create a function named `zeros(a, b, c)` with the purpose of finding the zeros of an arbitrary polynomial in the form:
   
   f(x) = ax^2 + bx + c

   The function should always return a list.

2. There are two possibilities for the result of the `zeros` function:
   
   - An empty list [] if there are no zeros.
   
   - A list with two elements [n1, n2] where n1 and n2 are the zeros of the polynomial. If there is a zero point, the same zero point can also be returned twice.

3. Write the rest of the program to clearly present the results for a specific polynomial:

   - Call the `zeros` function for the polynomial:
   
     f(x) = x^2 + 2x - 10

     and store the result in a variable:

     result = zeros(1, 2, -10)

   - Print the result in exact terms and print the following message if there are no zeros:
   
     "This function has no zeros."

   - Regardless of the outcome, plot the function and clearly indicate the zeros of the calculation on the graph.

Hint: Calculate the zeros using the quadratic formula (abc formula).