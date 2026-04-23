## Why do we define TypeScript types before writing any logic?

---

## Why Types Come First

Think of types as the **blueprint before the building**. In construction, you don't start pouring concrete and then figure out where the walls go. You agree on the plan first, so every team can work independently without stepping on each other.

In code, types serve the same role. They answer: *"what shape does this data have, and what does each layer promise to produce and accept?"*

Here's what that buys you concretely:

**1. Compile-time safety instead of runtime surprises**
Without types, if the controller passes `{ msg: "hello" }` but the service expects `{ message: "hello" }`, you find out when a user hits the bug in production. With types, TypeScript catches it the moment you save the file.

**2. A shared contract between layers**
The controller, service, and AI provider are written independently. Types are the agreement between them — like an API contract but enforced by the compiler, not by discipline.

**3. Autocomplete and documentation for free**
When you define `ChatRequestDTO`, every developer (including future you) gets autocomplete when using it. The type *is* the documentation. No need to read a separate doc to know what fields exist.

**4. Refactoring becomes safe**
If you rename a field in the type, TypeScript immediately highlights every place that breaks. Without types, you're grepping and hoping.

---

## The Real Insight

Types don't slow you down — they front-load the thinking. You're forced to answer *"what data does this system actually move around?"* before writing any logic. That clarity makes every subsequent layer faster and cleaner to write.

It's the difference between thinking before typing versus debugging after shipping.

---
