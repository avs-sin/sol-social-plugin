---
name: tone-adapter
description: How to adapt content between X and Threads while preserving the core message.
---

# Tone Adaptation Rules

## X → Threads
1. Remove hashtags from body
2. Remove URLs — don't include bare links
3. Lowercase the text (unless proper noun)
4. Expand slightly — Threads allows more chars, add a thought
5. Make it conversational — like texting, not broadcasting
6. Replace em-dashes with commas or line breaks

### Example
X: "Claude Sonnet 4.6 is live. 40% cheaper, same quality. #AI #Claude"
Threads: "claude sonnet 4.6 just dropped. 40% cheaper and honestly same quality. makes the upgrade a no-brainer"

## Threads → X
1. Tighten to 280 chars — cut aggressively
2. Sentence case — more authoritative
3. Add 1 hashtag if relevant and under char limit
4. Lead with the punchiest line

### Example
Threads: "been running claude sonnet 4.6 for a week now. 40% cheaper than opus, outputs are basically identical for 90% of tasks."
X: "Claude Sonnet 4.6 for a week: 40% cheaper, identical outputs on 90% of tasks. Worth the switch. #Claude"
