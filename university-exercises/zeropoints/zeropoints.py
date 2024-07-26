import matplotlib.pyplot as plt
import numpy as np

def zeros(a, b, c):
    # find discriminant
    disc = b**2 - 4 * a * c
    # checks and calc with formula
    if disc > 0:
        x1 = (-b + np.sqrt(disc)) / (2 * a)
        x2 = (-b - np.sqrt(disc)) / (2 * a)
        return [x1, x2]
    elif disc == 0:
        x = -b / (2 * a)
        # returning it twice as asked (why?)
        return [x, x]
    else:
        # no zero(s)
        return []

# Define some coefficients for the polynomial
a = 1
b = 2
c = -10

# Calculate the zeros of the polynomial
result = zeros(a, b, c)

# Print the results
if not result:
    print("This function has no zeros.")
else:
    print("Zeros of the polynomial:", result)

# Plot the function and indicate the zeros on the graph
x = np.linspace(-10, 10, 400)
y = a * x**2 + b * x + c

plt.plot(x, y, label=f'f(x) = {a}x^2 + {b}x + {c}')
plt.xlabel('x')
plt.ylabel('f(x)')
plt.axhline(0, color='black', linewidth=0.5)
plt.axvline(0, color='black', linewidth=0.5)

for zero in result:
    plt.scatter(zero, 0, color='red', label=f'Zero: {zero}', marker='o')

plt.legend()
plt.grid()
plt.title('Polynomial Function with Zeros')
plt.show()
