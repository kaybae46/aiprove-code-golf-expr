// Test runner for the code-golf-expr entry.
// Usage: node test.js
// Runs the 9 public cases from the challenge repo (cases.json) plus a
// hand-written edge-case set (decimals, unary minus, nested parens,
// whitespace, division by zero). Exits non-zero on any failure.
const { evalExpr } = require("./index.js");
const fs = require("fs");

let pass = 0, fail = 0;
function check(input, expected) {
  let got, threw = null;
  try { got = evalExpr(input); } catch (e) { threw = e; }
  const ok = threw === null &&
    (Object.is(got, expected) || (typeof got === "number" && typeof expected === "number" && Math.abs(got - expected) < 1e-12));
  if (ok) { pass++; console.log(`PASS ${JSON.stringify(input)} => ${got}`); }
  else { fail++; console.log(`FAIL ${JSON.stringify(input)} => ${threw ? "THREW " + threw.message : got} (expected ${expected})`); }
}

// --- Public cases (challenges/code-golf-expr/cases.json) ---
const pub = JSON.parse(fs.readFileSync(__dirname + "/cases.json", "utf8"));
for (const c of pub) check(c.in, c.out);
console.log(`-- public: ${pub.length} cases --`);

// --- Edge cases ---
// decimals
check("3.5+1.5", 5);
check("0.1+0.2", 0.1 + 0.2);
check(".5+1", 1.5);
check("5.+1", 6);
check("10/4", 2.5);
check("1/3", 1 / 3);
// unary minus (JS semantics: "--" adjacency is the one place raw eval breaks)
check("-5+3", -2);
check("2*-3", -6);
check("5--2", 7);
check("5---2", 3);
check("--5", 5);
check("(-3)*2", -6);
check("-(2+3)", -5);
check("5+-3", 2);
// nested parens
check("((1+2)*(3+4))", 21);
check("2*(3+(4-1))", 12);
check("((((7))))", 7);
check("(8-2)/(1+2)", 2);
// whitespace
check(" 1 + 2 ", 3);
check("1 +\n2", 3);
check("( 1 + 2 ) * 3", 9);
// precedence / associativity
check("7-3-2", 2);
check("100/10/2", 5);
check("2+3*4-1", 13);
check("2*3+4*5", 26);
// single literal / zero
check("100", 100);
check("0", 0);
check("0.0", 0);
// division by zero (JS double semantics: x/0 = +/-Infinity, 0/0 = NaN)
check("1/0", Infinity);
check("-1/0", -Infinity);
check("0/0", NaN);
// long chain
check("1+2+3+4+5+6+7+8+9+10", 55);
check("2*2*2*2", 16);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
