#!/bin/bash
set -x

# Change to script's directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ---------------------------------------------------------------------------
# Test runner for the Vue Router upgrade work (FW-7121).
#
# The Vue Router package itself only has Jest unit tests in
# packages/vue-router/__tests__/. The end-to-end tests for vue-router live in
# the @ionic/vue test app at packages/vue/test/, which exercises the full
# router/integration via Cypress (e2e) and Vitest (unit).
#
# This script orchestrates all three suites:
#   1. Build core, @ionic/vue, @ionic/vue-router
#   2. Run @ionic/vue-router Jest unit tests (locationHistory, viewStacks)
#   3. Build the Vue test app (default: vue3) and sync local packages
#   4. Run Vitest unit tests (router-outlet, routing, lifecycle, tabs, ...)
#   5. Start the Vite dev server on :8080
#   6. Run Cypress e2e tests
#
# Flags:
#   --skip-build         Skip core/vue/vue-router/test-app builds
#                        (reuse existing build artifacts)
#   --cypress-only       Skip Jest + Vitest, run only Cypress
#   --jest-only          Skip Vitest + Cypress, run only @ionic/vue-router Jest
#   --vitest-only        Skip Jest + Cypress, run only Vitest unit tests
#   --spec <pattern>     Filter Cypress tests by file path pattern
#                        (e.g. "routing" matches routing.cy.js)
#   --app <name>         Vue test app variant (default: vue3)
#   --serve              Build/sync and start the dev server only,
#                        open browser, no tests. Combine with --skip-build
#                        to serve an existing build.
# ---------------------------------------------------------------------------
SKIP_BUILD=0
CYPRESS_ONLY=0
JEST_ONLY=0
VITEST_ONLY=0
SERVE_ONLY=0
CYPRESS_SPEC=""
APP_NAME="vue3"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-build)
      SKIP_BUILD=1
      shift
      ;;
    --cypress-only)
      CYPRESS_ONLY=1
      shift
      ;;
    --jest-only)
      JEST_ONLY=1
      shift
      ;;
    --vitest-only)
      VITEST_ONLY=1
      shift
      ;;
    --serve)
      SERVE_ONLY=1
      shift
      ;;
    --spec)
      if [[ -z "$2" || "$2" == --* ]]; then
        echo "Error: --spec requires a value"
        exit 1
      fi
      CYPRESS_SPEC="$2"
      shift 2
      ;;
    --app)
      if [[ -z "$2" || "$2" == --* ]]; then
        echo "Error: --app requires a value"
        exit 1
      fi
      APP_NAME="$2"
      shift 2
      ;;
    *)
      echo "Unknown flag: $1"
      echo "Usage: $0 [--skip-build] [--cypress-only|--jest-only|--vitest-only] [--serve] [--spec <pattern>] [--app <name>]"
      exit 1
      ;;
  esac
done

REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
VUE_ROUTER_DIR="$REPO_ROOT/packages/vue-router"
VUE_DIR="$REPO_ROOT/packages/vue"
CORE_DIR="$REPO_ROOT/core"
TEST_DIR="$VUE_DIR/test"
BUILD_APP_DIR="$TEST_DIR/build/$APP_NAME"

if [ "$SKIP_BUILD" = "0" ]; then
  echo "Building core..."
  cd "$CORE_DIR"
  npm ci
  npm run build

  echo "Building @ionic/vue..."
  cd "$VUE_DIR"
  npm ci
  npm run sync
  npm run build

  echo "Building @ionic/vue-router..."
  cd "$VUE_ROUTER_DIR"
  npm ci
  npm run build
fi

# ---------------------------------------------------------------------------
# Run @ionic/vue-router Jest unit tests (locationHistory, viewStacks).
# These run against the source directly and don't need the test app.
# ---------------------------------------------------------------------------
if [ "$VITEST_ONLY" = "0" ] && [ "$CYPRESS_ONLY" = "0" ] && [ "$SERVE_ONLY" = "0" ]; then
  echo "Running @ionic/vue-router Jest unit tests..."
  cd "$VUE_ROUTER_DIR"
  npm run test.spec || JEST_FAILED=1
