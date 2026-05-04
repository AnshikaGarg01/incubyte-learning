# tinylint

A minimal command-line linter built from scratch in Node.js. Checks JavaScript files against configurable rules and reports violations with file, line, and severity.

Built as a learning project to understand how framework-level tools like ESLint work internally — rule engines, plugin architectures, config systems, and CLI ergonomics.

---

## Features

- Rule engine with built-in and plugin rules
- Config-driven — enable rules and set severity per project via `.tinylintrc.json`
- Plugin system — add new rules without touching core code
- Color output — red for errors, yellow for warnings
- Proper exit codes — `0` (clean) / `1` (violations found)

---

## Installation

```bash
cd day_4/tinylint
npm install
npm link        # registers the `tinylint` command globally
```

---

## Usage

```bash
tinylint <file>
```

**Example:**

```bash
tinylint index.js
```

Output:
```
index.js:3 — WARN: Unexpected console.log statement
index.js:7 — ERROR: Use const or let instead of var

2 violations found (1 error, 1 warning)
```

**No violations:**
```
✓ index.js — no violations
```

**Show help:**
```bash
tinylint --help
```

---

## Configuration

Create `.tinylintrc.json` in your project root:

```json
{
  "plugins": ["./plugins/no-var"],
  "rules": {
    "no-console": "warn",
    "no-trailing-whitespace": "error",
    "no-var": "error"
  }
}
```

### Severity levels

| Value | Behaviour |
|-------|-----------|
| `"error"` | Reported + exits with code `1` |
| `"warn"` | Reported + exits with code `0` |

If `.tinylintrc.json` is missing, tinylint runs with no rules (no violations reported).

---

## Built-in Rules

| Rule | What it checks |
|------|---------------|
| `no-console` | Flags `console.log` statements |
| `no-trailing-whitespace` | Flags lines ending with spaces or tabs |

---

## Plugin Rules

Plugins live in the `plugins/` folder. Each plugin exports a `rules` object:

```js
// plugins/my-rule.js
module.exports = {
  rules: {
    'my-rule': function(line, lineNumber) {
      if (line.includes('something-bad')) {
        return { line: lineNumber, message: 'Found something bad' };
      }
      return null;
    }
  }
};
```

Register it in `.tinylintrc.json`:

```json
{
  "plugins": ["./plugins/my-rule"],
  "rules": {
    "my-rule": "error"
  }
}
```

### Included plugin

| Plugin | Rule | What it checks |
|--------|------|---------------|
| `plugins/no-var.js` | `no-var` | Flags `var` declarations — use `const` or `let` instead |

---

## Project Structure

```
tinylint/
├── bin/
│   └── tinylint.js        ← CLI entry point
├── lib/
│   ├── linter.js          ← rule engine
│   ├── config.js          ← loads .tinylintrc.json
│   ├── plugin-loader.js   ← loads plugin rules
│   └── formatter.js       ← output formatting + argument parsing
├── rules/
│   ├── no-console.js
│   └── no-trailing-whitespace.js
├── plugins/
│   └── no-var.js
├── tests/                 ← 34 Jest tests
└── .tinylintrc.json       ← default config
```

---

## Running Tests

```bash
npm test
```

```
Test Suites: 7 passed
Tests:       34 passed
```
