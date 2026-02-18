#!/usr/bin/env node
/**
 * social-mcp HTTP/SSE server
 * Runs on localhost:3456 — accessible from Cowork's VM via http://localhost:3456
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import { execSync, spawn } from "child_process";
import http from "http";
import fs from "fs";

const PORT = 3456;
const DEFAULT_X_FEED_COUNT = 5;
const CLOUDFLARE_TUNNEL = {
  bin: "/opt/homebrew/bin/cloudflared",
  args: ["tunnel", "run", "social-mcp"],
  logPath: "/tmp/cloudflared-social-mcp.log",
  errorLogPath: "/tmp/cloudflared-social-mcp.error.log"
};
const THREADS_SCRIPT = "/Users/lyon/.openclaw/workspace/skills/threads-api/scripts/threads.sh";
const X_SCRIPT = "/Users/lyon/.openclaw/workspace/skills/x-api/scripts/x-api.sh";
const X_CREDS = "/Users/lyon/.config/x-api/credentials.json";
const THREADS_CREDS = "/Users/lyon/.config/threads/blk3yx-credentials.json";

let tunnelProcess;

function startTunnel() {
  try {
    tunnelProcess = spawn(CLOUDFLARE_TUNNEL.bin, CLOUDFLARE_TUNNEL.args, {
      detached: false,
      stdio: [
        "ignore",
        fs.openSync(CLOUDFLARE_TUNNEL.logPath, "a"),
        fs.openSync(CLOUDFLARE_TUNNEL.errorLogPath, "a")
      ]
    });

    tunnelProcess.on("exit", (code, signal) => {
      console.error(`cloudflared exited code=${code} signal=${signal}`);
    });
    tunnelProcess.on("error", (error) => {
      console.error("cloudflared failed to start:", error.message);
    });
  } catch (error) {
    console.error("Could not start cloudflared:", error.message);
  }
}

if (!process.env.NO_CLOUDFLARED) {
  startTunnel();
  process.on("exit", () => {
    if (tunnelProcess && !tunnelProcess.killed) {
      tunnelProcess.kill("SIGTERM");
    }
  });
}

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function safeTweetCount(count) {
  const requested = Number.isFinite(Number(count)) ? Math.floor(Number(count)) : DEFAULT_X_FEED_COUNT;
  const normalized = Math.max(requested, 1);
  return {
    requested: normalized,
    fetchCount: Math.min(Math.max(normalized, 5), 100),
  };
}

const server = new McpServer({
  name: "social-local",
  version: "1.0.0"
});

// X: read feed
server.tool("x_read_feed",
  { count: z.number().optional().describe("Number of tweets (default 5)") },
  async ({ count = DEFAULT_X_FEED_COUNT }) => {
    const creds = readJson(X_CREDS);
    const { requested, fetchCount } = safeTweetCount(count);
    const res = await fetch(
      `https://api.x.com/2/users/1776477300151975936/tweets?max_results=${fetchCount}&tweet.fields=text,created_at,public_metrics`,
      { headers: { Authorization: `Bearer ${creds.bearer_token}` } }
    );
    const data = await res.json();
    if (!Array.isArray(data?.data)) {
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data.data.slice(0, requested), null, 2) }]
    };
  }
);

// X: read single post
server.tool("x_read_post",
  { tweet_id: z.string().describe("Tweet ID or full URL") },
  async ({ tweet_id }) => {
    let id = tweet_id;
    const m = id.match(/status\/(\d+)/);
    if (m) id = m[1];
    const creds = readJson(X_CREDS);
    const res = await fetch(
      `https://api.x.com/2/tweets/${id}?tweet.fields=text,created_at,author_id,public_metrics`,
      { headers: { Authorization: `Bearer ${creds.bearer_token}` } }
    );
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data.data || data, null, 2) }] };
  }
);

// X: post tweet
server.tool("x_post",
  { text: z.string().describe("Tweet text (max 280 chars)") },
  async ({ text }) => {
    const escaped = text.replace(/"/g, '\\"');
    const result = execSync(`bash "${X_SCRIPT}" post "${escaped}"`, { encoding: "utf8" });
    return { content: [{ type: "text", text: result }] };
  }
);

// Threads: post
server.tool("threads_post",
  { text: z.string().describe("Post text (max 500 chars)") },
  async ({ text }) => {
    const escaped = text.replace(/"/g, '\\"');
    const result = execSync(`bash "${THREADS_SCRIPT}" post "${escaped}"`, { encoding: "utf8" });
    return { content: [{ type: "text", text: result }] };
  }
);

// Threads: read feed
server.tool("threads_read_feed",
  { count: z.number().optional().describe("Number of posts (default 5)") },
  async ({ count = 5 }) => {
    const creds = readJson(THREADS_CREDS);
    const res = await fetch(
      `https://graph.threads.net/v1.0/${creds.user_id}/threads?fields=id,text,timestamp,permalink&limit=${count}&access_token=${creds.access_token}`
    );
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data.data || data, null, 2) }] };
  }
);

// Threads: reply
server.tool("threads_reply",
  {
    post_id: z.string().describe("Threads post ID"),
    text: z.string().describe("Reply text")
  },
  async ({ post_id, text }) => {
    const escaped = text.replace(/"/g, '\\"');
    const result = execSync(`bash "${THREADS_SCRIPT}" reply "${post_id}" "${escaped}"`, { encoding: "utf8" });
    return { content: [{ type: "text", text: result }] };
  }
);

// Threads: inbox
server.tool("threads_inbox",
  {},
  async () => {
    const result = execSync(`bash "${THREADS_SCRIPT}" inbox`, { encoding: "utf8" });
    return { content: [{ type: "text", text: result }] };
  }
);

// Start HTTP server with SSE transport
const transports = {};

const httpServer = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/sse") {
    const transport = new SSEServerTransport("/message", res);
    transports[transport.sessionId] = transport;
    res.on("close", () => delete transports[transport.sessionId]);
    await server.connect(transport);
  } else if (req.method === "POST" && req.url.startsWith("/message")) {
    const sessionId = new URL(req.url, `http://localhost:${PORT}`).searchParams.get("sessionId");
    const transport = transports[sessionId];
    if (transport) {
      await transport.handlePostMessage(req, res);
    } else {
      res.writeHead(404).end("Session not found");
    }
  } else if (req.url === "/health") {
    res.writeHead(200).end(JSON.stringify({ status: "ok", tools: ["x_read_feed","x_read_post","x_post","threads_post","threads_read_feed","threads_reply","threads_inbox"] }));
  } else {
    res.writeHead(404).end("Not found");
  }
});

httpServer.listen(PORT, "127.0.0.1", () => {
  console.log(`✅ social-mcp running at http://localhost:${PORT}`);
  console.log(`   SSE endpoint: http://localhost:${PORT}/sse`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});