fi

if [ "$JEST_ONLY" = "1" ]; then
  if [ "${JEST_FAILED:-0}" = "1" ]; then
    echo "Jest unit tests failed."
    exit 1
  fi
  exit 0
fi

# ---------------------------------------------------------------------------
# Build the Vue test app (merges base + apps/<name> -> build/<name>).
# ---------------------------------------------------------------------------
if [ "$SKIP_BUILD" = "0" ]; then
  echo "Building Vue test app ($APP_NAME)..."
  cd "$TEST_DIR"
  rm -rf "build/$APP_NAME" || true
  sh ./build.sh "$APP_NAME"
  cd "$BUILD_APP_DIR"
  echo "Installing dependencies..."
  npm install > npm_install.log 2>&1
  npm run sync
else
  echo "Skipping build (--skip-build)."
  if [ ! -d "$BUILD_APP_DIR" ]; then
    echo "Error: $BUILD_APP_DIR does not exist. Run without --skip-build first."
    exit 1
  fi
  cd "$BUILD_APP_DIR"
fi

# ---------------------------------------------------------------------------
# Vitest unit tests (router-outlet, routing, lifecycle, tabs, ...).
# These run in jsdom and don't need the dev server.
# ---------------------------------------------------------------------------
if [ "$CYPRESS_ONLY" = "0" ] && [ "$SERVE_ONLY" = "0" ]; then
  echo "Running Vitest unit tests..."
  npm run test:unit -- --run || VITEST_FAILED=1
fi

if [ "$VITEST_ONLY" = "1" ]; then
  if [ "${VITEST_FAILED:-0}" = "1" ]; then
    echo "Vitest unit tests failed."
    exit 1
  fi
  exit 0
fi

# ---------------------------------------------------------------------------
# Cypress e2e tests need the Vite dev server on :8080.
# ---------------------------------------------------------------------------
echo "Cleaning up port 8080..."
lsof -ti:8080 | xargs kill -9 2>/dev/null || true

if [ "$SERVE_ONLY" = "1" ]; then
  echo "Starting server for manual testing..."
  echo "Press Ctrl+C to stop."

  npm start > server.log 2>&1 &
  SERVER_PID=$!
  trap "kill $SERVER_PID 2>/dev/null" EXIT

  for i in $(seq 1 60); do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 2>/dev/null | grep -q "200"; then
      echo "Server is ready at http://localhost:8080"
      open "http://localhost:8080" 2>/dev/null || true
      break
    fi
    if [ "$i" -eq 60 ]; then
      echo "Server did not start within 60s."
      cat server.log
      exit 1
    fi
    sleep 1
  done

  wait $SERVER_PID
  exit $?
fi

echo "Starting dev server..."
npm start > server.log 2>&1 &
SERVER_PID=$!
trap "kill $SERVER_PID 2>/dev/null" EXIT

echo "Waiting for server to start..."
for i in $(seq 1 60); do
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 2>/dev/null | grep -q "200"; then
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
if [ -n "$CYPRESS_SPEC" ]; then
  npx cypress run --headless --browser chrome --spec "tests/e2e/specs/*${CYPRESS_SPEC}*" || CYPRESS_FAILED=1
else
  npm run cypress || CYPRESS_FAILED=1
fi

if [ "${JEST_FAILED:-0}" = "1" ] || [ "${VITEST_FAILED:-0}" = "1" ] || [ "${CYPRESS_FAILED:-0}" = "1" ]; then
  echo "One or more test suites failed."
  echo "  Jest:    ${JEST_FAILED:-0}"
  echo "  Vitest:  ${VITEST_FAILED:-0}"
  echo "  Cypress: ${CYPRESS_FAILED:-0}"
  exit 1
fi
