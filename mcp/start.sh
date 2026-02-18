#!/bin/bash
# Start social-mcp server — run this once before using the plugin in Cowork
cd "$(dirname "$0")"
echo "Starting social-mcp on http://localhost:3456..."
node server.js
