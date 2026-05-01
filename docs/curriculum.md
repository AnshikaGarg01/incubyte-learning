# fetch-guard Curriculum

## Problem
Detect `await fetch()` and `await axios()` calls that are not wrapped in a
`try/catch` block — a common source of silent, unhandled promise rejections
in production code.

## Deliverables
1. **`fetch-guard` CLI** — TypeScript CLI using commander + glob that scans a
   directory and emits structured JSON + human output with proper exit codes.
2. **`eslint-plugin-fetch-guard`** — A custom ESLint rule that integrates the
   same detection into editors and CI, TDD'd with ESLint's RuleTester.
3. **Solve-phase reflection** — A written paragraph on what a solve-enabling
   system would look like, shared publicly.

## Tech Stack
- TypeScript + Node.js
- `commander` (CLI argument parsing)
- `fast-glob` (directory scanning)
- `@typescript-eslint/typescript-estree` (AST parsing for the CLI)
- `eslint` + `RuleTester` (ESLint rule + testing)
- `jest` (unit tests, TDD throughout)

---

## Module 1: Problem Scoping & AST Exploration
Goal: Understand exactly what the AST looks like for the problem before writing
any detection logic. Everything else depends on this.
- [x] Step 1.1: Precisely define what we are and are not detecting
- [x] Step 1.2: Use AST Explorer to map a bare await fetch() to AST nodes
- [x] Step 1.3: Use AST Explorer to map a try/catch-wrapped fetch() and find
              the structural difference
- [x] Step 1.4: Document the detection rule in plain English before coding it

## Module 2: TypeScript Project Setup
Goal: Working TypeScript project that compiles and runs, with commander wired up.
- [x] Step 2.1: Initialise the project with npm, install dependencies
- [x] Step 2.2: Configure TypeScript (tsconfig.json)
- [x] Step 2.3: Set up jest for TypeScript (ts-jest)
- [ ] Step 2.4: Wire up commander — --help, --json flag, file/dir argument (TDD)

## Module 3: Directory Scanner
Goal: Given a path, return all .js/.ts files recursively.
- [ ] Step 3.1: Write failing test for the scanner (RED)
- [ ] Step 3.2: Implement with fast-glob (GREEN)
- [ ] Step 3.3: Filter by extension, respect .gitignore patterns

## Module 4: AST-Based Detection Engine
Goal: Parse a file and return all unhandled fetch/axios call locations.
- [ ] Step 4.1: Write failing tests for the detector with code fixtures (RED)
- [ ] Step 4.2: Parse source to AST with typescript-estree (GREEN)
- [ ] Step 4.3: Walk the AST — find AwaitExpression → CallExpression → fetch/axios
- [ ] Step 4.4: Check if the AwaitExpression is inside a TryStatement ancestor
- [ ] Step 4.5: Return structured findings with file, line, column, code snippet

## Module 5: CLI Output & Polish
Goal: The CLI feels like a real tool — structured JSON, human output, exit codes.
- [ ] Step 5.1: Write failing tests for JSON output shape (RED)
- [ ] Step 5.2: Implement --json flag that emits machine-readable output (GREEN)
- [ ] Step 5.3: Human-readable output with file:line — message format
- [ ] Step 5.4: Exit code 0 (clean) / 1 (violations found)
- [ ] Step 5.5: Verify --help, --json, and directory argument end-to-end

## Module 6: ESLint Rule (TDD with RuleTester)
Goal: The same detection logic as a real ESLint rule that works in editors and CI.
- [ ] Step 6.1: Understand RuleTester — how it differs from Jest
- [ ] Step 6.2: Set up eslint-plugin project structure
- [ ] Step 6.3: Write failing RuleTester tests — valid and invalid cases (RED)
- [ ] Step 6.4: Implement the rule's AST visitor (GREEN)
- [ ] Step 6.5: Handle edge cases — .catch(), Promise.all, optional chaining
- [ ] Step 6.6: Add rule metadata (type, docs, schema)

## Module 7: Ship & Reflect
Goal: Both deliverables on GitHub, reflection written and shared.
- [ ] Step 7.1: Push CLI to GitHub with README and usage examples
- [ ] Step 7.2: Push ESLint plugin to GitHub with RuleTester output in README
- [ ] Step 7.3: Write the solve-phase reflection paragraph
- [ ] Step 7.4: Share publicly (LinkedIn / blog / GitHub)

