---
description: Find what's trending in AI/tech on X and draft a Threads take
argument-hint: "<topic>"
---

# /social:trend-watch

Scan X for trending conversations on a topic and surface posting opportunities.

## Process

1. Run x_search_recent() for the topic + 2-3 related terms
2. Identify top 3 recurring angles (what are people saying?)
3. Summarize: "Top 3 angles on [topic] right now"
4. For each angle, generate 1 Threads draft in Alan's voice (see threads-format skill)
5. Show all 3 drafts for selection
6. On pick → run standard approval gate → threads_post()
