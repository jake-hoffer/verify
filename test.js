require('./verify.js')();

verify(function() { return true; }).returns(true); // PASS
verify(function() { return false; }).returns(true); // FAIL
verify(function() { return /foo/; }).returnsInstanceOf(RegExp); // PASS
verify(function() { return /foo/; }).returnsInstanceOf(Date); // FAIL
verify(function() { console.log("foo"); }).prints("foo"); // PASS
verify(function() { console.log("foo"); }).prints("bar"); // FAIL
verify(function() { new RegExp('[a-z+'); }).throwsError(); // PASS
verify(function() { new RegExp('[a-z]+'); }).throwsError(); // FAIL
