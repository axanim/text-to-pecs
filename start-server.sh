#!/bin/bash
# Coding Circle codebase server startup
# Run this at the start of every session

if [ -z "$CODESPACE_TOKEN" ]; then
  echo "Error: CODESPACE_TOKEN not set"
  echo "Get your token from: Dashboard → Group Settings → Projects → Text to PECS"
  exit 1
fi

PROJECT_PATH=/workspaces/text-to-pecs

echo "Starting file server on port 8080..."
npx serve . -l 8080 &
SERVE_PID=$!

echo "Starting codebase server on port 3001..."
CODESPACE_TOKEN=$CODESPACE_TOKEN \
PROJECT_PATH=$PROJECT_PATH \
node codespace-server.mjs
