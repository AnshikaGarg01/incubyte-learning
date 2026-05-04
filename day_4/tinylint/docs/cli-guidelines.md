# CLI Guidelines

## Core Philosophy

The guide updates the classic UNIX philosophy for modern CLIs, built around 9 principles:

1. Human-first — design for people, not just scripts
2. Simple, composable parts — play well with pipes and other tools
3. Consistent conventions — use familiar flags and patterns across programs
4. Appropriate output density — neither silent nor noisy
5. Discoverable — help users learn without memorization
6. Conversational — expect trial-and-error; guide toward success
7. Robust-feeling — fast, responsive, and polished
8. Empathetic — show users their concerns matter
9. Intentional rule-breaking — break conventions only when clearly better

---

## Key Topic Areas

### The Basics

- Return exit code 0 for success, non-zero for failure
- stdout for output, stderr for errors/messages
- Always support -h/--help

### Output

- Human-readable by default; --json and --plain for machines
- Use color intentionally; respect NO_COLOR and TTY detection
- Show progress indicators for long operations
- Use a pager (less) for long output

### Error Handling

- Rewrite raw errors into helpful, conversational messages
- Keep signal-to-noise high — don't dump logs to the user
- Pre-populate bug report URLs when unexpected errors occur

### Arguments & Flags

- Prefer named flags over positional arguments
- Support both -f (short) and --flag (long) forms
- Standardize common flags: --dry-run, --force, --quiet, --version, --json
- Never accept secrets via flags — use files or stdin

---

### Interactivity

**Rules**
- Only prompt when stdin is a TTY; fail gracefully in scripts
- Support --no-input to disable all prompts
- Always allow Ctrl-C; explain unusual escape sequences

**Only prompt when stdin is a TTY; fail gracefully in scripts**

A TTY means stdin is connected to a real human terminal. When input is piped in, stdin is NOT
a TTY — it's a file or another program. Use `process.stdin.isTTY` to check. If not a TTY, don't
prompt — just fail with a clear error message. Prompting inside CI or shell scripts causes
hangs or crashes because there's no one to answer.

```js
if (process.stdin.isTTY) {
  // safe to prompt interactively
} else {
  process.stderr.write("Error: --file is required\n");
  process.exit(1);
}
```

**Support --no-input to disable all prompts**

Even when stdin is a TTY, users may want non-interactive mode (e.g. in automation). A
`--no-input` flag skips all prompts and errors out if required input is missing.

```bash
tinylint --no-input   # skip all prompts, fail if required input is absent
```

**Always allow Ctrl-C; explain unusual escape sequences**

Never trap or suppress Ctrl-C (SIGINT) — users must always be able to exit. If your CLI
uses special key combos (Ctrl-D to confirm, Esc to cancel), tell the user upfront.

```js
process.on("SIGINT", () => {
  process.stderr.write("\nAborted.\n");
  process.exit(1);
});
```

> Underlying theme: interactive prompts are a human convenience, not a requirement. Always
> provide a non-interactive path so the CLI works reliably in scripts and automation.

---

### Configuration

**Precedence order (highest to lowest)**

```
flags → env vars → project config → user config → system config
```

**Rules**
- Follow XDG Base Directory spec for file locations
- Never store secrets in environment variables

**Precedence order explained**

Each source overrides everything below it:

| Source         | Description |
|----------------|-------------|
| flags          | Passed directly at runtime. Highest priority — explicitly overrides everything for this invocation. e.g. `--config ./custom.json` |
| env vars       | Set in the shell or CI environment. Useful for machine-specific settings. e.g. `TINYLINT_LEVEL=error` |
| project config | Config file in the project directory (e.g. `.tinylintrc`). Shared with the team via version control. |
| user config    | Config file in the user's home/config directory. Personal preferences across all projects on this machine. |
| system config  | Global config set by an admin for all users. Lowest priority — overridden by anything above it. |

**Follow XDG Base Directory spec for file locations**

XDG (Cross-Desktop Group) defines standard locations for config, data, and cache files
on Linux/macOS so tools don't scatter files all over the home directory.

```
Config files  → $XDG_CONFIG_HOME  (defaults to ~/.config)
                e.g. ~/.config/tinylint/config.json

Data files    → $XDG_DATA_HOME    (defaults to ~/.local/share)
Cache files   → $XDG_CACHE_HOME   (defaults to ~/.cache)
```

In Node.js, use the `env-paths` package to resolve these correctly across platforms.

**Never store secrets in environment variables**

Environment variables are convenient but not secure — they can leak through process
listings, error dumps, child processes, and logging. Use dedicated secret files or secret
managers instead, and instruct users to pass the file path as a flag.

```bash
# Bad
TINYLINT_API_KEY=abc123 tinylint

# Good
tinylint --key-file ~/.secrets/tinylint-key
```

---

### Subcommands

**Rules**
- Use consistent noun verb structure
- No ambiguous abbreviations — explicit aliases only
- Never create implicit catch-all subcommands

**Use consistent noun verb structure**

Subcommands should follow a predictable pattern so users can guess new commands without
reading docs. The most common convention is `noun verb` (resource first, action second).

```bash
tinylint rule list
tinylint rule add
tinylint rule remove
```

Avoid mixing structures (e.g. `tinylint list-rules` and `tinylint add-rule`) — inconsistency
makes the CLI harder to learn and remember.

**No ambiguous abbreviations — explicit aliases only**

Don't silently accept shortened subcommand names (e.g. treating `tinylint r` as `tinylint run`).
Abbreviations feel convenient but break as you add more subcommands — `r` could match `run`,
`reset`, or `report`. If you want short forms, define them explicitly as named aliases.

```bash
# Bad
tinylint r        # silently resolved to "run" — fragile

# Good
tinylint run      # unambiguous
tinylint r        # works only if explicitly aliased to "run"
```

**Never create implicit catch-all subcommands**

Don't silently handle unrecognised subcommands by guessing what the user meant or falling back
to a default behaviour. It hides typos and makes failures unpredictable.

```bash
# Bad
tinylint anythinghere   # silently runs the default action

# Good
tinylint anythinghere   # exits with a clear error:
                        # "Unknown subcommand: anythinghere. Run --help to see available commands."
```

---

### Robustness

- Validate input early; fail fast with clear messages
- Respond within 100ms or show a progress indicator
- Design for crash-only operation — handle restarts in incomplete states

---

### Naming & Distribution

- Lowercase, short, memorable — dashes over underscores
- Distribute as a single binary when possible

---

### Analytics

- Opt-in only; be transparent about what's collected and why
