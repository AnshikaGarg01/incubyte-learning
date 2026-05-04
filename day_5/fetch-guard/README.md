# fetch-guard

Detects `await fetch()` and `await axios()` calls that are not wrapped in a `try/catch` block — a common source of silent, unhandled promise rejections in production code.

Ships as both a **CLI tool** (audit an entire directory) and a **custom ESLint rule** (prevent violations in editors and CI).

---

## The Problem

```ts
// This will silently crash if the network fails
async function loadUser() {
  const res = await fetch('/api/user'); // ❌ unhandled rejection
  return res.json();
}

// This handles failures explicitly
async function loadUser() {
  try {
    const res = await fetch('/api/user'); // ✅ safe
    return res.json();
  } catch (e) {
    console.error('Failed to load user', e);
  }
}
```

---

## CLI Usage

### Install

```bash
npm install -g fetch-guard
# or run directly
npx fetch-guard <path>
```

### Scan a directory

```bash
fetch-guard ./src
```

Output:
```
/src/api/users.ts:12:5 — `await fetch()` is not wrapped in try/catch — rejection will be unhandled
/src/api/posts.ts:8:5 — `await axios.get()` is not wrapped in try/catch — rejection will be unhandled

2 violation(s) found in 14 file(s)
```

### JSON output (for CI / tooling)

```bash
fetch-guard ./src --json
```

```json
{
  "summary": {
    "filesScanned": 14,
    "violationsFound": 2
  },
  "violations": [
    {
      "file": "/src/api/users.ts",
      "line": 12,
      "column": 5,
      "callee": "fetch",
      "message": "`await fetch()` is not wrapped in try/catch — rejection will be unhandled"
    }
  ]
}
```

### Exit codes

| Code | Meaning |
|------|---------|
| `0`  | No violations found |
| `1`  | One or more violations found |

---

## ESLint Rule

### Setup

```bash
npm install --save-dev fetch-guard @typescript-eslint/parser
```

Add to your `eslint.config.js`:

```js
const noUnhandledFetch = require('fetch-guard/dist/eslint-rule').default;
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: {
      'fetch-guard': {
        rules: { 'no-unhandled-fetch': noUnhandledFetch },
      },
    },
    rules: {
      'fetch-guard/no-unhandled-fetch': 'error',
    },
  },
];
```

### Run

```bash
npx eslint ./src
```

The rule flags violations directly in your editor (VS Code, WebStorm etc.) and in CI.

---

## What It Detects

| Pattern | Detected |
|---------|----------|
| `await fetch(url)` outside try/catch | ✅ |
| `await axios(url)` outside try/catch | ✅ |
| `await axios.get/post/put/delete(url)` outside try/catch | ✅ |
| `await fetch(url)` inside try/catch | ❌ (safe) |
| `fetch(url).catch(handler)` | ❌ (out of scope) |
| `fetch(url).then(...).catch(...)` | ❌ (out of scope) |

---

## Development

```bash
git clone https://github.com/<your-username>/fetch-guard
cd fetch-guard
npm install
npm test       # run all 24 tests
npm run build  # compile TypeScript to dist/
```

### Project structure

```
src/
├── cli.ts              ← CLI entry point (commander)
├── scanner.ts          ← directory scanning (fast-glob)
├── detector.ts         ← AST-based detection engine
├── output.ts           ← JSON and human-readable formatters
├── eslint-rule.ts      ← custom ESLint rule
└── shared/
    └── callee.ts       ← shared fetch/axios callee identification
tests/
├── cli.test.ts
├── scanner.test.ts
├── detector.test.ts
├── output.test.ts
└── eslint-rule.test.ts
```

### Running the ESLint rule locally

```bash
npm run build
npx eslint <file> --rulesdir dist
```

---

## How It Works

The detection logic works at the AST level — not regex — so it is not fooled by strings or comments.

For every file scanned:
1. Parse the source into an AST using `@typescript-eslint/typescript-estree`
2. Walk every node looking for `AwaitExpression`
3. If the awaited value is a `CallExpression` with callee `fetch` or `axios.*`
4. Walk up the ancestor chain — if a `TryStatement` is found, the call is safe
5. Otherwise, report a violation with file, line, and column

The ESLint rule implements the same logic using ESLint's visitor pattern instead of a manual tree walk.
