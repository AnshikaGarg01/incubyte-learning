---
name: code-explainer
description: Use when the user asks how something works, wants to understand a module, or system, or uses phrases like "explain", "how does X work",
  "walk me through", "what is X", or "document X". Also triggers for requests
  to write or generate documentation for a specific feature or component.
---

Structured explanations land better than ad-hoc ones. This format separates levels of abstraction so readers can follow at the right depth.

Always follow this format:

1. Overview: Give an overview of the feature, covering its objective, the problem it solves, and who it's intended for.
2. High Level Explanation: Provide a high level explanation of how the feature works, without going into implementation details. Include a simple diagram or analogy where helpful.
3. Implementation Details: Dive into the implementation details, covering key components, architecture, and any important design decisions.
   - Give relevant architectural diagrams, code snippets, or other visual aids to help illustrate the implementation.
   - Note any tradeoffs or alternative approaches that were considered.
   - Call out any external dependencies or integrations.
4. Usage: Explain how to use the feature, including:
   - Any necessary setup or configuration steps.
   - Required permissions or prerequisites.
   - Relevant environment variables, flags, or settings.
5. Examples: Provide examples of how to use the feature in practice, including:
   - Code snippets with expected outputs.
   - Common use cases and edge cases to be aware of.
   - Any known limitations or gotchas.
6. Related Resources: Link or reference related features, docs, or external resources where applicable.

When writing, prefer clarity over completeness — if a section isn't applicable, skip it rather than leaving it empty. Tailor the depth of each section to the complexity of the feature.