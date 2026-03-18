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

# Install Playwright browsers if not already present
npx playwright install chromium 2>/dev/null || true

echo "Cleaning up port 3000..."
lsof -ti:3000 | xargs kill -9 || true

echo "Starting server..."
# Start server in background and save PID
npm start > server.log 2>&1 &
SERVER_PID=$!

# Ensure server is killed on script exit
trap "kill $SERVER_PID" EXIT

echo "Waiting for server to start..."
# Poll until the server responds (up to 60s)
for i in $(seq 1 60); do
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null | grep -q "200"; then
    echo "Server is healthy."
    break
  fi
  if [ "$i" -eq 60 ]; then
    echo "Server did not start within 60s. Exiting."
    cat server.log
    exit 1
  fi
  sleep 1
done

echo "Running Cypress tests..."
npm run cypress || CYPRESS_FAILED=1

echo "Running Playwright tests..."
npx playwright test --retries=2 || PLAYWRIGHT_FAILED=1

if [ "${CYPRESS_FAILED:-0}" = "1" ] || [ "${PLAYWRIGHT_FAILED:-0}" = "1" ]; then
  echo "One or more test suites failed."
  exit 1
fi

