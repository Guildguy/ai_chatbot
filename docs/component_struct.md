COMPONENTS:

HTTP Request
     ↓
[ Controller ]      ← "What did the user ask?"
     ↓
[ Service ]         ← "How do we handle this?"
     ↓
[ Session Manager ] ← "What has been said before?"
[ AI Provider ]     ← "What does the AI say?"
     ↑
HTTP Response


Controller — Speaks HTTP. Reads the request, validates input, sends the response. It doesn't think, it just receives and delivers.\

Service — The brain. Orchestrates the logic: fetch session history, call the AI, update session, return the answer.

AI Provider — A thin wrapper around the OpenAI API (or any AI). Knows only how to talk to that external API. Nothing else.

Session Manager — Stores the conversation history per user. Gives the AI memory across messages.
