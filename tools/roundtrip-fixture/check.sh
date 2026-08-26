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

cd "$ROOT"
echo "[fixture] rebuilding registry…"
npx shadcn build

python3 -m http.server "$PORT" --directory "$ROOT/public" >/dev/null 2>&1 &
SERVER_PID=$!
sleep 1

if [ ! -d "$FIXTURE/node_modules" ]; then
  echo "[fixture] installing dependencies (cold)…"
  (cd "$FIXTURE" && npm install --silent)
fi
(cd "$FIXTURE" && npm install --silent)

echo "[fixture] installing all registry items…"
ITEMS=$(node -e "const r=require('$ROOT/public/r/registry.json'); console.log(r.items.map(i=>i.name).join(' '))")
for item in $ITEMS; do
  echo "  + @raya/$item"
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
