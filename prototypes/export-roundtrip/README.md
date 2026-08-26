# PROTOTYPE — System export/import round-trip (#5)

Throwaway code answering one question:

> What does a System serialize to, concretely? Can a System exported from the
> Studio model survive: registry JSON → static `/r/*.json` serving → shadcn CLI
> install into a scratch TanStack Start app → correct render with `data-raya`
> switching and `.dark`?

## Verdict

**Yes — round-trip works end-to-end.** Export shape candidate that survived:

Per System, one registry item (`type: "registry:theme"`) carrying two files:

| Artifact | Target in consuming app | Contents |
|---|---|---|
| `<slug>.css` | `src/styles/raya/systems/<slug>.css` | All token vars scoped `[data-raya='<slug>']` (light) + `[data-raya='<slug>'].dark`; the default System additionally fills `:root` / `.dark`. Includes knob-derived vars (`--raya-button-*`, `--raya-card-*`, …) |
| `<slug>.json` | `src/raya/systems/<slug>.json` | Machine-readable config: slug, name, fonts, radius, knobs, pointer to stylesheet |

Plus one shared item `core` carrying `core.css`: the Tailwind v4 bridge
(`@custom-variant dark`, `@theme inline` mapping semantic names → utilities,
radius derivation) and component classes consuming knob vars.

### Findings

1. **Scoping works.** Emit default System first (`:root`, `.dark`), then each
   non-default System under its attribute scope. Equal-specificity source order
   makes `[data-raya]` override `:root`; `.dark[data-raya]` (0,2,0) beats
   `.dark` (0,1,0). Verified in compiled CSS: both Systems' scopes present,
   values differ correctly (radius `.625rem` vs `0rem`, card padding, avatar
   shape, button variant colors), dark differs from light within each scope.
2. **Knobs compile to CSS vars.** No runtime JS needed in the consumer;
   component classes read `var(--raya-…)` with fallbacks. Switching Systems is
   pure CSS re-resolution — instant, no hydration coupling.
3. **Tailwind v4 bridge gotcha solved.** `@theme inline { --font-sans:
   var(--font-sans); }` (same name!) is legal — inline mode substitutes without
   emitting a competing declaration. Utilities emit
   `font-family:var(--font-sans)` / `border-radius:var(--radius)` and track the
   active System at runtime. Verified: `.rounded-lg` → `var(--radius)`.
4. **CLI mechanics.** Custom registry via components.json
   `"registries": {"@raya": "http://localhost:4173/r/{name}.json"}`;
   `npx shadcn add @raya/core @raya/baseline @raya/terminal` installs files by
   inline `content` + absolute-relative `target`. Item type `registry:theme` is
   schema-valid and passes CLI validation. `docs` field is printed after install
   — good place for the "add these imports" instructions.
5. **Import wiring is manual** (expected): the CLI copies files but never edits
   styles.css. Consumer adds three `@import` lines. A future improvement path:
   a `registry:style`-style meta-item or docs-driven snippet; acceptable for v1.

## Layout

```
studio-model/          ← the liftable part: Studio-side model + exporter
  src/model.ts         ← System/Knob types (#3, #4 rulings)
  src/knob-vars.ts     ← knob-value → CSS-var compilation tables
  src/export.ts        ← stylesheet emitter + config emitter
  src/systems.ts       ← two demo Systems (Baseline, Terminal)
  src/generate.ts      ← writes ../registry/public/r/*.json
registry/public/r/     ← generated local registry (serve statically)
scratch-app/           ← throwaway TanStack Start consumer (nitro + tailwind v4)
```

## Run it

```sh
# 1. regenerate registry from the model
cd studio-model && npm i && npm run generate

# 2. serve the registry
cd ../registry/public && python3 -m http.server 4173

# 3. install into the scratch app (already installed; --overwrite refreshes)
cd ../../scratch-app && npx shadcn@latest add @raya/core @raya/baseline @raya/terminal

# 4. run
npm run dev
```

Open http://localhost:3001 — toggle `data-raya` (baseline / terminal / none)
and `.dark`; everything re-skins live.

## What this does NOT cover

- Real Base UI components / HugeIcons (question here was serialization, not
  component distribution — #2 already settled those facts)
- Multiple co-installed Systems' cascade beyond two (mechanism identical)
- Studio-side tuner UX (#6)
