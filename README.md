# Incubyte COE Learning Journal

A day-wise learning workspace built around the **Incubyte Centre of Excellence (COE)** planner. Each folder corresponds to a day's exercise, progressively building skills in TDD, software design, static analysis, and developer tooling.

---

## Project Structure

```
incubyte-learning/
├── day_3/   — TDD Kata: String Calculator (Ruby)
├── day_4/   — Build a Linter: tinylint (Node.js)
└── day_5/   — AST-Based Static Analysis: fetch-guard (TypeScript)
```

---

## Day-by-Day Breakdown

### Day 3 — String Calculator (TDD Kata)
**Path:** `day_3/string_calc_tdd_refactor/`  
**Language:** Ruby · **Test Framework:** Minitest

A classic [String Calculator kata](https://osherove.com/tdd-kata-1) built strictly with TDD. Covers:
- Comma and newline delimiters
- Custom delimiter syntax (`//delimiter\n`)
- Negative number validation with descriptive error messages
- Ignoring numbers greater than 1000
- Tracking invocation count via `get_called_count`

```bash
cd day_3/string_calc_tdd_refactor
ruby string_calculator_test.rb
```

---

### Day 4 — tinylint (Build a Linter)
**Path:** `day_4/tinylint/`  
**Language:** NodeJS (CommonJS) · **Test Framework:** Jest

A minimal ESLint-inspired CLI linter built from scratch to understand how real linters work. Covers:
- Per-line rule engine (`no-console`, `no-trailing-whitespace`)
- Plugin loading (`no-var`)
- JSON-based config (`.tinylintrc.json`)
- Colored terminal output via chalk
- Exit code `1` on error-level violations (CI-friendly)

```bash
cd day_4/tinylint
npm install
npm test
tinlylint <file>
```

---

### Day 5 — fetch-guard (AST-Based Static Analysis)
**Path:** `day_5/fetch-guard/`  
**Language:** TypeScript · **Test Framework:** Jest + ts-jest

An AST-driven CLI tool and custom ESLint rule that detects `await fetch(...)` and `await axios.*` calls made outside a `try/catch` block. Covers:
- Parsing TypeScript/JavaScript with `@typescript-eslint/typescript-estree`
- Writing an ESLint custom rule with `RuleTester`
- CLI design with `commander` and `fast-glob`
- JSON output mode and structured exit codes
- Shipping a reusable tool as an npm package

```bash
cd day_5/fetch-guard
npm install
npm run build
npm test
node dist/cli.js <path>
```