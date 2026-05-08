# Test Desiderata — Kent Beck

A checklist of 12 properties that ideal tests should have. No single test can satisfy all of them perfectly — they exist in tension with each other. The goal is to understand the trade-offs so you can make deliberate choices.

---

## The 12 Properties

### 1. Isolated
Tests should not affect each other. Running test A should not change the result of test B, regardless of order. Shared mutable state (global variables, databases, file system) is the most common cause of isolation failure.

### 2. Composable
If tests are isolated, you can run any subset of them and still trust the results. Composability is the direct consequence of isolation — it falls apart the moment tests depend on each other's side effects.

### 3. Fast
Tests should run quickly. Fast tests get run often — on every save, every commit. Slow tests get skipped, batched, or eventually ignored. Speed is what makes the feedback loop actually useful during development.

### 4. Inspiring
Passing tests should give you genuine confidence that the code works. If you pass your test suite and still feel anxious about deploying, the tests are not inspiring — they are testing the wrong things, or not testing enough.

### 5. Writable
Tests should be cheap to write relative to the cost of the code being tested. If writing a test takes longer than writing the feature, people stop writing tests. Testability is partly a design problem — hard-to-test code is often poorly designed code.

### 6. Readable
A test should clearly communicate what it is testing. A reader unfamiliar with the code should be able to look at a test and quickly understand: what is the scenario, what is the expected behaviour, and why does this case matter.

### 7. Behavioural
Tests should be sensitive to changes in the behaviour of the code under test. If you change what the code does — different output, different side effect, different error — the test should fail. A test that passes no matter what the code does is not a test at all.

### 8. Structure-Insensitive
Tests should not break when you refactor. If you rename a method, extract a class, or reorganise internals without changing external behaviour, all tests should continue to pass. Tests that are tightly coupled to implementation details punish refactoring and slow down improvement.

### 9. Automated
Tests should run without human intervention. A test that requires a person to click a button, read a log, or interpret output is not a test — it is a checklist. Automation is what makes tests useful in CI and in continuous development workflows.

### 10. Specific
When a test fails, the cause of the failure should be obvious and localised. A test that asserts one thing and fails for one reason is specific. A test that asserts many things, or that fails for a different reason than the one being tested, makes debugging much harder.

### 11. Deterministic
If nothing in the code or environment changes, the test result should not change. Flaky tests — tests that randomly pass or fail — are worse than no tests, because they erode trust in the entire test suite and make it impossible to rely on CI signals.

### 12. Predictive
If all the tests pass, the code should be suitable for production. This is the highest bar. It means your test suite covers what matters — real behaviour, real edge cases, real failure modes — not just the happy path.

---

## The Tensions

These properties pull against each other. Understanding the trade-offs is more valuable than chasing all twelve.

| Tension | Why it exists |
|--------|---------------|
| **Fast vs. Realistic** | Unit tests are fast but isolated from real dependencies. Integration tests are realistic but slower. |
| **Behavioural vs. Structure-Insensitive** | Tests that reach deep into internals catch more behaviour bugs but break on refactors. |
| **Specific vs. Readable** | Very granular single-assertion tests are specific but verbose. Broader tests are more readable but harder to debug on failure. |
| **Writable vs. Inspiring** | Easy-to-write tests (lots of mocks) are cheap but often don't inspire real confidence. |

---

## Key Takeaway

> "A test that is easy to write, fast, and passes reliably — but does not tell you whether the code works — is worse than no test, because it creates false confidence."

Use the desiderata as a lens when reviewing tests: which properties does this test satisfy? Which does it sacrifice? Is that trade-off deliberate?
