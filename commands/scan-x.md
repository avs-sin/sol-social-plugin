---
description: Read X feed from any user or your watchlist — find posting opportunities
argument-hint: "<@username | 'watchlist' | topic keyword>"
---

# /social:scan-x

Read X posts from specific users or your watchlist to find opportunities.

## Process

1. If @username given → call x_user_timeline(username, 10)
2. If "watchlist" → call x_watchlist_scan() with default accounts
3. If keyword given → call x_search_recent(keyword, 20)
4. Display posts in numbered list: [n] @user — text preview — likes/reposts
5. Ask: "Which posts are interesting? (numbers, 'all', or 'none')"
6. For selected posts, offer: reply on X / crosspost to Threads / draft a take

## Default Watchlist
@sama, @mosseri, @hormozi, @steipete, @bcherny, @embirico, @AnthropicAI, @OpenAI, @openclaw, @ClaudeCodeLog, @trq212
