# tinylint Curriculum

## Project
Build `tinylint` — a command-line linter that checks files against configurable rules.
Run it as: `tinylint file.js` and see rule violations printed to the terminal.

## Tech Stack
- Node.js (built-in modules: fs, path, process)
- Plain JavaScript (ES6+, CommonJS modules)
- npm (for managing the project and later adding packages)

## Skill Level
Beginner — every new concept is explained, exact terminal commands are provided.

---

## Module 1: Project Setup & Hello World CLI
Goal: Create a Node.js project with a working CLI command you can run from the terminal.
- [x] Step 1.1: Understand what Node.js is and verify your installation
- [x] Step 1.2: Create the project folder and initialize npm
- [x] Step 1.3: Create the CLI entry point (`bin/tinylint.js`)
- [x] Step 1.4: Make the script executable and wire it up as a CLI command
- [x] Step 1.5: Read the target filename from command-line arguments (`process.argv`)

## Module 2: File I/O — Reading Files to Lint
Goal: Accept a filename argument and read its contents into memory.
- [x] Step 2.1: Read a file synchronously with `fs.readFileSync`
- [x] Step 2.2: Handle file-not-found errors with a clear message
- [x] Step 2.3: Split file content into lines for per-line analysis
- [x] Step 2.4: Print each line with its line number (like a real linter)

## Module 3: The Rule Engine
Goal: Define rules as functions and run them against file content to collect violations.
- [x] Step 3.1: Understand what a "rule" is — a function that inspects a line
- [x] Step 3.2: Write your first rule: `no-console` (flag `console.log` usage)
- [x] Step 3.3: Build a rule runner that collects all violations
- [x] Step 3.4: Format and print violations (file, line number, message)
- [x] Step 3.5: Add a second rule: `no-trailing-whitespace`
- [x] Step 3.6: Checkpoint — comprehension check on the rule engine design

## Module 4: Configuration System
Goal: Let users control which rules run by writing a `.tinylintrc.json` config file.
- [x] Step 4.1: Understand config files — what they are and why tools use them
- [x] Step 4.2: Create and load `.tinylintrc.json` with `fs` and `JSON.parse`
- [x] Step 4.3: Only run rules that are listed in the config
- [x] Step 4.4: Handle missing config file with sensible defaults
- [x] Step 4.5: Add severity levels — `"warn"` vs `"error"` per rule
- [x] Step 4.6: Checkpoint — comprehension check on config design

## Module 5: Plugin Architecture
Goal: Allow new rules to be added from external files without touching the core code.
- [x] Step 5.1: Understand what a plugin is — a module that exports rules
- [x] Step 5.2: Design the plugin interface (what shape a plugin must have)
- [x] Step 5.3: Create your first plugin file (`plugins/no-var.js`)
- [x] Step 5.4: Load plugins listed in `.tinylintrc.json` using `require()`
- [x] Step 5.5: Register plugin rules into the rule engine
- [x] Step 5.6: Checkpoint — how does this relate to how ESLint loads plugins?

## Module 6: Polish & Real CLI UX
Goal: Make `tinylint` feel like a real, professional command-line tool.
- [x] Step 6.1: Add color output using the `chalk` npm package
- [x] Step 6.2: Exit with code `1` when violations are found (important for CI)
- [x] Step 6.3: Print a summary line: "2 files checked, 3 violations found"
- [x] Step 6.4: Add a `--help` flag with usage instructions
- [x] Step 6.5: Reflection — how ESLint, Prettier, and similar tools use these same patterns


  ┌──────────────────────┬────────────────────────────────────────────┐
  │       tinylint       │             ESLint equivalent              │
  ├──────────────────────┼────────────────────────────────────────────┤
  │ bin/tinylint.js      │ bin/eslint.js — the CLI entry point        │
  ├──────────────────────┼────────────────────────────────────────────┤
  │ lib/linter.js        │ lib/linter.js — the core engine            │
  ├──────────────────────┼────────────────────────────────────────────┤
  │ lib/config.js        │ lib/config-array/ — config loading         │
  ├──────────────────────┼────────────────────────────────────────────┤
  │ lib/plugin-loader.js │ lib/plugin-loader.js — same name, same job │
  ├──────────────────────┼────────────────────────────────────────────┤
  │ rules/no-console.js  │ lib/rules/no-console.js — built-in rules   │
  ├──────────────────────┼────────────────────────────────────────────┤
  │ plugins/no-var.js    │ eslint-plugin-*/ npm packages              │
  ├──────────────────────┼────────────────────────────────────────────┤
  │ .tinylintrc.json     │ .eslintrc.json                             │
  ├──────────────────────┼────────────────────────────────────────────┤
  │ formatSummary        │ ESLint formatters (stylish, compact, json) │
  └──────────────────────┴────────────────────────────────────────────┘
