function isIdentical(a, b) {
	if (typeof a !== typeof b) { return false; }
	if (a === null) { return a === b; }
	if (typeof a !== 'object') { return a === b; }

	if (Object.getPrototypeOf(a).constructor && Object.getPrototypeOf(a).constructor.name && ['Error', 'RegExp'].includes(Object.getPrototypeOf(a).constructor.name) && Object.getPrototypeOf(b).constructor && Object.getPrototypeOf(b).constructor.name && ['Error', 'RegExp'].includes(Object.getPrototypeOf(b).constructor.name)) {
		return a.toString() == b.toString();
	}

	if (Array.isArray(a) != Array.isArray(b)) { return false; }
	if (a.length !== b.length) { return false; }

	if (Array.isArray(a)) {
		for (let i = 0, l = a.length; i < l; i++) {
			if (!isIdentical(a[i], b[i])) {
				return false;
			}
		}
		return true;
	}
	else if (Object.prototype.toString.call(b) === '[object Object]') {
		for (i in a) {
			if (!(b.hasOwnProperty(i) ? isIdentical(a[i], b[i]) : false)) {
				return false;
			}
		}
		return true;
	}
	else {
		return false;
	}
	return false;
}

let TALLY = { PASS: 0, FAIL: 0, NULL: 0 };

function verify(desc, func) {
	var RET = null;
	var ERR = null;
	var OUT = null;
	var V = {};

	var desc = typeof desc === 'undefined' ? null : desc;
	if (typeof desc === 'function' && typeof func === 'undefined') {
		func = desc;
		desc = "\x1b[36m" + func.toString().replace(/^function[ \t\n]*\([^\)]*\)[ \t\n]*\{[ \t\n]*/, '').replace(/[ \t\n]*\}$/, '') + "\x1b[0m";
	}

	if (typeof func === 'function') {
		let oldWrite = process.stdout.write;

		process.stdout.write = (function(write) {
			return function (string, encoding, fd) {
				OUT = OUT === null ? string : OUT + string;
			}
		})(process.stdout.write);

		try {
			RET = func.apply(this);
		}
		catch (err) {
			ERR = err;
		}

		process.stdout.write = oldWrite;

		OUT = OUT !== null ? OUT.replace(/\n$/, '') : null;
	}

	var _score = function(passed, shouldTxt, shouldVal) {
		if (typeof func !== 'function') {
			TALLY.NULL++;
			console.log("\x1b[1m\x1b[33mNULL\x1b[0m", ":", "\x1b[36mNothing was evaluated\x1b[0m");
			return null;
		}

		
		if (passed) {
			TALLY.PASS++;
			console.log("\x1b[1m\x1b[32mPASS\x1b[0m", ":", desc);
		}
		else {
			TALLY.FAIL++;
			console.log("\x1b[1m\x1b[31mFAIL\x1b[0m", ":", desc);
			console.log("       this should " + shouldTxt, "\t", shouldVal);
			instead = false;
			if (RET) {
				if (typeof RET === 'object' && RET !== null && Object.getPrototypeOf(RET).constructor && Object.getPrototypeOf(RET).constructor.name && !['Array', 'Object', 'Error', 'RegExp'].includes(Object.getPrototypeOf(RET).constructor.name)) {
					RET = '(instance of) ' + Object.getPrototypeOf(RET).constructor.name;
				}
				console.log("       " + (instead ? "            " : "instead, it ") + "returned:", "\t", RET);
				instead = true;
			}
			if (OUT) {
				console.log("       " + (instead ? "            " : "instead, it ") + "printed:", "\t", OUT);
				instead = true;
			}
			if (ERR) {
				console.log("       " + (instead ? "            " : "instead, it ") + "threw the error:", "\t", ERR);
				instead = true;
			}
		}
		return passed;
	}
	
	V.returns = function(expected) {
		return _score(isIdentical(RET, expected), "return:", expected);
	}
	
	V.prints = function(expected) {
		return _score(isIdentical(OUT, expected), "print:", expected);
	}
	
	V.returnsInstanceOf = function(expected) {
		return _score(RET instanceof expected, "return:", "(instance of) " + expected.name);
	}
	
	V.throwsError = function(expected) {
		if (typeof expected !== 'undefined') {
			return _score(isIdentical(ERR, expected), "throw the error:", expected.name);
		}
		else {
			return _score(ERR !== null, "throw an error", "");
		}
	}
	
	V.RET = RET;
	V.OUT = OUT;
	V.ERR = ERR;
	
	return V;
}
	
function tally() {
	let total = TALLY.PASS + TALLY.FAIL + TALLY.NULL;
	console.log("OUT OF " + total + " TEST" + (total == 1 ? "" : "S") + ":", [(TALLY.PASS ? "\x1b[1m\x1b[32m" + TALLY.PASS + " PASSED\x1b[0m" : ""), (TALLY.FAIL ? "\x1b[1m\x1b[31m" + TALLY.FAIL + " FAILED\x1b[0m" : ""), (TALLY.NULL ? "\x1b[1m\x1b[33m" + TALLY.NULL + " NULL\x1b[0m" : "")].filter(type => type != "").join(" | "));
}

module.exports = function() {
	// this.isIdentical = isIdentical;
	this.verify = verify;
	this.tally = tally;
}
