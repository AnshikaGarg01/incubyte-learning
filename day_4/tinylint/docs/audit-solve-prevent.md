Framework System Design: 

 

In a framework system design, the system has developers as the end users, instead of consumers. We build the system in such a way that the problems are identified, solved and new problems are prevented. 

 

Framework-building arc: Audit → Solve → Prevent 

 

Audit: Before you can fix anything, you need to answer: how bad is it, where exactly, and what matters most? 

The audit phase transforms a fuzzy perception ("our API is inconsistent") into a concrete, located, prioritized report. 

In plain terms: Run a scan. Get a report. 

With respect to ESLint, when we run the scan we get a full report of errors with exact file location, priority (warning, error). 

 

ESLint points to it at a tree of source files, it parses each into an AST (Abstract Syntax Tree), walks the AST, and emits a structured report: rule ID, file path, line, column, severity, and a human-readable message. 

 

Solve: You're not fixing the problems yourself — you're building the system that lets an entire team or rotation fix them systematically. 

In plain terms: Don't fix manually. Build a system that fixes. 

It automatically rewrites let x = 5 → const x = 5 across your entire codebase in one command. One engineer runs one command and 200 files are cleaned up. 

 

Prevent: Once you've cleaned up existing problems, the most expensive thing you can do is let new ones in. Prevention moves the catch point as early as possible — ideally to authoring time, before the code is even committed. 

In plain terms: Catch it before it's even committed. 
