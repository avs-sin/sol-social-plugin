---
description: Show recent posts from X and Threads, pick ones to crosspost
argument-hint: "[x | threads | both]"
---

# /social:feed

Show recent posts from X and/or Threads. Select any to crosspost.

## Process

1. Default to X feed if no argument given
2. Call x_read_feed(5) and/or threads_read_feed(5)
3. Display numbered list:
   1. [date] [platform] — [text preview, 100 chars]
   2. ...

4. Ask: "Which would you like to crosspost? (enter number or 'none')"
5. Run crosspost flow for selected post
