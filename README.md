# Raya

A tunable design-system studio: browse live component previews, tune tokens and
component defaults into named Systems, then pull components into your apps via a
shadcn-style Registry.

- **Site:** https://raya.alfrizk.dev
- **Status:** built and deployed — spec locked in [`BUILD-SPEC.md`](./BUILD-SPEC.md)

## Stack

TanStack Start (SSR) · React 19 · TypeScript · Tailwind v4 · Base UI primitives
· recharts (wrapped) · Fontsource faces · Cloudflare Workers.

## Development

```sh
npm install
npm run dev              # Studio on http://localhost:3000
npm run typecheck
npm run registry:build   # regenerate public/r (committed)
npm run check:fixture    # tier 4 consumer round-trip harness
npm run deploy           # registry build + vite build + wrangler deploy
```

Guardrails run locally via husky: pre-commit runs typecheck → `shadcn registry
validate` → `shadcn build` → committed-`public/r` freshness; pre-push runs the
round-trip fixture app. See BUILD-SPEC §13.

## Consuming a System

```sh
npx shadcn init
# add to components.json:
#   "registries": { "@raya": "https://raya.alfrizk.dev/r/{name}.json" }
npx shadcn add @raya/core @raya/raya-fonts @raya/baseline @raya/button @raya/data-table
```

Paste the printed `@import` snippet into `styles.css`, then set
`data-raya="<slug>"` on `<html>`; toggle `.dark` for dark mode. Switching
Systems swaps the attribute — no runtime JS.

## Layout

- `src/` — Studio app (TanStack Start routes + tuner chrome)
- `registry/` — component and System sources; `public/r/` is generated + committed
- `tools/roundtrip-fixture/` — pre-push consumer harness
- [`BUILD-SPEC.md`](./BUILD-SPEC.md) — the locked spec; [`CONTEXT.md`](./CONTEXT.md) — normative glossary
