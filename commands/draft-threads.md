---
description: Draft 3 Threads posts from any input in Alan's voice. Always requires approval.
argument-hint: "<tweet URL | @user | topic | idea>"
---

# /social:draft-threads

Generate 3 Threads-ready drafts in Alan's voice. Never auto-post.

## Input Handling
- Tweet URL/ID → x_read_post(), use as source material
- @username → x_user_timeline(user, 5), pick most engaging post
- Free text → treat as topic/idea directly

## Draft Process
1. Extract the core insight or angle
2. Generate 3 drafts using different styles:
   - **Draft A:** sama style (lowercase, casual, 1-2 lines max)
   - **Draft B:** Hormozi style (one-liner counterintuitive truth <15 words)
   - **Draft C:** mosseri style (thought bomb, slightly longer)
3. Show all 3 side by side
4. Ask: "Which to post? (A/B/C/edit/none)"
5. On confirm → threads_post() → return permalink

## Alan's Content Themes
Claude Code, OpenClaw, Codex CLI, model comparisons, VegasOps agency, App Store builds, AI workflows, building in public
