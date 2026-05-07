# Testing Pyramid - Martin Fowler

```
       /\
      /  \
     / E2E \          ← few, slow, expensive
    /────────\
   /Integration\      ← some, moderate cost
  /──────────────\
 /   Unit Tests   \   ← many, fast, cheap
/──────────────────\
```

---

## Unit Tests

A unit test tests the smallest possible piece of your code in complete isolation. One function, one class, one method. Everything it depends on is either irrelevant or replaced with a fake (stub/mock).

**Characteristics:**

- Extremely fast — thousands can run in seconds
- Deterministic — same input always gives same output
- Highly focused — when a unit test fails, you know exactly which line broke
- No network, no database, no file system involved

**When unit tests shine:**

- Pure functions with clear inputs and outputs
- Business logic: pricing rules, validation, calculations, data transformations
- Edge cases that are hard to reproduce at higher levels (what happens if the input is null? negative? zero?)
- Algorithms and data structures

**The weakness of unit tests:**

The biggest problem is that unit tests can all pass while your application is completely broken. Imagine testing every single LEGO brick individually — every brick is perfect. But when you assemble them, they don't fit together. Unit tests don't test the connections between things. That gap is exactly what the next layer addresses.

---

## Integration Tests

An integration test tests two or more real units working together. The goal is to verify that the connections between components work correctly. You're testing the interactions, the contracts, the handshakes between pieces of your system.

**Characteristics:**

- Slower than unit tests, but still reasonably fast
- May involve a real database, a real file system, or real internal services
- Wider scope — a failure here could be in any of the integrated pieces
- More realistic than unit tests — closer to how the code actually runs in production

**Why integration tests matter:**

This layer catches the bugs that unit tests structurally cannot. Two units can each be perfectly correct in isolation but fail when combined — because the interface between them is wrong, the data format doesn't match, the sequence of calls is incorrect, or a shared assumption turned out to be false. Integration tests are the safety net for these "seam" bugs.

**The weakness of integration tests:**

They are harder to set up. You need real databases in a test environment, proper test data, teardown logic to clean up between tests. When they fail, the root cause is less obvious — you know something broke in the chain, but you may need to dig to find exactly where. They also run slower, so you can't run them on every keystroke the way you can unit tests.

---

## E2E Tests

An end-to-end test (E2E) exercises your entire application as a real user would, from one end to the other. A real browser visits a real URL, clicks real buttons, fills real forms, and the test verifies what the user sees on screen — while your full backend, database, and external services are all running.

**Characteristics:**

- Slowest — a single test can take 10–60 seconds
- Most realistic — if this passes, you have very high confidence
- Most fragile — network hiccups, timing issues, browser quirks can cause random failures
- Most expensive to write and maintain
- Run less frequently — typically in CI/CD pipelines, not during development

**What E2E tests are best for:**

- Critical business flows: signup, login, checkout, payment
- Smoke tests — is the app basically working after a deployment?
- Workflows that span multiple pages or services
- Catching issues that only appear when everything is assembled together

**The weakness of E2E tests:**

The cost is high in every dimension. They are slow to run, slow to write, slow to debug, and prone to flakiness — failing not because your code is wrong, but because a network call timed out or a CSS animation was still playing when the test tried to click a button. A test suite with hundreds of E2E tests becomes a nightmare to maintain. This is precisely why the pyramid says: use them sparingly, for your most important flows only.


Use the Testing Pyramid when…

You're building backend services, APIs, or microservices
Your code has lots of pure business logic (calculations, data transformations, rules engines)
Units are genuinely independent and testable in isolation
Integration means "two services talking over a network" — which is slow and flaky by nature
Example: a payment processing service, an authentication server, a data pipeline

