# COE Day 2

## Receiving Feedback

- **Listen** – Listen to what the person giving feedback thinks.
- **No puppeteering** – Do not try to put words into their mouth. Do not try to give your opinions.
- **Don't defend yourself** – Do not try defending yourself even if you differ from what the other person is saying, listen to them, and talk about your opinion later.
- **Ask clarifying questions** – Instead of defending yourself, try to ask and understand why the person think what they think.
- **Don't make promise on the spot** – Do not try to make the other person feel good by making promises, this is the time for understanding what they are saying, not for resolution.
- **Thank the feedback giver.**

---

## Giving Feedback

When giving the feedback, always have clarity around your thoughts. Never try giving feedback in high emotional state, try to go through your thoughts alone and always give feedback in a positve manner, to not criticize the person, but to help them understand what did not went well, and what can be improved.

Follow **SBIN** (Situation, Behaviour, Impact, Next Steps)

---

## Kaizen in Software Development

Kaizen focuses on making small, incremental improvements over time instead of big one-time changes. These small improvements gradually lead to better software quality, efficiency, and productivity.

- Review the workflows to identify bottlenecks, what extra steps can be removed (to maximize productivity)
- Feedback is encouraged, even if it is a very small change. It is belived that it will lead to bigger impact in future.
- Because teams are constantly evaluating how things can improve, it leads to innovation for new things

---

## Lean Thinking

Lean Thinking in software development is about delivering maximum customer value while eliminating waste through continuous improvement and efficient workflows.

### 5 Core Principles of Lean Thinking

1. **Value** – Understand what the customer actually values and build features that solve those needs.
2. **Value Stream** – Map the entire workflow from idea → development → delivery to identify inefficiencies.
3. **Flow** – Ensure work moves smoothly through the system without delays or bottlenecks.
4. **Pull** – Work should be done based on real demand, not assumptions or overproduction.
5. **Perfection** – Continuously improve the process through experimentation and learning.

---

## Instance of time when I had to give feedback to my team member

I once had a situation where team member was responsible for delivering an end-to-end feature that was relatively large in scope. As part of our process, we usually estimate tasks in advance and include some buffer, since the timelines are communicated to stakeholders and are used to plan internal demos and releases.

For this feature, the plan was to first deliver an internal demo, then release it to internal users, and eventually roll it out to all users in production.

However, during the development phase, the task experienced some delays due to other ad-hoc work and interruptions. When we checked in on the progress, the team member was confident that th a ey would be able to catch up and meet the timeline, but unfortunately the task still got delayed.

After the feature was delivered, I had a discussion with him to share feedback and reflect on the situation. I explained how the timelines had already been communicated to external stakeholders, and how delays can create challenges for planning and coordination.

We then had a constructive conversation about how we could improve as a team, including:

- making more realistic estimations, especially for large tasks
- raising potential delays earlier so expectations can be managed
- ensuring we communicate risks proactively rather than over-committing to timelines

The goal of the discussion was not to assign blame but to learn from the situation and improve our planning and communication going forward.

---

## Instance where Keizen / Lean helped

One instance where we followed Lean / Kaizen principles was while building a system for automatically evaluating web development projects.

The goal of the project was to create a system that could run user-submitted web projects in an isolated environment and evaluate them automatically against a set of test cases.

Instead of trying to build the perfect system from the beginning, we focused on delivering the MVP first. The initial version successfully ran the projects and executed the evaluation pipeline, but the entire process took around one minute to complete. During this time, the user only saw a loading screen while the evaluation was running.

After delivering the first version, we started iteratively improving the system, following a Kaizen approach of making small continuous improvements.

First, we focused on improving the user experience. Since a one-minute wait could feel long to users, we analyzed the evaluation pipeline and identified the different steps involved in the process. Instead of showing a generic loading screen, we introduced step-by-step progress updates, showing users which stage of evaluation was currently running in real time. This significantly improved transparency and reduced the perceived waiting time.

Next, we looked into performance improvements. By analyzing the workflow, we identified opportunities to introduce caching, which reduced redundant work in the evaluation process. This optimization helped reduce the execution time significantly.

We also discovered another issue during usage: if a project failed due to an error, timeout, or unexpected issue, users were not able to clearly understand what went wrong. To solve this, we improved our system to capture and preserve execution logs during the evaluation process. If any step failed, the system would now show the relevant logs and error messages to the user, making it easier for them to debug and fix their projects.

By continuously identifying small improvements and implementing them iteratively, we gradually transformed the system from a basic MVP into a much more robust and user-friendly platform. Over time, the evaluation time was reduced from around one minute to approximately 10–12 seconds, and users were provided with clear progress indicators and detailed error feedback whenever issues occurred.

This approach of delivering early value and continuously improving the system based on observations and user needs closely reflects the Kaizen and Lean philosophy of incremental improvement and waste reduction.

---

## Instance of feedback received and how it was reflected upon

One instance where I received constructive feedback was during the early years of my career when our team was moving very quickly and delivering a large number of features. Since the team was relatively small, developers were also responsible for testing their own changes before releases.

During that time, there were a couple of instances where small changes or minor bug fixes caused issues in production, impacting a few users. Although the changes were not large features, they still led to unintended behavior once deployed.

My manager gave me feedback that testing needed to be more thorough, even for seemingly small changes. When I reflected on the situation, I realized the feedback was valid. Often, we tend to assume that smaller fixes are low risk and may not require the same level of testing as larger features. However, I learned that production issues often arise from small overlooked changes rather than large, carefully reviewed features.

Taking this feedback seriously, I started improving my own development process by testing even minor changes more thoroughly before deployment. In addition to that, I proposed a small improvement to our team's workflow.

We introduced a practice where every feature or change going live would have a set of documented test cases outlining what scenarios had been tested. Along with this, the code reviewer was responsible for verifying that these test cases existed and that the changes had been properly validated before approval.

This helped create a shared accountability for testing and ensured that we were not relying solely on assumptions about the impact of a change.

Over time, this practice significantly reduced the number of production bugs caused by small changes and helped improve the overall reliability of our releases.
