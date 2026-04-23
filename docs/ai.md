## What does the AI provider layer abstract away?

---

## What the AI Provider Abstracts Away

The AI provider hides **everything specific to OpenAI** from the rest of your application.

Without an AI provider layer, your service would look like this:

```typescript
// Service doing too much — knows about OpenAI internals
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await client.chat.completions.create({
  model: 'gpt-4',
  messages: history,
  temperature: 0.7,
  max_tokens: 500,
});

const reply = response.choices[0].message.content;
```

The service now knows about `choices[0]`, `completions.create`, `temperature`, `max_tokens` — all OpenAI-specific details. If you switch to Claude or Gemini tomorrow, you rewrite the service. That's wrong.

---

## With the AI Provider Layer

The service sees only this:

```typescript
const reply = await aiProvider.chat(history);
```

That's it. One function, clean input, clean output. Everything below that line — the API client, the model name, the parameters, the response parsing — is the provider's problem, invisible to the service.

---

## What It Concretely Hides

**API client setup** — instantiating the OpenAI client with the API key.

**Model configuration** — which model, temperature, token limits. The service doesn't care and shouldn't.

**Response parsing** — OpenAI returns `response.choices[0].message.content`. That's an implementation detail. The provider extracts the string and returns just that.

**Error handling** — if OpenAI is down or rate-limits you, the provider catches and translates that into your application's own error format.

---

## The Analogy

Think of a power outlet. You plug in your laptop and get electricity. You don't know if it came from a coal plant, solar panels, or a dam. The outlet is the provider — it abstracts the source. If the city switches to wind power, your laptop still works the same way.

The service is your laptop. The AI provider is the outlet.

---

Now — still waiting on your prediction from before:

**What is the one function the AI provider needs to expose, and what should it receive as input?** Think about what the service needs to hand over for the AI to generate a reply.
