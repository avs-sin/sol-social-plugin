---
description: Post to X and Threads simultaneously with platform-optimized text
argument-hint: "<your message>"
---

# /social:post

Post to both X and Threads at the same time, adapting the message for each platform.

## Process

1. Take input text
2. Create X version (max 280 chars, sentence case, 1 hashtag if relevant)
3. Create Threads version (max 500 chars, lowercase, no hashtags, conversational)
4. Show both versions as preview:

   **X (@blkynx):** [x version]
   **Threads (@blk3yx):** [threads version]

5. Ask: "Post to both? (both / x-only / threads-only / edit)"
6. Call x_post() and/or threads_post() based on response
7. Return both post URLs

## Rules
- Never auto-post without showing preview first
- Always adapt — never copy-paste same text to both platforms
- If text is already 280 chars or under and punchy → use as X, expand for Threads
