def factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n - 1)

number = 5  # Change this to any non-negative integer
result = factorial(number)
print("Factorial of", number, "is:", result)
