# Testing Trophy - Kent C. Dodds

> "Write tests. Not too many. Mostly integration."

---

## Layer 1 — Static Analysis (the foundation)

Static analysis is not "running tests" in the traditional sense. It is your tooling reading your source code and catching errors before the code ever executes. Think of it as automated proofreading — it catches a whole class of bugs that have nothing to do with logic and everything to do with syntax, types, and obvious mistakes.

---

## Layer 2 — Unit Tests (smaller than the pyramid says)

This is where the trophy most visibly disagrees with the pyramid. In Kent's model, unit tests are a smaller slice than you might expect — not the massive foundation layer the pyramid prescribes.

A unit test in the trophy model is the same as in the pyramid: one function or class tested in isolation, all collaborators mocked or stubbed. The difference is in how much Kent thinks you should rely on them.

**Why Kent de-emphasises them for UI code:**

The problem arises when developers try to unit test React components or UI modules in isolation. To do that, you typically mock the child components, mock the hooks, mock the context providers, and mock the API calls. What you end up with is a test that verifies your mocks behave like your mocks — it no longer tells you whether your actual application works.

Worse, these heavily mocked unit tests are extremely brittle. If you refactor a component — splitting it into two components, or extracting a hook — your tests break even though the user-facing behaviour hasn't changed at all. You spend time fixing tests that were never actually testing anything the user cares about.

This is the core of Kent's critique: in UI development, a passing unit test suite is dangerously easy to achieve without actually having a working application. The confidence it provides is inflated relative to what it cost.

**When to reach for unit tests in frontend:**

- Date formatting and parsing utilities
- Price and tax calculation functions
- Input validation and sanitisation logic
- Data transformation functions (reshaping API responses)
- Complex algorithmic code with many edge cases

**When not to reach for unit tests:**

- React components that have collaborators
- Hooks that depend on context
- Anything that involves rendering, events, or DOM interaction
- Anything where you find yourself mocking more than one thing

---

## Layer 3 — Integration Tests (the wide belly — the main point)

This is where the trophy makes its strongest and most distinctive claim. Integration tests are the biggest slice — the bulk of your testing effort should live here. This is the direct expression of "mostly integration."

In the trophy model, an integration test for frontend means: render a real feature with real components wired together, fire real user events, and assert on what the user actually sees. You mock as little as possible — ideally only the network boundary (the actual HTTP calls to your backend), because you don't control the backend in a frontend test.

---

## Layer 4 — End-to-End Tests (the top)

E2E tests in the trophy model serve the same purpose as in the pyramid — run the whole application in a real browser with a real backend. The philosophy is identical: use them for your most critical flows, keep their number small, and don't rely on them as your primary safety net.


Use the Testing Trophy when…

You're building a frontend UI (React, Vue, Angular)
Your code's job is to render things, handle user events, and wire components together
"Unit testing" a React component in isolation (with everything mocked) often tests nothing real
The real question is: does this form work when a user fills it out and clicks submit?
Example: a dashboard app, an e-commerce checkout flow, a login page

