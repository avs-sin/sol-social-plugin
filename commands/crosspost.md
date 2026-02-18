---
description: Read a post from X or Threads and cross-post it to the other platform with tone adaptation
argument-hint: "<tweet URL, tweet ID, or 'latest'>"
---

# /social:crosspost

Cross-post content between X and Threads. Always adapt tone for each platform.

## Process

1. **Get the source post**
   - If tweet URL or ID given → call x_read_post() to fetch it
   - If "latest" or no argument → call x_read_feed(1) to get most recent X post
   - If Threads URL → call threads_read_feed() and find it

2. **Adapt for target platform**
   - X → Threads: apply Threads format rules (lowercase, no hashtags, conversational)
   - Threads → X: apply X format rules (punchy, 280 chars, title case)

3. **Show preview side by side**
   Original: [original text]
   Adapted: [adapted text]
   Ask: "Post this to [platform]? (yes/no)"

4. **Post on confirmation**
   - Call threads_post() or x_post() with adapted text
   - Return post URL

## Example
Input: `/social:crosspost latest`
→ Fetches last X post via x_read_feed
→ Adapts to Threads tone
→ Shows preview
→ Posts on confirm
