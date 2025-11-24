#!/bin/bash
set -x

# Change to script's directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Inside core
echo "Building core..."
cd ../../../core
npm run build

# Inside packages/react
echo "Building packages/react..."
cd ../packages/react
npm ci
npm run sync
npm run build

# Inside packages/react-router
echo "Building packages/react-router..."
cd ../react-router
npm ci
npm run sync
npm run build

# Inside packages/react-router/test
echo "Building test app..."
cd ./test
rm -rf build/reactrouter6 || true
sh ./build.sh reactrouter6
cd build/reactrouter6
echo "Installing dependencies..."
npm install --legacy-peer-deps > npm_install.log 2>&1
npm run sync

echo "Cleaning up port 3000..."
lsof -ti:3000 | xargs kill -9 || true

echo "Starting server..."
# Start server in background and save PID
npm start > server.log 2>&1 &
SERVER_PID=$!

# Ensure server is killed on script exit
trap "kill $SERVER_PID" EXIT

echo "Waiting for server to start (30s)..."
sleep 30

echo "Checking server status..."
SERVER_RESPONSE=$(curl -s -v http://localhost:3000 2>&1)
if echo "$SERVER_RESPONSE" | grep -q "Child compilation failed"; then
  echo "Server started but has compilation errors. Exiting."
  echo "$SERVER_RESPONSE"
  exit 1
fi

if ! echo "$SERVER_RESPONSE" | grep -q "200 OK"; then
  echo "Server did not return 200 OK. Exiting."
  echo "$SERVER_RESPONSE"
  exit 1
fi
echo "Server is healthy."

echo "Running Cypress tests..."
# Run specific failing tests first
npm run cypress -- --spec "tests/e2e/specs/swipe-to-go-back.cy.js"

