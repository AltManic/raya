#!/bin/bash
# Tier 4: consumer round-trip — install EVERY item into a clean fixture app
# and prove it typechecks and builds. Cached by node_modules persistence.
set -e
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
FIXTURE="$ROOT/tools/roundtrip-fixture"
PORT="${RAYA_FIXTURE_PORT:-4870}"
SERVER_PID=""

cleanup() { [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null; }
trap cleanup EXIT

start_server() {
  nohup python3 -m http.server "$PORT" --directory "$ROOT/public" </dev/null >/dev/null 2>&1 &
  SERVER_PID=$!
  for _ in $(seq 1 50); do
    curl -sf "http://127.0.0.1:$PORT/r/registry.json" >/dev/null 2>&1 && return 0
    sleep 0.2
  done
  return 1
}

cd "$ROOT"
echo "[fixture] rebuilding registry…"
npx shadcn build

start_server || {
  echo "✗ fixture registry server failed to start on port $PORT" >&2
  exit 1
}

node -e "
const fs = require('fs');
const path = '$FIXTURE/components.json';
const value = JSON.parse(fs.readFileSync(path, 'utf8'));
value.registries ??= {};
value.registries['@raya'] = 'http://127.0.0.1:$PORT/r/{name}.json';
fs.writeFileSync(path, JSON.stringify(value, null, 2) + '\\n');
"

if [ ! -d "$FIXTURE/node_modules" ]; then
  echo "[fixture] installing dependencies (cold)…"
  (cd "$FIXTURE" && npm install --silent)
fi
(cd "$FIXTURE" && npm install --silent)

echo "[fixture] installing all registry items…"
ITEMS=$(node -e "const r=require('$ROOT/public/r/registry.json'); console.log(r.items.map(i=>i.name).join(' '))")
for item in $ITEMS; do
  echo "  + @raya/$item"
  if ! curl -sf "http://127.0.0.1:$PORT/r/registry.json" >/dev/null 2>&1; then
    echo "[fixture] registry server stopped; restarting…"
    start_server || { echo "✗ fixture registry server stopped on port $PORT" >&2; exit 1; }
  fi
  (cd "$FIXTURE" && npx shadcn add "@raya/$item" --overwrite --yes)
done

echo "[fixture] wiring styles…"
cat > "$FIXTURE/src/styles.css" <<'CSS'
@import "tailwindcss";
@import "./styles/raya/fonts.css";
@import "./styles/raya/core.css";
@import "./styles/raya/systems/baseline.css";
@import "./styles/raya/systems/terminal.css";
CSS

echo "[fixture] ensuring icon library deps…"
(cd "$FIXTURE" && node -e "
const p = require('./package.json');
p.dependencies ??= {};
if (!p.dependencies['@hugeicons/react']) p.dependencies['@hugeicons/react'] = '^1.0.0';
if (!p.dependencies['@hugeicons/core-free-icons']) p.dependencies['@hugeicons/core-free-icons'] = '^1.0.0';
require('fs').writeFileSync('package.json', JSON.stringify(p, null, 2) + '\n');
" && npm install --silent)

echo "[fixture] typecheck + build…"
(cd "$FIXTURE" && npx tsc --noEmit && npx vite build)

echo "[fixture] ✓ round-trip passed for all items under both demo Systems."
