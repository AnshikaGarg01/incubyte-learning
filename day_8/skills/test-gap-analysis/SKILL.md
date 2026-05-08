---
name: test-gap-analysis
description: Use when asked to review, analyze, or audit test files for missing coverage, weak assertions, or edge cases — especially against feature specs, BDD .feature files, or acceptance criteria. Triggers on "what tests are missing", "review my tests", "find gaps in tests", "what edge cases aren't covered", "analyze my tests".
---

# Test Gap Analysis

## Overview

Analyze test files against their feature specs to surface missing coverage, weak assertions, and untested edge cases. Present findings first — then ask the user what to fix before writing any plan.

**Core rule:** Never generate a fix plan until the user has chosen what to address.

## Workflow

```
Read inputs → Detect context → Categorize findings → Assign priority → Present report → Ask user → Targeted plan
                                                                                             ↑
                                                                                        STOP HERE until answered
```

## Step 1: Read the Inputs

- **Spec/feature file** (optional): the expected behavior (Gherkin Given/When/Then, prose, or acceptance criteria)
- **Implementation code**: the source file(s) being tested
- **Test file(s)**: what is actually tested

**No spec file? Read the implementation code directly.** Map every branch, guard clause, early return, and side effect in the source — these define the expected behavior. Treat each code path as an implicit requirement that needs a test.

## Step 2: Detect Project Context

Look at imports, framework usage, and file structure to determine the testing model that applies. Read the relevant reference before analyzing — it shapes which gaps are actually worth flagging.

| Context | Signals | Reference to read | What to prioritize |
|---|---|---|---|
| **Backend / API / service** | Express, NestJS, Django, Rails, Spring, Go handlers | `references/testing_pyramid.md` | Missing unit tests on business logic; missing integration tests on boundaries (DB, HTTP, external services) |
| **Frontend / UI** | React, Vue, Angular, Svelte, component files | `references/testing_trophy.md` | Missing integration tests (rendered component + user events); over-mocked unit tests that test nothing real |
| **Unsure** | Mixed or unclear | Default to pyramid | Flag the ambiguity in the report |

Additionally, read `references/test_desiderata.md` and use it as a quality lens when evaluating **weak assertions and structural issues**. Ask: is this test Behavioural (fails when behaviour changes)? Specific (fails for one clear reason)? Deterministic (never flaky)? Inspiring (gives real confidence)? Flag any property that is clearly violated.

## Step 3: Categorize Every Finding

| Category | Definition | Severity |
|---|---|---|
| **Spec violations** | A Then-clause or explicit requirement has no corresponding assertion | High |
| **Edge cases** | Boundary values, empty input, error paths, or concurrency not tested anywhere | Medium |
| **Weak assertions** | Test exists but doesn't fully verify the outcome the spec describes | Medium |
| **Structural issues** | Missing setup/teardown, fragile data dependencies, naming drift from spec | Low |

## Step 4: Assign Priority Per Finding

Before presenting, assign each finding a priority based on **what breaks if this case is untested**:

| Priority | When to assign |
|---|---|
| **P1 — Critical** | Security path, data loss, money/payment, auth bypass, silent data corruption |
| **P2 — Important** | Core feature path missing, spec requirement unverified, common user error not handled |
| **P3 — Nice to have** | Rare edge case, cosmetic/naming issue, low-traffic path |

Assign priority independently per finding — a "Structural issue" can be P1 if it causes flaky tests on a payment flow; an "Edge case" can be P3 if it's an unlikely format error on a non-critical field.

## Step 5: Present the Report

**If findings are few or minor:** Say so directly — "The tests look solid. They cover the main scenarios and edge cases well." List any minor P3 observations briefly, but do not manufacture gaps or pad the report. A clean test file deserves a clean verdict.

Otherwise, show a summary table, then expand each finding with its priority and three lines:

```
## Test Gap Analysis: [filename]

### Summary
| Category | Count |
|---|---|
| Spec violations | N |
| Edge cases | N |
| Weak assertions | N |
| Structural issues | N |

### Findings

**[P1] Successful login — redirect to dashboard never verified** *(Spec violation)*
- Spec says: "the user should be authenticated and redirected to dashboard"
- Test does: `expect(result.success).toBe(true)` — redirect never verified
- Fix: `expect(result.redirectUrl).toBe('/dashboard')`

**[P2] Login with non-existent user not covered** *(Edge case)*
- Code has: early return `{ success: false, error: 'User not found' }` for unknown email
- Test does: only tests wrong password, never an unknown email address
- Fix: `expect(await login('nobody@example.com', 'x')).toEqual({ success: false, error: 'User not found' })`

[repeat per finding — max 3-5 highest priority items; group remaining as a brief list]
```

**When no spec file:** replace "Spec says" with "Code has" and reference the implementation branch or guard clause.

## Step 6: Ask Before Planning

After the report, **always** ask:

> "Which of these would you like to fix? You can pick specific items, a category, or a priority level (e.g. 'fix all P1s')."

**Do not write any code or plan until the user answers.** This is not optional.

## Step 7: Create the Targeted Plan

Once the user responds:

1. **Cap the batch to 3–5 fixes.** If the user selected more, tackle the highest-priority ones first and say so explicitly — overwhelm kills follow-through.
2. **Stay within the existing test style.** If the project uses unit tests with mocks, suggest unit-level fixes. Don't introduce a new testing layer (e.g., integration tests) unless the user agrees to it.
3. For each selected finding, show the full updated test block — not just a diff or snippet.
4. Note any shared setup changes (e.g., a new `beforeEach`) that multiple fixes depend on, so they are written once.
5. After delivering the plan, ask: "Want to continue with the remaining findings next?"

## What to Look For

**Spec violations — check each Then-clause:**
- State changes → assert the new state, not just a boolean flag
- Side effects (emails sent, events fired, DB writes) → verify they happened with correct data
- Redirect / navigation → assert the destination, not just success

**Edge cases — always probe these:**
- Null / empty / undefined inputs
- Non-existent resources (user not found, file missing)
- Boundary values (0, max, max+1)
- Already-done operations (re-login, double-submit, re-use of a token)
- Invalid formats (malformed email, bad UUID, wrong type)
- Concurrent or interleaved operations

**Weak assertions:**
- `toBe(true)` or `toBeTruthy()` where the spec implies a richer outcome
- No check on error message content when spec says "an error message should be shown"
- Asserting an intermediate step instead of the final state

**Structural issues:**
- Test relies on pre-existing DB state (no `beforeEach` / seeding)
- Test name doesn't match the spec scenario language (breaks traceability)
- Multiple scenarios collapsed into one test case

## Common Mistakes

| Mistake | Fix |
|---|---|
| Producing a fix plan before asking the user | Stop at Step 6 — wait for the answer |
| "Test exists" treated as "coverage exists" | Check what the assertion actually verifies |
| Floating a finding with no spec reference | Every finding must cite the spec clause or inferred intent |
| Listing 15+ items at once | Cap to 3-5 per category; call out highest-impact first |
| Suggesting improvements when tests are already good | Say the tests look solid — do not invent gaps |
