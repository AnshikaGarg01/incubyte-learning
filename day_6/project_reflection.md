### Project Reflection: Live Classes Platform

## Overview

I worked on building an end-to-end live classes platform that enabled students to seamlessly join classes, access recordings, track attendance, and receive real-time updates on scheduling changes. The system also provided internal tools for operations teams to schedule classes (including bulk scheduling), monitor attendance live, and manage sessions efficiently. This replaced a manual, non-scalable workflow involving tools like Google Meet and WhatsApp.

## Customers & User Learning

The primary customers were:
1. Students attending live classes
2. Internal operations teams managing scheduling and logistics

I directly engaged with end users during the initial rollout by attending live classes alongside students. This was effectively my most recent “customer conversation,”

Key learning that changed the product:
1. Users value reliability over feature richness in live experiences.
2. Even small disruptions (e.g., delays, broken joins) significantly impact trust.
3. Real-time issue resolution is critical for user satisfaction.

This led to:
1. Prioritizing stability and edge-case handling early
2. Introducing features like notifications for cancellations/reschedules
3. Building fallback mechanisms after a provider outage incident

## Developer Experience (DX) Surfaces

The platform owned several DX surfaces:
1. API responses: Used for scheduling, attendance, and recordings
2. Internal dashboards/tools: For ops teams managing classes
3. Error states (user + internal): Failures in joining, recording processing, etc.
4. Documentation (implicit): Knowledge transfer within team

Where quality was high:
1. Internal tools were designed for efficiency (bulk scheduling, live attendance)
2. Thoughtful handling of edge cases (e.g., unregistered users, recording failures)

Where quality was low:
1. Error handling during failures (e.g., provider downtime) was not robust initially
2. Lack of clear fallback messaging or automated recovery flows
3. Limited explicit documentation

The outage incident exposed gaps in system resilience and DX clarity, especially under failure scenarios.

## Joel Test Evaluation

| Criteria                 | Status      |
|--------------------------|-------------|
| Source control           | Yes         |
| One-step build           | Yes         |
| Daily builds             | No          |
| Bug database             | Yes         |
| Fix bugs before new code | Yes         |
| Up-to-date schedule      | Yes         |
| Spec available           | No          |
| Quiet working conditions | Yes         |
| Best tools               | Yes         |
| Testers                  | No          |
| Code screening           | Yes         |
| Usability testing        | Yes         |

~ 9/12

DevEx Dimensions

Strongest: Feedback Loops
1. Rapid iteration via MVP approach
2. Immediate feedback from real users (attending live classes)
3. Quick response to production issues

Moderate: Flow State
- Cross-functional collaboration (tech + product + design) helped clarity
- However, operational firefighting (e.g., outages) likely disrupted flow

Weakest: Cognitive Load
- System complexity increased with edge cases and integrations
- Lack of robust failure handling initially added mental overhead
- Implicit knowledge (vs documented systems) increased dependency on individuals