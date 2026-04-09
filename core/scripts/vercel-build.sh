#!/bin/bash
#
# Vercel preview build script
#
# Builds core component tests (same as before) plus framework test apps
# (Angular, React, Vue) so they're all accessible from a single preview URL.
#
# Core tests:        /src/components/{name}/test/{scenario}
# Angular test app:  /angular/
# React test app:    /react/
# Vue test app:      /vue/
#
set -e

# Vercel places core/ at /vercel/path1 (bind mount). The full repo clone
# lives at /vercel/path0. We can't rely on `..` to reach it, so we search.
CORE_DIR=$(pwd)
OUTPUT_DIR="${CORE_DIR}/../_vercel_output"

# Find the actual repo root (the directory containing packages/)
REPO_ROOT=""
for candidate in /vercel/path0 /vercel/path1 "${CORE_DIR}/.."; do
  if [ -d "${candidate}/packages" ]; then
    REPO_ROOT="${candidate}"
    break
  fi
done

echo "=== Ionic Framework Preview Build ==="
echo "Core dir: ${CORE_DIR}"
echo "Repo root: ${REPO_ROOT:-NOT FOUND}"

rm -rf "${OUTPUT_DIR}"
mkdir -p "${OUTPUT_DIR}"

# Step 1 - Build Core (dependencies already installed by Vercel installCommand)
echo ""
echo "--- Step 1: Building Core ---"
npm run build

# Copy core files to output. The test HTML files use relative paths like
# ../../../../../dist/ionic/ionic.esm.js so the directory structure must
# be preserved exactly.
echo "Copying core output..."
cp -r "${CORE_DIR}/src" "${OUTPUT_DIR}/src"
cp -r "${CORE_DIR}/dist" "${OUTPUT_DIR}/dist"
cp -r "${CORE_DIR}/css" "${OUTPUT_DIR}/css"
mkdir -p "${OUTPUT_DIR}/scripts"
cp -r "${CORE_DIR}/scripts/testing" "${OUTPUT_DIR}/scripts/testing"

