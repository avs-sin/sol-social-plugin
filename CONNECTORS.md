# social-plugin Connectors

## MCP Server (social-local)

Runs at `http://localhost:3456` via HTTP/SSE and is also exposed publicly at `https://mcp.vegasops.com/sse` through Cloudflare Tunnel.

### Auto-start
The server starts automatically on login via launchd:
```
~/Library/LaunchAgents/com.vegasops.social-mcp.plist
```
Logs: `/tmp/social-mcp.log`, `/tmp/social-mcp.error.log`, `/tmp/cloudflared-social-mcp.log`, and `/tmp/cloudflared-social-mcp.error.log`

### Manual start
```bash
node ~/Projects/social-plugin/mcp/server.js
# or
bash ~/Projects/social-plugin/mcp/start.sh
```

### Health check
```bash
curl http://127.0.0.1:3456/health
curl https://mcp.vegasops.com/health
```

### Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sse` | GET | SSE transport for MCP clients |
| `/message?sessionId=...` | POST | MCP message handler |
| `/health` | GET | Server status + tool list |

---

## Tools

| Tool | Description |
|------|-------------|
| `x_read_feed` | Get recent tweets from @blkynx |
| `x_read_post` | Fetch a specific tweet by ID or URL |
| `x_post` | Post a tweet as @blkynx |
| `threads_post` | Post to Threads as @blk3yx |
| `threads_read_feed` | Get recent Threads posts |
| `threads_reply` | Reply to a Threads post |
| `threads_inbox` | Get prioritized reply inbox |

---

## Credentials

| Platform | Credential File |
|----------|----------------|
| Threads (@blk3yx) | `~/.config/threads/blk3yx-credentials.json` |
| X (@blkynx) | `~/.config/x-api/credentials.json` |

---

## Cowork Connection

The plugin registers via `.mcp.json` in the project root and globally via `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "social-local": {
      "type": "sse",
      "url": "https://mcp.vegasops.com/sse"
    }
  }
}
```

Available globally — no need to open the social-plugin project directory.

### Important

- The social plugin is already set to the MCP API connector. It does **not** use browser scraping for X.
- If your Cowork connector UI prevents editing the URL, keep `https://mcp.vegasops.com/sse` and skip manual edits.
- If Cowork shows a `SSE error: Non-200` while testing connectors, restart Cowork after re-uploading the latest zip, then run:

```bash
curl -s --resolve mcp.vegasops.com:443:104.21.78.188 https://mcp.vegasops.com/health
curl -s --resolve mcp.vegasops.com:443:172.67.168.89 https://mcp.vegasops.com/health
```

If one of those returns `{"status":"ok"...}`, the endpoint is healthy and we should continue by restarting Cowork.

### Cowork setup checklist
1. Restart Cowork after plugin zip is uploaded.
2. In connector settings, use exactly `https://mcp.vegasops.com/sse`.
3. Open a new session and confirm `social-local` is connected.
4. Run `x_read_feed` to test access to your latest X posts.
