#!/bin/bash
set -e

# Kill any existing server on port 8787
kill $(lsof -t -i:8787) 2>/dev/null || true
sleep 1

# Serve the HTML file
python3 -m http.server 8787 --directory /home/jvr0x/dev/tok-sim &
SERVER_PID=$!

# Wait for server to be ready
for i in $(seq 1 10); do
  if curl -s http://127.0.0.1:8787/ > /dev/null 2>&1; then
    break
  fi
  sleep 0.5
done

# Run tests
npx playwright test

# Cleanup
kill $SERVER_PID 2>/dev/null || true