# Generate directory index pages so users can browse core test pages.
# Creates an index.html in every directory under src/components/ that
# doesn't already have one. Only includes child directories that eventually
# lead to a test page (an index.html). Prunes snapshot dirs and dead ends.
echo "Generating directory indexes for core tests..."
generate_dir_index() {
  local dir="$1"
  local url_path="$2"
  # Skip if an index.html already exists (it's an actual test page)
  [ -f "${dir}/index.html" ] && return

  local entries=""
  for child in "${dir}"/*/; do
    [ -d "${child}" ] || continue
    local name=$(basename "${child}")
    # Skip snapshot directories and hidden dirs
    case "${name}" in *-snapshots|.*) continue ;; esac
    # Only include if there's at least one index.html somewhere underneath
    find "${child}" -name "index.html" -print -quit | grep -q . || continue
    entries="${entries}<a href=\"${name}/\">${name}/</a>\n"
  done

  [ -z "${entries}" ] && return

  cat > "${dir}/index.html" << IDXEOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Index of ${url_path}</title>
  <style>
    body { font-family: monospace; padding: 1.5rem; background: #f5f5f5; }
    h1 { font-size: 1rem; margin-bottom: 1rem; color: #333; }
    a { display: block; padding: 4px 0; color: #1565c0; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .up { margin-bottom: 0.5rem; color: #666; }
  </style>
</head>
<body>
  <h1>Index of ${url_path}</h1>
  <a class="up" href="../">../</a>
$(echo -e "${entries}")
</body>
</html>
IDXEOF
}

# Walk all directories under src/ (bottom-up so parent indexes reflect pruned children)
find "${OUTPUT_DIR}/src" -depth -type d | while IFS= read -r dir; do
  url_path="${dir#${OUTPUT_DIR}}"
  generate_dir_index "${dir}" "${url_path}/"
done

# Vercel mounts core/ at a separate path (path1) from the repo clone (path0).
# Framework packages reference core via relative paths (../../core/css etc.),
# which resolve to path0/core/ -- not path1/ where we just built.
# Symlink path0/core -> path1 so those references find the build outputs.
if [ -n "${REPO_ROOT}" ] && [ "${CORE_DIR}" != "${REPO_ROOT}/core" ] && [ -d "${REPO_ROOT}/core" ]; then
  echo "Linking ${REPO_ROOT}/core -> ${CORE_DIR} (so framework builds find core outputs)"
  rm -rf "${REPO_ROOT}/core"
  ln -s "${CORE_DIR}" "${REPO_ROOT}/core"
fi

# Check if the full repo is available
if [ -z "${REPO_ROOT}" ]; then
  echo ""
  echo "WARNING: Could not find repo root (no directory with packages/ found)"
  echo "Only core tests will be deployed (framework test apps require the full repo)."

  # Generate landing page and exit -- core tests are still useful
  cat > "${OUTPUT_DIR}/index.html" << 'LANDING_EOF'
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Ionic Framework - Preview</title></head>
<body><h1>Ionic Framework Preview</h1><p>Core tests only. Browse to /src/components/{name}/test/{scenario}/</p></body>
</html>
LANDING_EOF

  echo "=== Preview build complete (core only) ==="
  exit 0
fi

# Step 2 - Build Framework Packages (parallel)
echo ""
echo "--- Step 2: Building Framework Packages ---"

build_angular_pkgs() {
  (cd "${REPO_ROOT}/packages/angular" && npm install && npm run build) || return 1
  (cd "${REPO_ROOT}/packages/angular-server" && npm install && npm run build) || return 1
}

build_react_pkgs() {
  (cd "${REPO_ROOT}/packages/react" && npm install && npm run build) || return 1
  (cd "${REPO_ROOT}/packages/react-router" && npm install && npm run build) || return 1
}

build_vue_pkgs() {
  (cd "${REPO_ROOT}/packages/vue" && npm install && npm run build) || return 1
  (cd "${REPO_ROOT}/packages/vue-router" && npm install && npm run build) || return 1
}

build_angular_pkgs > /tmp/vercel-angular-pkg.log 2>&1 &
PID_ANG=$!
build_react_pkgs > /tmp/vercel-react-pkg.log 2>&1 &
PID_REACT=$!
build_vue_pkgs > /tmp/vercel-vue-pkg.log 2>&1 &
PID_VUE=$!

ANG_PKG_OK=true; REACT_PKG_OK=true; VUE_PKG_OK=true
wait $PID_ANG  || { echo "Angular packages failed:"; tail -30 /tmp/vercel-angular-pkg.log; ANG_PKG_OK=false; }
wait $PID_REACT || { echo "React packages failed:";  tail -30 /tmp/vercel-react-pkg.log;  REACT_PKG_OK=false; }
wait $PID_VUE   || { echo "Vue packages failed:";    tail -30 /tmp/vercel-vue-pkg.log;    VUE_PKG_OK=false; }

if ! $ANG_PKG_OK || ! $REACT_PKG_OK || ! $VUE_PKG_OK; then
  echo "ERROR: Some framework package builds failed."
  echo "Core tests will still be deployed. Skipping failed framework test apps."
else
  echo "All framework packages built."
fi

# Step 3 - Build Framework Test Apps (parallel)
echo ""
echo "--- Step 3: Building Framework Test Apps ---"

# Find the best available app version for a given package
pick_app() {
  local test_dir="$1"
  shift
  for v in "$@"; do
    if [ -d "${test_dir}/apps/${v}" ]; then
      echo "${v}"
      return 0
    fi
  done
  return 1
}

build_angular_test() {
  local APP
  APP=$(pick_app "${REPO_ROOT}/packages/angular/test" ng20 ng19 ng18) || {
    echo "[angular] No test app found, skipping."
    return 0
  }
  echo "[angular] Building ${APP}..."

  cd "${REPO_ROOT}/packages/angular/test"
  ./build.sh "${APP}"
  cd "build/${APP}"
  npm install
  npm run sync
  # --base-href sets <base href="/angular/"> so Angular Router works under the sub-path
  npm run build -- --base-href /angular/

  # Output path assumes the 'browser' builder. If migrated to 'application' builder, update this.
  if [ ! -d "dist/test-app/browser" ]; then
    echo "[angular] ERROR: Expected output at dist/test-app/browser/ not found."
    return 1
  fi
  mkdir -p "${OUTPUT_DIR}/angular"
  cp -r dist/test-app/browser/* "${OUTPUT_DIR}/angular/"
  echo "[angular] Done."
}

build_react_test() {
  local APP
  APP=$(pick_app "${REPO_ROOT}/packages/react/test" react19 react18) || {
    echo "[react] No test app found, skipping."
    return 0
  }
  echo "[react] Building ${APP}..."

  cd "${REPO_ROOT}/packages/react/test"
  ./build.sh "${APP}"
  cd "build/${APP}"
  npm install
  npm run sync
  # --base sets Vite's base URL; import.meta.env.BASE_URL is read by IonReactRouter basename
  npx vite build --base /react/

  mkdir -p "${OUTPUT_DIR}/react"
  cp -r dist/* "${OUTPUT_DIR}/react/"
  echo "[react] Done."
}

build_vue_test() {
  local APP
  APP=$(pick_app "${REPO_ROOT}/packages/vue/test" vue3) || {
    echo "[vue] No test app found, skipping."
    return 0
  }
  echo "[vue] Building ${APP}..."

  cd "${REPO_ROOT}/packages/vue/test"
  ./build.sh "${APP}"
  cd "build/${APP}"
  npm install
  npm run sync
  # Vue Router already reads import.meta.env.BASE_URL which Vite sets from --base
  npx vite build --base /vue/

  mkdir -p "${OUTPUT_DIR}/vue"
  cp -r dist/* "${OUTPUT_DIR}/vue/"
  echo "[vue] Done."
}

# TODO: Add build_react_router_test() when reactrouter6-* apps are added to
# packages/react-router/test/apps/

TEST_FAILED=""

if $ANG_PKG_OK; then
  build_angular_test > /tmp/vercel-angular-test.log 2>&1 &
  PID_ANG_TEST=$!
fi
if $REACT_PKG_OK; then
  build_react_test > /tmp/vercel-react-test.log 2>&1 &
  PID_REACT_TEST=$!
fi
if $VUE_PKG_OK; then
  build_vue_test > /tmp/vercel-vue-test.log 2>&1 &
  PID_VUE_TEST=$!
fi

if $ANG_PKG_OK; then
  wait $PID_ANG_TEST   || { echo "Angular test app failed:";       tail -30 /tmp/vercel-angular-test.log; TEST_FAILED="${TEST_FAILED} angular"; }
fi
if $REACT_PKG_OK; then
  wait $PID_REACT_TEST || { echo "React test app failed:";         tail -30 /tmp/vercel-react-test.log;   TEST_FAILED="${TEST_FAILED} react"; }
fi
if $VUE_PKG_OK; then
  wait $PID_VUE_TEST   || { echo "Vue test app failed:";           tail -30 /tmp/vercel-vue-test.log;     TEST_FAILED="${TEST_FAILED} vue"; }
fi

if [ -n "${TEST_FAILED}" ]; then
  echo ""
  echo "WARNING: Some test app builds failed:${TEST_FAILED}"
  echo "Core tests and successful framework apps will still be deployed."
fi

# Step 4 - Landing Page
echo ""
echo "--- Step 4: Generating landing page ---"

cat > "${OUTPUT_DIR}/index.html" << 'LANDING_EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ionic Framework - Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5; padding: 2rem; color: #333;
    }
    .container { max-width: 680px; margin: 0 auto; }
    h1 { font-size: 1.4rem; margin-bottom: 0.25rem; }
    .subtitle { color: #666; margin-bottom: 1.5rem; font-size: 0.875rem; }
    .cards { display: grid; gap: 0.75rem; }
    a.card {
      background: #fff; border-radius: 8px; padding: 1rem 1.25rem;
      text-decoration: none; color: inherit;
      border: 1px solid #e0e0e0; transition: border-color 0.15s;
    }
    a.card:hover { border-color: #4f8ef7; }
    .card h2 { font-size: 1rem; margin-bottom: 0.2rem; display: flex; align-items: center; gap: 0.5rem; }
    .card p { color: #666; font-size: 0.8rem; }
    hr { border: none; border-top: 1px solid #e0e0e0; margin: 1rem 0; }
    .tip { font-size: 0.75rem; color: #999; margin-top: 1rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Ionic Framework Preview</h1>
    <p class="subtitle">Component test apps for manual validation</p>
    <div class="cards">
      <a class="card" href="/src/components/">
        <h2>Core Components</h2>
        <p>Browse to /src/components/{name}/test/{scenario}/</p>
      </a>
      <hr>
      <a class="card" href="/angular/">
        <h2>Angular</h2>
        <p>@ionic/angular standalone + lazy-loaded component tests</p>
      </a>
      <a class="card" href="/react/">
        <h2>React</h2>
        <p>@ionic/react overlays, hooks, tabs, form controls</p>
      </a>
      <a class="card" href="/vue/">
        <h2>Vue</h2>
        <p>@ionic/vue overlays, router, tabs, lifecycle</p>
      </a>
    </div>
  </div>
</body>
</html>
LANDING_EOF

echo ""
echo "=== Preview build complete ==="
ls -la "${OUTPUT_DIR}"
