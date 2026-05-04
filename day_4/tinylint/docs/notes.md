  Part 1: ESLint as a Framework

  Module Boundaries

  ESLint has six distinct subsystems. Each has a clear job and a defined contract with its neighbours.

  ┌─────────────────────────────────────────────────┐
  │                     CLI                         │  ← process.argv → files → exit code
  ├─────────────────────────────────────────────────┤
  │               Config System                     │  ← .eslintrc → resolved config object
  ├──────────────┬──────────────────────────────────┤
  │    Parser    │         Core / Linter            │  ← source → AST → messages
  │  (espree)    │                                  │
  ├──────────────┴──────────────────────────────────┤
  │                    Rules                        │  ← AST visitors → violations
  ├─────────────────────────────────────────────────┤
  │                  Formatters                     │  ← messages → human/machine output
  └─────────────────────────────────────────────────┘
           ↑ plugins can inject into any layer

  You built the same boundary separation in tinylint:

  ┌──────────────────────┬───────────────────────────┬─────────────────────────────┐
  │       tinylint       │          ESLint           │       Responsibility        │
  ├──────────────────────┼───────────────────────────┼─────────────────────────────┤
  │ bin/tinylint.js      │ lib/cli.js                │ process args, files, exit   │
  ├──────────────────────┼───────────────────────────┼─────────────────────────────┤
  │ lib/config.js        │ lib/config-array/         │ load + merge config         │
  ├──────────────────────┼───────────────────────────┼─────────────────────────────┤
  │ lib/linter.js        │ lib/linter/linter.js      │ run rules, collect messages │
  ├──────────────────────┼───────────────────────────┼─────────────────────────────┤
  │ rules/*.js           │ lib/rules/*.js            │ individual rule logic       │
  ├──────────────────────┼───────────────────────────┼─────────────────────────────┤
  │ lib/formatter.js     │ lib/formatters/stylish.js │ shape output                │
  ├──────────────────────┼───────────────────────────┼─────────────────────────────┤
  │ lib/plugin-loader.js │ lib/plugin-loader.js      │ same name, same job         │
  └──────────────────────┴───────────────────────────┴─────────────────────────────┘

  The key difference: ESLint's rules operate on an AST (Abstract Syntax Tree), not raw text lines. Your no-var rule
  uses regex — ESLint's real no-var rule walks the parsed tree and finds VariableDeclaration nodes where kind ===
  "var". That makes it impossible to fool with a string in a comment.

  ---
  Data Contracts Between Layers

  Parser → Core

  // espree.parse() returns an ESTree AST
  {
    type: "Program",
    body: [
      { type: "VariableDeclaration", kind: "var", declarations: [...] }
    ]
  }
  // + scope analysis (what variables are in scope where)
  // + tokens (for whitespace/formatting rules)

  This contract is the ESTree spec — a community standard. Swapping the parser (TypeScript uses
  @typescript-eslint/parser, Vue uses vue-eslint-parser) just means producing a compatible AST shape.

  Rules → Core

  Your rule shape was (line, lineNumber) => violation | null.

  ESLint's is richer:

  module.exports = {
    meta: {
      type: 'suggestion',
      fixable: 'code',      // tells ESLint this rule can auto-fix
      schema: [],           // JSON schema for rule options
    },
    create(context) {
      return {
        // declare which AST node types to visit
        VariableDeclaration(node) {
          if (node.kind === 'var') {
            context.report({
              node,
              message: 'Use const or let instead of var',
              fix(fixer) {
                return fixer.replaceText(node, node.raw.replace('var', 'let'));
              }
            });
          }
        }
      };
    }
  };

  The create() function returns an object of AST visitor functions — the core walks the tree and calls whichever
  visitor matches each node type. This is the Visitor pattern.

  Core → Formatters

  Every formatter receives the same shape regardless of what rules ran:

  [{
    filePath: '/src/index.js',
    messages: [{
      ruleId: 'no-var',
      severity: 2,
      message: 'Use const or let instead of var',
      line: 4,
      column: 1,
      fix: { range: [42, 45], text: 'let' }
    }],
    errorCount: 1,
    warningCount: 0
  }]

  Formatters only consume this shape — they know nothing about rules or ASTs. That's why you can swap stylish for json
  or compact without touching anything else.

  ---
  Triggers

  ESLint fires from four different entry points, all producing the same output shape:

  CLI (eslint .)          → batch, used in CI
  Editor LSP              → per-keystroke or per-save, used in dev
  Pre-commit hook         → per-staged-file, used locally
  Programmatic API        → ESLint class, used by other tools (Prettier, IDEs)

  The core engine doesn't know which trigger invoked it — it just takes source + config and returns messages. That
  isolation is what makes all four work.

  ---
  Failure Modes

  Config resolution failures — the old eslintrc cascade (parent dirs, extends, overrides) was so complex that ESLint
  built a whole config-array library to handle it. Misconfigured extends chains would silently ignore rules or apply
  the wrong parser. This was bad enough that ESLint 9 scrapped the entire system and replaced it with flat config.

  Rule crashes — if a rule throws an exception, ESLint catches it and reports a fatal error for that file. A single
  misbehaving plugin can break linting for every file it touches.

  Fix conflicts — two rules can produce conflicting fixes for the same range of text. ESLint's fix system applies fixes
   in a loop, runs up to 10 passes, and stops if the output stabilises. It doesn't guarantee correctness when rules
  fight.

  Performance — ESLint processes files sequentially. A project with 3000 files and 200 rules can take minutes. There's
  no built-in parallelism; tools like eslint_d (a daemon) or TIMING=1 eslint exist to work around this.

  ---
  Over-Designed

  The old config system. Directory-based eslintrc cascade — configs in parent folders automatically apply to child
  folders, extends chains can be many layers deep, overrides add conditionals inside configs. It's a DSL layered on top
   of JSON. Nobody fully understood it, including the ESLint team. Flat config (ESLint 9) deleted it.

  The processor API. Processors let ESLint lint non-JS files (.vue, .md) by extracting code blocks. The API is awkward
  — processors receive raw text and must return virtual filename mappings. The complexity it added to the core was
  never worth what it gave.

  Multiple formatter entry points. --format accepts a formatter name, a path, or a package — three resolution
  strategies that each have edge cases.

  ---
  Under-Designed

  The fix system. Fixes are raw text ranges { range: [start, end], text: replacement }. There's no semantic awareness —
   a fix doesn't know if it conflicts with another fix until the collision happens. No transactional system, no
  rollback.

  Caching. --cache is opt-in and file-level. If one rule's logic changes (e.g., you upgrade a plugin), the cache
  doesn't know — you have to delete it manually with --cache-strategy or --force.

  No parallel execution. Files are linted sequentially. For a tool that's run millions of times per day across the
  industry, this was left to third-party wrappers.

  ---
  What I Would Delete

  - Legacy eslintrc — already being deleted, but too slowly. The compatibility layer in ESLint 9 means both systems
  coexist, which doubles the config resolution surface area.
  - Built-in formatters beyond stylish and json — tap, unix, junit, checkstyle are all rarely used and each adds a
  surface to maintain. They should be plugins.
  - CLIEngine — the old programmatic API, deprecated in favour of the ESLint class. Still ships because removing it
  would break tooling.
  - Some no-* rules — rules like no-octal and no-with guard against language features browsers haven't supported for a
  decade. They belong in a legacy plugin, not core.

  ---
  Part 2: Audit → Solve → Prevent

  This is the lens for thinking about when in a team's workflow ESLint intervenes.

  ---
  Audit — Find what's broken now

  The audit phase answers: what violations exist in the codebase today?

  eslint .                          # find all violations
  eslint . --format json            # machine-readable, for dashboards
  eslint . --cache                  # only re-check changed files
  eslint --print-config file.js     # debug: what config actually applies here?
  eslint . --rule '{"no-var": 2}'  # try a rule without adding it to config

  The audit phase is retrospective. It's most useful when introducing ESLint to an existing codebase, when upgrading
  plugins, or when you want a count of violations by rule to prioritise cleanup.

  The data contract here is LintResult[] — the same shape the formatter receives. Teams pipe this to dashboards,
  spreadsheets, or custom scripts to track progress over time.

  ---
  Solve — Fix what's broken

  The solve phase answers: how do we reduce the violation count?

  --fix — auto-fix fixable rules. Applies source transforms directly to files:
  eslint . --fix                    # fix everything fixable
  eslint . --fix-type layout        # only formatting fixes (whitespace, semicolons)
  eslint . --fix-type suggestion    # only logic suggestions (var → let)

  Not all rules are fixable. no-unused-vars can't be auto-fixed — the engine doesn't know if you want to delete the
  variable or add a use for it. Only rules with a fix() function in their definition participate.

  Disable comments — for violations that can't be fixed and are accepted as-is:
  // eslint-disable-next-line no-console
  console.log(debugInfo);

  /* eslint-disable no-var */     // disable for a whole block
  var legacy = require('thing');
  /* eslint-enable no-var */

  These are escape hatches, not solutions. Good teams track disable comment count the same way they track violations —
  both should trend down.

  Codemods — for non-fixable rules that require semantic understanding. A codemod is a script that uses jscodeshift (an
   AST transform tool) to rewrite code at scale. Example: migrating a 500-file codebase from var to const/let correctly
   (respecting re-assignment) is too complex for ESLint's simple text-range fix system — a codemod does it properly.

  npx jscodeshift -t no-var-codemod.js src/

  The divide between --fix and codemods is: --fix handles mechanical, local transforms; codemods handle transforms that
   require understanding the broader program.

  ---
  Prevent — Stop regressions from entering

  The prevent phase answers: how do we ensure no new violations are introduced?

  Editor integration — the fastest feedback loop. ESLint runs via the language server protocol (LSP), showing
  violations as red/yellow squiggles before the file is saved. The cost is near-zero; the benefit is violations never
  reach a commit.

  dev types code → ESLint LSP fires → squiggle appears → dev fixes immediately

  Pre-commit hooks — gate commits locally. lint-staged runs ESLint only on staged files, keeping it fast:

  // package.json
  {
    "lint-staged": {
      "*.js": "eslint --fix"
    }
  }

  husky wires lint-staged into the git pre-commit hook. The contract: a commit cannot land if ESLint exits 1. This is
      "*.js": "eslint --fix"
    }
  }

  husky wires lint-staged into the git pre-commit hook. The contract: a commit cannot land if ESLint exits 1. This is enforced locally but can be bypassed with git commit --no-verify.

  CI gates — the hard enforcement. ESLint runs in CI on every PR. Unlike pre-commit hooks, CI cannot be bypassed:

  # .github/workflows/lint.yml
  - run: npm run lint

  --max-warnings 0 makes warnings block CI too — useful when you want to ratchet down warning count over time without immediately making everything an error.

  Baseline files (ESLint 9) — a snapshot of current violations. CI only fails on new violations relative to the baseline. This lets you introduce ESLint to a legacy codebase without blocking all PRs until
  every existing violation is fixed:

  eslint . --output-file baseline.json --format json
  # commit baseline.json
  # CI compares current output against baseline — only new violations fail

  ---
  The full picture

  Write code
      ↓
  Editor (squiggles)          ← prevent, fastest feedback
      ↓
  git commit
      ↓
  Pre-commit hook             ← prevent, local gate
      ↓
  PR opened
      ↓
  CI                          ← prevent, hard gate
      ↓
  Merged — baseline updated
      ↓
  Weekly audit run            ← audit, trend tracking
      ↓
  Codemod / --fix sprint      ← solve, bulk cleanup

  The insight is that prevent is where ESLint earns its keep — not by finding bugs after they're merged, but by making it structurally impossible to introduce new ones. The audit and solve phases are catch-up work on what prevent didn't cover when it wasn't in place yet.