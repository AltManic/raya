# BUILD-SPEC.md — Raya

**Status:** Locked by [Wayfinder map: Raya design-system studio](https://github.com/AltManic/raya/issues/1), synthesizing decisions from tickets [#2](https://github.com/AltManic/raya/issues/2) (registry/Base UI/HugeIcons facts), [#4](https://github.com/AltManic/raya/issues/4) (token vocabulary), [#8](https://github.com/AltManic/raya/issues/8) (fonts), [#3](https://github.com/AltManic/raya/issues/3) (inventory + knobs), [#5](https://github.com/AltManic/raya/issues/5) (export round-trip prototype), [#6](https://github.com/AltManic/raya/issues/6) (tuner UX), [#9](https://github.com/AltManic/raya/issues/9) (demo data). Every decision here is build-ready; an executing session makes implementation choices, not product ones. Fully locked — the last open point (registry guardrails) was decided by [#10](https://github.com/AltManic/raya/issues/10) → §13.

**Terminology:** `CONTEXT.md` is normative. **System** (not theme/skin/preset) = named bundle of token values + component knobs. There is exactly one component set; Systems restyle it via CSS variables. **Studio** = the site. **Registry** = shadcn-style copy-source distribution at `/r/*.json`.

## 1. Stack & constraints

- TanStack Start (SSR) · React 19 · TypeScript · Tailwind v4 (CSS-first config, `@theme`)
- Primitives: [`@base-ui/react`](https://www.npmjs.com/package/@base-ui/react) only (≥1.7). Base UI API note: `render={}` composition, **not** Radix `asChild` — port patterns accordingly.
- Charts: recharts, wrapped (never exposed raw to consumers)
- Icons: HugeIcons free set via npm packages (`@hugeicons/react` + `@hugeicons/core-free-icons`); consumer-swappable through the CLI's `iconLibrary` (§8)
- Fonts: Fontsource npm packages (§4)
- Deploy target: Cloudflare Workers, custom domain raya.alfrizk.dev (§11)
- Posture: personal tool, public repo, clean IP. OFL fonts; HugeIcons consumed via npm only — **never vendor icon SVG sources into the repo** (license forbids redistribution even of the free set).

## 2. Repository layout

```
raya/
├── BUILD-SPEC.md
├── CONTEXT.md                # glossary — normative terminology
├── src/                      # Studio app (TanStack Start)
│   ├── routes/               # tuner surface at site root (§9)
│   ├── components/           # rail, canvas, export slide-over…
│   └── lib/
│       ├── model/            # System/Knob types + exporter — lift from
│       │                     #   prototypes/export-roundtrip/studio-model/src/
│       └── systems/          # stored System definitions (Baseline, Terminal, user-created)
├── registry/
│   ├── registry.json         # catalog source
│   └── default/
│       ├── ui/*.tsx          # core primitives (§5)
│       └── bi/*.tsx          # BI Pack (§5)
├── public/r/                   # GENERATED + COMMITTED — `npx shadcn build` output,
│                               #   freshness-gated (§13); served statically
└── tools/
    └── roundtrip-fixture/      # pre-push consumer round-trip harness (§13); dev-only
```

Authoring convention inside `registry/`: internal imports are written as `@/registry/default/…`; the CLI rewrites them to consumer aliases at install time.

## 3. Token vocabulary

Per [#4](https://github.com/AltManic/raya/issues/4). All color values are OKLCH.

### 3.1 Semantic tokens — full current shadcn v4 set, byte-identical names

`--background/--foreground` · `--card(+foreground)` · `--popover(+foreground)` · `--primary(+foreground)` · `--secondary(+foreground)` · `--muted(+foreground)` · `--accent(+foreground)` · `--destructive(+foreground)` · `--border` · `--input` · `--ring` · `--chart-1…5` · `--sidebar-*` family.

Adopted whole even where v1 components don't use every variable. This byte-compatibility is the mechanical guarantee that Raya components drop into existing shadcn apps unchanged. Semantic tokens are single opaque colors — never gradients.

### 3.2 Primitive scales

`--raya-<hue>-1…12` ramps (12 steps each), generated from seed colors; semantic tokens reference into them. The `--raya-` prefix guarantees no collision with shadcn names. Light ramp stored under `:root`, dark ramp under `.dark`.

### 3.3 Radius, shadows, fonts

- Single master `--radius`; derivations follow the standard shadcn convention:
  ```css
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  ```
- Shadows: `--raya-shadow-sm/md/lg`
- Fonts: `--font-sans`, `--font-serif`, `--font-mono` (values per §4)

### 3.4 Explicitly not tokens in v1

Spacing and type scale (Tailwind classes own them) · global density (per-component knob, §5). A `--raya-density` multiplier may graduate later only if cross-component scaling proves painful.

### 3.5 Fixed vs swappable

| | |
|---|---|
| **Fixed across Raya** | variable names, `.dark` convention, radius derivation formula, `--raya-` prefix rule, semantic-tokens-are-opaque rule |
| **Swappable per System** | every *value* |

### 3.6 Light/Dark encoding

Classic two-stored-sets shape: explicit light values in `:root`, explicit dark values in `.dark`. Nothing derived at runtime. Dark is never its own System. The Studio may offer auto-dark *suggestions* later; the file format always stores both sets explicitly.

## 4. Fonts

Per [#8](https://github.com/AltManic/raya/issues/8). Bundled via Fontsource npm packages resolved by Vite at build time — nothing vendored, no CDN fetches. All faces SIL OFL.

### 4.1 Built-in roster

| Slot | Default | Alternate |
|---|---|---|
| `--font-sans` | Inter Variable (`@fontsource-variable/inter`) | Space Grotesk Variable (`@fontsource-variable/space-grotesk`) |
| `--font-serif` | Instrument Serif (`@fontsource/instrument-serif`; weight 400 + italic — display face) | — |
| `--font-mono` | JetBrains Mono Variable (`@fontsource-variable/jetbrains-mono`) | Geist Mono Variable (`@fontsource-variable/geist-mono`) |

The Baseline System pairs Inter / Instrument Serif / JetBrains Mono.

### 4.2 Bring-your-own

A System's font token values are plain CSS family lists and may name any family, bundled or not. When Export emits a System referencing non-bundled families it flags them and emits copy-paste self-host instructions (Fontsource install line, or woff2 + `@font-face`). No in-Studio font uploads in v1. Studio preview shows a fallback notice chip near the font tuner ("references non-bundled font · showing fallback") linking to those instructions.

### 4.3 Loading ownership

Consuming app's job, via the optional **`raya-fonts`** registry item (§7): one item wiring all five built-in families (`@fontsource` imports). Apps skipping it self-host per Export's instructions. Docs carry a credits section listing faces + licenses.

## 5. Component inventory & knobs

Per [#3](https://github.com/AltManic/raya/issues/3).

### 5.1 Admission rule

v1 primitives are Base UI-only — zero dependencies beyond `@base-ui/react`. Sole exception: **TanStack Table**, admitted for the BI Pack data table. Anything needing another npm dep (command palette, combobox, calendar/date-picker, toast, …) waits for v1.x.

### 5.2 Core primitives

button · input · textarea · select · checkbox · switch · radio group · slider · label/field · card · badge · avatar · tabs · dialog (+ alert-dialog rides along) · dropdown menu · popover · tooltip

Cut from v1 candidacy: command palette, combobox, calendar/date-picker, accordion, sheet/drawer, toast, skeleton, separator, progress, table-as-primitive (table is BI Pack territory).

### 5.3 BI Pack

data table (TanStack Table) · KPI card · chart wrappers ×5 (**line, area, bar, pie/donut, sparkline**) · filter bar. The filter bar is **the only block** (`registry:block`) in v1. Preview demo data: §9.4.

### 5.4 Knob policy

Closed schema, declared per component, versioned with the Registry — Systems may set only declared knobs. Every knob must have a live preview effect in the Studio or it doesn't become a knob. Universal axes: `variant`, `size`, `density` (applied only where a component declares them). The icon library is project-level export config, **never a knob** (§8).

### 5.5 Knob tables — core primitives

| Component | Knobs |
|---|---|
| button | `variant`: default · outline · ghost · destructive · link — `size`: sm · md · lg · icon |
| input / textarea | `size`: sm · md · lg |
| select | `variant`: outline · ghost — `size`: sm · md · lg |
| checkbox / switch / radio group / slider | `size`: sm · md · lg |
| label / field | `size`: sm · md · lg |
| card | `variant`: plain · outline · elevated — `density`: comfortable · compact |
| badge | `variant`: default · secondary · outline · destructive — `size`: sm · md |
| avatar | `shape`: circle · rounded · square — `size`: sm · md · lg |
| tabs | `variant`: underline · pills · enclosed — `size`: sm · md |
| dialog / alert-dialog | `size`: sm · md · lg (default max-width) |
| dropdown menu | `density`: comfortable · compact |
| popover | none in v1 |
| tooltip | `variant`: dark · inverted |

Button has no density (size covers padding). Avatar's `shape` is the flagship component-specific knob.

### 5.6 Knob tables — BI Pack

| Component | Knobs |
|---|---|
| data table | `density`: comfortable · compact — `zebra`: off · on |
| kpi card | `variant`: plain · outline · elevated — `density`: comfortable · compact |
| line / area / bar wrappers | `legend`: show · hide — `grid`: show · hide |
| pie/donut wrapper | `variant`: pie · donut |
| sparkline | none |
| filter bar (block) | `density`: comfortable · compact |

Chart knobs tune *defaults* only (a System can ship quiet dashboards: grid off, legend hidden); chart data stays runtime.

## 6. System model & export format

Per [#5](https://github.com/AltManic/raya/issues/5) — round-trip proven end-to-end (model → `/r/*.json` → static serve → `shadcn add` → scratch TanStack Start app renders correctly with live switching).

### 6.1 Artifacts

A System serializes to **one `registry:theme` item carrying two files**, plus a shared `core` item:

| Artifact | Consumer target | Contents |
|---|---|---|
| `<slug>.css` | `src/styles/raya/systems/<slug>.css` | All token vars scoped `[data-raya='<slug>']` (light) + `[data-raya='<slug>'].dark`; the **default System additionally fills `:root` / `.dark`**. Knob defaults compile into CSS vars (`--raya-button-*`, `--raya-card-*`, …) in the same scope. Zero runtime JS in consumers; System switching is pure CSS re-resolution. |
| `<slug>.json` | `src/raya/systems/<slug>.json` | Machine-readable config: `slug`, `name`, `description`, `fonts`, `radius`, `knobs`, pointer to its stylesheet |
| `core.css` (shared `core` item) | `src/styles/raya/core.css` | Tailwind v4 bridge: `@custom-variant dark`, `@theme inline` semantic→utility mapping, radius derivation — plus component classes consuming knob vars |

### 6.2 Cascade order (load-bearing)

Emit the default System's `:root`/`.dark` blocks **first**, then attribute-scoped blocks after — equal specificity, source order wins, so `[data-raya]` overrides `:root`; `.dark[data-raya]` (specificity 0,2,0) beats plain `.dark` (0,1,0).

### 6.3 Tailwind bridge gotcha (solved)

`@theme inline { --font-sans: var(--font-sans); }` — same-name mapping — is legal: inline mode substitutes without emitting a competing declaration. Verified in compiled production CSS: utilities track runtime vars (`.rounded-lg` → `var(--radius)`).

### 6.4 Import wiring

Manual by design (the CLI never edits styles.css). Each item's `docs` field carries the exact snippet and the CLI prints it post-install:

```css
@import "./raya/core.css";
@import "./raya/systems/baseline.css";
/* one more @import per installed non-default System */
```

## 7. Registry: schema, authoring, serving

Per [#2](https://github.com/AltManic/raya/issues/2) and the [#5 prototype](https://github.com/AltManic/raya/tree/prototype/export-roundtrip).

### 7.1 Format & URLs

Standard `registry-item.json` (`$schema: https://ui.shadcn.com/schema/registry-item.json`). Items served as `/r/<name>.json`; catalog at `/r/registry.json`; produced by `npx shadcn build` into `public/r/`. Consumers register:

```json
"registries": { "@raya": "https://raya.alfrizk.dev/r/{name}.json" }
```

Install: `npx shadcn add @raya/button`. Fixed URLs (no `{style}` segment) sidestep the known third-party-registry `{style}` rewrite bug (shadcn-ui/ui#10496).

Key fields: `name`, `type`, `title`, `description` (required in practice for blocks), `files[{path,type,target}]`, `registryDependencies`, `dependencies`, `docs`, `categories`, `meta` (free-form — used for System/knob metadata). File targets support alias placeholders (`@ui/…`). Item type `registry:theme` is schema-valid and CLI-proven for Systems.

### 7.2 Item inventory

| Item | Type | Deps carried | Notes |
|---|---|---|---|
| `core` | registry:theme | — | `core.css` bridge (§6.1); required by everything |
| `raya-fonts` | registry:theme | five Fontsource packages | optional font wiring (§4.3) |
| 16 ui primitives (§5.2, one item each) | registry:ui | `@base-ui/react` | |
| `data-table` | registry:ui | `@tanstack/react-table`, `@base-ui/react` | sole extra-dep exception |
| `kpi-card` | registry:ui | — | composes primitives |
| `chart-line` / `chart-area` / `chart-bar` / `chart-pie` / `chart-sparkline` | registry:ui | `recharts` | wrappers only |
| `filter-bar` | registry:block | composites above | only block in v1 |
| `<system-slug>` (e.g. `baseline`, `terminal`) | registry:theme | — | one per System (§6) |

### 7.3 Serving

`public/r/*.json` ships as Workers static assets — requests matching files never invoke the Worker (automatic JSON content-type, edge caching). Keep `/r/*` out of SSR server routes; leave `not_found_handling` default so missing items 404 properly for the CLI. Rebuild + redeploy whenever registry source changes.

## 8. Icons

Default library: **HugeIcons free set** — wired through the CLI's built-in `"iconLibrary": "hugeicons"` (installs `@hugeicons/react` + `@hugeicons/core-free-icons`). Free set = 6,000+ Stroke Rounded icons on public npm; public-repo-safe **via npm packages only**. Never commit extracted SVGs. Pro is forbidden (seats, private registry, traffic caps).

Authoring: published components use `<IconPlaceholder hugeicons=… lucide=… />` so each consumer's `iconLibrary` choice swaps imports at install time. No `icons` alias exists — imports resolve straight from the chosen package.

## 9. Studio: pages & UX

Per [#6](https://github.com/AltManic/raya/issues/6) — verdict: **Variant A "Rail & Gallery"**, with steals from B and C. Prototype reference: [prototypes/tuner-ux](https://github.com/AltManic/raya/tree/prototype/tuner-ux).

### 9.1 Layout

- **Header:** System switcher as visual chips · light/dark toggle · Export button.
- **Left control rail** (persistent, scrolling): token groups in order — primitive ramp sliders (12 `--raya-<hue>` steps per hue) → semantic override swatches → radius → shadows → type (roster selects + BYO entry, §4.2 notice chip here) → component-knobs accordion mirroring the §5 tables verbatim.
- **Right canvas:** Gallery ↔ Focus toggle. Gallery = component tiles, all live under `[data-raya]` + `.dark`. Focus = single component with inline knob controls above the instance (B's steal).
- **Export:** slide-over with per-file tabs (`<slug>.css` / `<slug>.json`) and copy buttons. Modal/wizard rejected.

Rationale to preserve: knobs are **System defaults recorded once**, not per-instance props — persistent always-visible controls beat direct manipulation for watch-everything-update work.

### 9.2 Token-edit mechanism

Edits apply as **inline overrides** so they outrank every System scope and survive System/mode switches live (prototype-proven mechanism — carry into implementation). Saving folds overrides into the System's stored light+dark sets.

### 9.3 Systems management

Create from current values, duplicate, rename, delete. Slug is immutable after creation (it names the stylesheet, the `data-raya` value, and the registry item). Baseline is the default System. Launch ships Baseline + Terminal demo Systems — concrete values liftable from `prototypes/export-roundtrip/studio-model/src/systems.ts` on the prototype branch.

### 9.4 Demo data for BI Pack previews

Per [#9](https://github.com/AltManic/raya/issues/9).

- **Hand-authored fixtures** — typed TS constants checked into the repo at `src/lib/demo-data/`. No generator in v1: believability beats variety, and the needed volume is small.
- **One coherent narrative** — fictional dev-tool SaaS analytics ("Signalpath Analytics" placeholder brand; invented companies and people only). USD / en-US. Mapping: line = MRR trend · area = traffic · bar = signups by channel · pie/donut = plan mix · sparklines ride inside KPI cards · data table = customers/subscriptions · filter bar = search + plan/status filters + reset.
- **Studio-only** — fixtures never ship through the Registry. Sole exception honoring shadcn block convention: `filter-bar` ships one tiny self-contained `demo-filter-bar.tsx` with throwaway-looking data; ui items carry docs snippets only, no data files.
- **Live behavior** — previews render the real registry components: the table sorts and paginates client-side; in Focus the filter bar filters the table through shared client state. No fake async/loading/empty/error states in v1 (happy path only).
- **Deterministic** — module constants, zero randomness; identical data across Systems, light/dark, and reloads. Only styles ever change.
- **Volumes** — table ≈45 rows × 6 cols (15/page) · line/area 24 monthly points × 2–3 series · bar 8 channels · pie 4 slices · sparkline ≈30 points per KPI card · 4 KPI cards.

## 10. Consumer experience

```sh
npx shadcn init                      # Base UI preset (--defaults ⇒ base-nova)
# add to components.json:
#   "registries": { "@raya": "https://raya.alfrizk.dev/r/{name}.json" }
npx shadcn add @raya/core @raya/raya-fonts @raya/baseline @raya/button @raya/data-table
# paste the printed @import snippet into styles.css (§6.4)
```

Render: set `data-raya="<slug>"` on `<html>` (or any wrapper) and toggle `.dark` per the standard convention. Switching Systems = swapping the attribute; no JS involved.

## 11. Deployment plan (Cloudflare Workers → raya.alfrizk.dev)

Execution happens in build sessions past this map's edge; this section is the plan they follow (facts per [#2](https://github.com/AltManic/raya/issues/2) §4).

1. Add `@cloudflare/vite-plugin` + `wrangler`; plugin order: `cloudflare({ viteEnvironment: { name: 'ssr' } })` → `tanstackStart()` → `viteReact()`.
2. `wrangler.jsonc`: `"main": "@tanstack/react-start/server-entry"` (+ name, compatibility_date). Wrangler picks up the client build output as the static-assets directory automatically.
3. Build order: `npm run build` (Studio) → `npx shadcn build` (writes `public/r/`) → Vite copies `public/` verbatim → `wrangler deploy`.
4. Registry JSON bakes file paths at build time — **rebuild + redeploy whenever registry source changes**.
5. Bind custom domain raya.alfrizk.dev (zone alfrizk.dev) to the Worker. DNS/registrar steps are human execution.
6. No secrets required in v1 (no server-side API keys).
7. Optional `_headers` file if JSON cache tuning beyond defaults is needed.

## 12. Out of scope

Carried from the map; do not build, do not relitigate:

- Migrating existing apps onto Raya (satu-sekolah, ta-dashboard, …)
- React Native / Expo support
- Publishing the Registry for third-party consumption (personal use only)
- **Update/sync story for components already copied into consuming apps** — v1 leans on `shadcn add --overwrite` re-install; lifecycle design sits past the destination
- CI provider selection / pipeline automation — deployment execution past the edge (§11 is the complete plan this effort owes)
- In-Studio font uploads; HugeIcons Pro; vendoring any icon/font source files

## 13. Registry guardrails (testing strategy)

Per [#10](https://github.com/AltManic/raya/issues/10). Everything runs locally — CI automation stays out of scope (§12); hooks are advisory local gates (`--no-verify` exists, solo-dev posture accepted).

### 13.1 Check tiers

Cheapest first; each tier assumes the previous passed.

1. **Typecheck** — `tsc --noEmit` across the Studio app and `registry/` sources.
2. **Validate + build** — `npx shadcn registry validate` (item schema errors, duplicate names, missing item files — all reported in one run, no build required) then `npx shadcn build`, regenerating `public/r/`.
3. **Freshness** — `git diff --exit-code -- public/r`: regenerated output must match the committed state. Depends on `public/r/` being committed (§2), so drift fails as a dirty tree.
4. **Consumer round-trip** — the fixture app below must typecheck and build against a fresh install of every item.

### 13.2 Fixture app (tier 4)

Permanent dev-tooling harness at `tools/roundtrip-fixture/` — minimal Vite + React 19 + Tailwind v4 shell with its own `components.json` registering the local registry. Never deployed; `node_modules` persists locally (gitignored) so repeat installs are incremental. Check flow: regenerate `/r/*.json` → `shadcn add @raya/* --overwrite` for **all** items (`core`, `raya-fonts`, 16 primitives, BI Pack, `filter-bar`, one System theme) → an inventory page renders every item under both demo Systems (Baseline + Terminal) → `tsc --noEmit` + `vite build` must pass. Mechanism proven by the [#5 prototype](https://github.com/AltManic/raya/tree/prototype/export-roundtrip).

### 13.3 Gate placement

- **pre-commit** (husky): tiers 1–3 — seconds-fast, stops a bad commit before it lands.
- **pre-push** (husky): tier 4 — cached round-trip; minutes cold, well under a minute warm.

### 13.4 Explicitly none in v1

No automated runtime/component tests (vitest, Playwright). Compile + round-trip is the contract; manual Studio browsing is the smoke test. Revisit if a regression ever bites.
