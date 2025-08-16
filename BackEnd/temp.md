```python
def add(x, y):
  """
  This function adds two numbers.

  Args:
    x: The first number.
    y: The second number.

  Returns:
    The sum of x and y.
  """
  return x + y

# Example usage:
result = add(5, 3)
print(result)  # Output: 8

result = add(10.5, 2.5)
print(result)  # Output: 13.0

result = add(-2, 7)
print(result)  # Output: 5
```

**Explanation:**

1. **`def add(x, y):`**: This line defines a function named `add` that takes two arguments, `x` and `y`.  These are the numbers you want to add together.
2. **`"""..."""`**:  This is a docstring (documentation string).  It's good practice to include a docstring to explain what the function does, what its arguments are, and what it returns.
3. **`return x + y`**: This line performs the addition of `x` and `y` and returns the result. The `return` statement is what sends the calculated sum back to the part of the code that called the `add` function.
4. **Example Usage**:  The code after the function definition shows how to call the `add` function with different values and prints the results.

**Key Concepts:**

* **Functions:** Reusable blocks of code that perform a specific task.  They help organize your code and make it easier to read and maintain.
* **Arguments (Parameters):**  Values that are passed into a function when it's called. In this case, `x` and `y` are the arguments.
* **Return Value:**  The value that a function sends back to the part of the code that called it.  The `return` statement specifies this value.
* **Docstrings:**  Documentation strings that explain what a function does.  They're enclosed in triple quotes (`"""..."""`).  Good docstrings are crucial for making your code understandable.
* **Calling a function:**  To use a function, you "call" it by writing its name followed by parentheses, and passing in any required arguments. For example: `add(5, 3)` calls the `add` function with the arguments 5 and 3.
