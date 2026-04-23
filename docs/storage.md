## How does the session manager store conversation history?

---

## How the Session Manager Works

The session manager is essentially a **key-value store** that lives in memory. Think of it like a coat check at a restaurant:

- You arrive → they give you a **ticket number** (session id)
- You leave your coat → they store it under that number (conversation history)
- You come back → you hand the ticket → they retrieve exactly your coat

In code that maps to:

```
Map<sessionId, Session>
```

The **key** is the `sessionId` — a unique string per user conversation. The **value** is the `Session` object, which contains the `Message[]` history.

---

## Why a `Map` and Not a Plain Object `{}`?

Both work, but `Map` is the better choice here for three reasons:

**1. Keys are explicitly strings** — no risk of accidentally colliding with built-in object properties like `constructor` or `toString`.

**2. Better API** — `map.has()`, `map.get()`, `map.set()`, `map.delete()` are cleaner and more intentional than bracket notation.

**3. Designed for dynamic keys** — a plain object is meant for known, fixed shapes. A `Map` is designed exactly for the case where keys are generated at runtime.

---

## The Swap Point

Right now our `Map` lives in memory — fast, simple, perfect for development. But notice: if you swap it for Redis later, the rest of the app changes **zero lines**. The session manager is the only thing that knows *where* data is stored. That's the architecture protecting you.

---
