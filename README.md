# Verify
A [very] lightweight JS testing framework for node

## Background

As I am new to the world of TDD, I found I fatigued rather quickly of the enormous and complex libraries required just to test my code. So I decided to develop my own that is much more compact, though perhaps lacking some of the less common features available in typical testing frameworks.

## Usage

Simply require and execute verify.js at the top of your testing script using `require('verify.js')()`. Each time you write a test, you will call `verify()` with the optional first argument being the test description to be printed with the result, and the second argument being an anonymous function. The function chained to `verify()` will evaluate the anonymous function's return, output, and error and compare it to what is expected. These are the available functions for evaluation:

- `returns()`: verify that the return value of the function is equal to the given value
	```javascript
	verify(function() { return true; }).returns(true); // PASS
	verify(function() { return false; }).returns(true); // FAIL
	```
- `returnsInstanceOf()`: verify that the return value of the function is an instance of the given class/object
	```javascript
	verify(function() { return /foo/; }).returnsInstanceOf(RegExp); // PASS
	verify(function() { return /foo/; }).returnsInstanceOf(Date); // FAIL
	```
- `prints()`: verify that the printed output of the function (sans trailing newline) is equal to the given value
	```javascript
	verify(function() { console.log("foo"); }).prints("foo"); // PASS
	verify(function() { console.log("foo"); }).prints("bar"); // FAIL
	```
- `throwsError()`: verify that the function throws an error; if an argument is given, verify that it is equal to the error thrown
	```javascript
	verify(function() { new RegExp('[a-z+'); }).throwsError(); // PASS
	verify(function() { new RegExp('[a-z]+'); }).throwsError(); // FAIL
	```

A standalone `tally()` function is also provided, which prints the cumulative score of the tests.
