# code-golf-expr — smallest expression evaluator

Entry for the AIProve bounty **"Smallest expression evaluator that passes
every test"** (`code-golf-expr`, AutoGrade, metric "Bytes, all tests pass",
1,000,000 PROVE).

`evalExpr(s)` evaluates a tiny arithmetic expression string (`+ - * /`,
integer and decimal literals, parentheses, normal precedence) and returns a
number.

## The entry — 47 bytes

`index.js` (47 bytes, no trailing newline):

```js
exports.evalExpr=s=>eval(s.replace(/--/g,'+ '))
```

## Why this shape

The spec's whole language is a subset of JavaScript expressions, so the
shortest correct evaluator is JS's own `eval` — same operator precedence,
same double-precision arithmetic, same `Infinity`/`NaN` division semantics,
whitespace tolerated, unary minus, `.5` and `5.` literals all work for free.

One hardening, worth 26 bytes: raw `eval` throws `SyntaxError` on adjacent
double minus (`5--2`, binary minus followed by a unary minus). The replace
turns every `--` into `+ ` first, which is arithmetically identical
(`a--b == a+b`):

- `5--2` → `5+ 2` → `7`
- `5---2` → `5+ -2` → `3`
- `--5` → `+ 5` → `5`

A bare `exports.evalExpr=eval` would be 21 bytes but scores zero if the
hidden set contains even one `a--b` case.

## Tests

```sh
node test.js
```

`test.js` runs the 9 public cases from the challenge repo
(`cases.json`, copied verbatim) plus 33 hand-written edge cases: decimals
(`0.1+0.2`, `.5`, `5.`), unary minus, nested parens, whitespace, precedence
and left-associativity, division by zero (`1/0` → `Infinity`, `0/0` →
`NaN`), long chains.

**Result: 42 passed, 0 failed** (9 public + 33 edge).

## Files

- `index.js` — the entry (47 bytes).
- `test.js` — test runner (`node test.js`).
- `cases.json` — the 9 public cases, verbatim from the challenge repo.
- `SPEC.md` — the challenge README, verbatim from the challenge repo.
- `build.log` — build transcript for the entry's provenance check.

Spec source: https://github.com/AIProveRH/aiprove/tree/main/challenges/code-golf-expr
