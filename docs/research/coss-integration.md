# coss ui integration audit — dependencies, registry shape, stack compatibility

Research for wayfinder ticket [#24](https://github.com/AltManic/raya/issues/24), under map
[#21](https://github.com/AltManic/raya/issues/21). This is an audit, not a port: it is the
fact base the component-port prototype and the System-model decision will lean on.

**Pinned sources**

- coss: `e937becd2d5ffb5c621eed6f8b1f223cbb6051e7` (2026-09-08, `feat: migrate TanStack Table to v9 (#848)`).
  Citations below use `coss:<path>` and all resolve at that commit (read via the shared blobless
  clone, `git -C <clone> show HEAD:<path>`). `packages/ui` and `apps/www` are **out of bounds**
  (AGPLv3 per `coss:LICENSING.md`); the MIT surface is `apps/ui` (and `apps/origin`), per
  `coss:apps/ui/package.json` (`"license": "MIT"`) and `coss:LICENSING.md`.
- raya: `origin/main` at `bcaf0f71cdb5b8f60dfe45af4ec0b7655f51d485` (2026-09-12). Citations use
  `raya:<path>`.
- Installed CLI: `raya:node_modules/shadcn@4.19.0` (raya's `package.json` pins `shadcn: ^4.19.0`).
- Base UI: published release notes for `v1.8.0` / `v1.7.0` (github.com/mui/base-ui/releases);
  npm tarballs `@base-ui/react@1.7.0` (raya's installed copy) and `@1.8.0` (fetched for this audit).

---

## TL;DR

1. **The 54-component suite is self-contained and mechanically portable.** Every
   `apps/ui/registry/default/ui/*.tsx` imports only React, `@base-ui/react/*`,
   `class-variance-authority` (10 files), `lucide-react` (17 files), `@daypicker/react`
   (calendar only), and `cn` from the local lib. No `next/*`, no `date-fns`, no
   `@remixicon/react`, no `@coss/ui` package imports inside the suite. The only cross-module
   imports are registry-internal (`@/registry/default/ui|lib|hooks/*`).
2. **Base UI 1.8 is a hard requirement, not a convenience bump.** `combobox.tsx` exports
   `createComboboxItems = ComboboxPrimitive.createItems`; `createItems` does not exist in
   `@base-ui/react@1.7.0` (raya's installed version) and was added in 1.8.0. There are no
   breaking changes listed in the 1.8.0 release notes; the rest of the delta is bug-fix
   behaviour across Dialog/Drawer/Field/Combobox/Select/Toast/etc.
3. **Registry items port cleanly in shape**, but the graph must be re-tagged: coss's
   `@coss/*` `registryDependencies` must become `@raya/*`, and three shared items must exist
   (`utils`, `segmented-control`, `use-media-query`). coss's custom TS→JSON build
   (`scripts/build-registry.mts`) and `validate-registry-deps` script are not needed; raya's
   `shadcn build` + `shadcn registry validate` cover the same ground.
4. **Dependencies coss pushes through its `style` item must be hoisted in raya.**
   coss's per-component `dependencies` list only external packages (`@base-ui/react`,
   `lucide-react`, `@daypicker/react`); `class-variance-authority`, `clsx`, and `tailwind-merge`
   arrive via the `style`/`utils` items. Raya's `core` (theme) item should carry them, or the
   roundtrip fixture will fail typecheck because no dep is installed.
5. **The theme bridge is the biggest real work item.** coss's `@theme inline` bridge exposes
   31 custom properties that raya's `core.css` does not (`--color-sidebar-*`, `--color-chart-*`,
   `--color-info/success/warning*`, `--color-code*`, `--animate-*`, `--breakpoint-3xl/4xl`,
   `--font-heading`), plus keyframes, `--tw-shadow-color`, `@utility container`, and
   `@custom-variant fixed`. Item-level `cssVars` cannot carry raya's theme because the fixture
   overwrites `src/styles.css` after `shadcn add`; values need to live in the `core` file item.
6. **Icons: 17 files / 19 lucide exports must be converted to raya's `IconPlaceholder`** so the
   shadcn CLI swaps in HugeIcons at install time; shadcn does **not** rewrite direct
   `lucide-react` imports. `date-fns` and `@remixicon/react` appear only in particles/docs,
   outside the 54 — no need to adopt them for the component suite.
7. **Docs chrome is a rewrite, not a copy.** `apps/ui/app/layout.tsx` and several
   `apps/ui/components/*` pull `next/*`, `next-themes`, `jotai`, `fumadocs-*`, and
   `@coss/ui/shared/*` (AGPL surface). Fumadocs does support TanStack Start, so the docs stack
   is viable, but the AGPL imports must be re-implemented from the MIT surface.

---

## 1. Component inventory and dependency matrix

`coss:apps/ui/registry/default/ui/` contains exactly 54 `.tsx` files. `apps/ui/registry.json`
holds 56 `registry:ui` items: those 54 plus an aggregate `ui` item (whose
`registryDependencies` lists all 54) and a `fonts` item. The separate 508-item particle
surface is out of scope.

Totals across the 54:

| Axis | Count | Detail |
| --- | --- | --- |
| LOC | 7,554 | `wc -l apps/ui/registry/default/ui/*.tsx` |
| `"use client"` | 47 | absent in `alert`, `empty`, `frame`, `kbd`, `separator`, `skeleton`, `spinner` |
| `class-variance-authority` | 10 | `alert`, `badge`, `button`, `empty`, `group`, `input-group`, `select`, `sidebar`, `toggle`, `toggle-group` |
| `lucide-react` | 17 files / 19 exports | see §1.2 |
| `@daypicker/react` | 1 | `calendar.tsx` |
| `@base-ui/react` | 48 of 54 | 6 files are pure Tailwind+React: `alert`, `empty`, `frame`, `kbd`, `skeleton`, `spinner` |
| `date-fns` | 0 | only in particles (`coss:apps/ui/registry/default/particles/p-calendar-*.tsx`) |
| `@remixicon/react` | 0 | only in `apps/ui/app/not-found.tsx` + particles |
| `@hugeicons/*` | 0 | only in docs chrome (`apps/ui/components/*`), never in the 54 |
| `@tanstack/react-table` | 0 | coss's `table.tsx` is Base UI's table, not TanStack Table |

### 1.1 `cn` and styling deps

`coss:apps/ui/registry/default/lib/utils.ts` is the canonical utility:

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- 53 of 54 components import `cn` from `@/registry/default/lib/utils`; `form.tsx` uses no `cn`.
- `group.tsx` is the one inconsistency: it imports `cn` from `@/lib/utils` (`coss:apps/ui/registry/default/ui/group.tsx:5`).
  In raya's repo, `@/*` maps to `./src/*` (`raya:tsconfig.json`), where `src/lib/utils.ts` does
  not exist — the port must either add `src/lib/utils.ts` or normalise the import. For
  consumers the shadcn CLI rewrites `@/lib/utils` to the consumer's `aliases.utils` anyway
  (`raya:node_modules/shadcn/dist/chunk-CDOZT3OO.js`, `Bc()`), so this is an in-repo-only fix.
- No component imports `clsx` or `tailwind-merge` directly.

### 1.2 Icons to swap (lucide → raya's IconPlaceholder/HugeIcons)

Raya already ships `registry/internal/icon-placeholder.tsx` (MIT, authored in raya) whose
component is replaced by the shadcn CLI at install time using the consumer's `iconLibrary`
(`raya:registry/internal/icon-placeholder.tsx`; fixture proof: `raya:tools/roundtrip-fixture/src/components/ui/dialog.tsx`
now imports `HugeiconsIcon` + `Cancel01Icon`). The port needs one `hugeicons="..."` mapping per
lucide export below (candidates in parentheses; verify against `@hugeicons/core-free-icons`):

| lucide export | used by |
| --- | --- |
| `ChevronDownIcon` | accordion, select |
| `ChevronUpIcon` | select |
| `ChevronLeftIcon` / `ChevronRightIcon` | calendar, pagination |
| `ChevronRight` / `MoreHorizontal` | breadcrumb |
| `MoreHorizontalIcon` | pagination |
| `ChevronsUpDownIcon` | autocomplete, calendar, combobox, select |
| `XIcon` | autocomplete, combobox, dialog, drawer, sheet |
| `SearchIcon` | command |
| `MinusIcon` / `PlusIcon` | number-field |
| `PanelLeftIcon` | sidebar |
| `Loader2Icon` | spinner |
| `CircleAlertIcon`, `CircleCheckIcon`, `InfoIcon`, `LoaderCircleIcon`, `TriangleAlertIcon` | toast (`TOAST_ICONS` map) |

`button.tsx` and friends style icons via `[&_svg:...]` selectors and assume no `size` prop, so
`HugeiconsIcon` wrappers need the same treatment raya already uses for dialog/checkbox/select.

### 1.3 Cross-file registry graph

The 54 files reference these registry-internal modules; a port that flattens them will not
compile (all are `@coss/*` `registryDependencies` in `coss:apps/ui/registry.json`):

- `lib/utils.ts` — required by 53 components + `segmented-control`.
- `lib/segmented-control.ts` — required by `tabs.tsx` only; imports `cva`.
- `hooks/use-media-query.ts` — required by `sidebar.tsx` only; `"use client"`,
  `useSyncExternalStore` with `getServerSnapshot → false`.
- Component→component: `autocomplete → input, scroll-area`; `button → spinner`;
  `combobox → input, scroll-area`; `command → autocomplete`; `dialog → button, scroll-area`;
  `drawer → button, scroll-area` (+ Base UI checkbox/radio inline); `group → separator`;
  `input-group → input, textarea`; `number-field → label`; `otp-field → separator`;
  `pagination → button`; `sheet → button, scroll-area`; `sidebar → button, input, scroll-area,
  separator, sheet, skeleton, tooltip, use-media-query, utils`; `toast → button`;
  `toggle-group → separator, toggle`.

`apps/ui/registry.json` items involved in these edges also carry
`cssVars` (9 items: alert, badge, button, context-menu, field, menu, otp-field, skeleton, toast).
The `theme`-key ones (`otp-field`, `skeleton`, `toast`) only define `--animate-*`; the keyframes
themselves live in the theme CSS (`coss:packages/ui/src/styles/globals.css`) — see §4.

`calendar.tsx` depends on `@daypicker/react@10.0.1`, which is a thin alias package whose only
dependency is `react-day-picker@10.0.1` (npm metadata for `@daypicker/react@10.0.1`; repo
`github.com/gpbl/react-day-picker`, homepage `daypicker.dev`). coss pins it exactly (`10.0.1`) in
`coss:apps/ui/package.json`.

---

## 2. Registry item shape vs raya's

### 2.1 coss's pipeline

- Source of truth is TypeScript, not JSON: `coss:apps/ui/registry/index.ts` spreads
  `registry-ui.ts`, `registry-particles.ts`, `registry-styles.ts`, `registry-fonts.ts`,
  `registry-lib.ts`, `registry-base-ui.ts`, `registry-hooks.ts`, typed as
  `satisfies Registry` from `shadcn/schema`.
- `coss:apps/ui/scripts/build-registry.mts` regenerates `registry.json`, copies it to
  `public/r/registry.json`, generates a docs `registry/__index__.tsx`, and shells out to
  `bunx --bun shadcn build registry.json --output public/r`.
- `coss:apps/ui/scripts/validate-registry-deps.mts` is a bespoke ts-morph parser that compares
  each item's declared `dependencies`/`registryDependencies` against the imports in its source
  files. Raya has no equivalent; with 54 hand-ported items, drift is likely (see §8).

### 2.2 Shape comparison

| Field | coss | raya (`raya:registry.json`) | Conversion |
| --- | --- | --- | --- |
| `name`, `type` | same vocabulary (`registry:ui`, `registry:hook`, `registry:lib`, `registry:style`, `registry:file`, `registry:theme`, `registry:font`) | same | none |
| `files[].type` | `registry:ui` etc. | same | none |
| `files[].target` | absent for `ui`/`hook`/`lib` (CLI derives from aliases) | explicit targets only for `registry:file` theme/font files | none |
| `dependencies` | package names, no versions; omits cva/clsx/tailwind-merge for per-component items | same convention | hoist common deps into a shared item |
| `registryDependencies` | `@coss/<name>`, plus bare `utils` in the `style` item | `@raya/<name>` (`kpi-card` → `@raya/chart-sparkline`; `filter-bar` → `@raya/button` …) | rewrite every `@coss/*` → `@raya/*` |
| `cssVars` | `light`/`dark`/`theme` used on 9 UI items + the `style` item | unused (0 items) | decide: item cssVars vs core file (see §4.4) |
| `title`/`description`/`docs` | not used (0 `docs` fields across 577 items) | used on every item; `docs` on all 30 | port adds them |
| `meta` | 246 particles/docs items, but no UI components | `meta.raya` on `core`/systems | raya-side choice |
| Aggregate item | `ui` item listing all 54; `style` item with `css`+`cssVars`; `fonts` item | none (each item installed individually) | optional convenience |
| `$schema` | only in built `public/r/*` output | root `registry.json` declares it | none |

The built artifacts are equivalent: `shadcn build` inlines each file's `content` and stamps
`$schema: "https://ui.shadcn.com/schema/registry-item.json"` in both repos
(`coss:apps/ui/public/r/button.json`; `raya:public/r/button.json`).

### 2.3 Namespace and dependency rewriting

The shadcn CLI resolves `@ns/item` against `registries` in the consumer's config, and bare names
against the official shadcn registry (`raya:node_modules/shadcn/dist/index.js`, `ge()`/`mt()`;
unknown namespaces raise `RegistryNotConfiguredError`: "Unknown registry … defined under
\"registries\" in your components.json"). Consequences:

- Any ported item that keeps `@coss/...` will break `npx shadcn add @raya/<item>` unless
  consumers configure coss's registry too. Rewrite to `@raya/...` (raya already uses that form).
- The `style` item's bare `utils` dependency would resolve to the *shadcn* `utils` item, not
  coss's. Raya's equivalent must say `@raya/utils`.
- `lucide-react` must be dropped from `dependencies` once icons are converted to
  `IconPlaceholder`; `@hugeicons/react` + `@hugeicons/core-free-icons` must be declared on
  icon-using items (today `raya:tools/roundtrip-fixture/check.sh` patches the fixture by hand).
- `class-variance-authority`, `clsx`, `tailwind-merge` belong on raya's `core` item (coss ships
  them in `style`/`utils`: `coss:apps/ui/registry/registry-styles.ts`).

### 2.4 Import rewriting inside installed files

The CLI rewrites registry aliases at `add` time (`raya:node_modules/shadcn/dist/chunk-CDOZT3OO.js`,
`Bc()`):

| Source import | Consumer result (raya aliases / fixture aliases) |
| --- | --- |
| `@/registry/<x>/ui/<name>` | `@/ui/<name>` (raya) / `@/components/ui/<name>` (fixture) |
| `@/registry/<x>/lib/utils` | `@/lib/utils` |
| `@/registry/<x>/lib/<name>` | `@/lib/<name>` |
| `@/registry/<x>/hooks/<name>` | `@/hooks/<name>` |
| `@/registry/<x>/components/<name>` | `<components alias>/<name>` |
| anything else `@/...` | `@/` replaced by the first segment of the components alias |

So coss's `@/registry/default/ui/scroll-area` etc. install fine under raya's aliases, and
raya's in-repo Studio can keep importing the same source paths because `raya:tsconfig.json`
maps `@/registry/*` → `./registry/*` (used today by `raya:src/components/studio/canvas.tsx`).

### 2.5 `shadcn build` / `registry validate` / the roundtrip fixture

What `shadcn registry validate` (raya's pre-commit) actually checks
(`raya:node_modules/shadcn/dist/index.js`, `Li()`/`Di()`/`_i()`/`vi()`/`Rl()`/`Sl()`):

- root file must be named `registry.json`, inside the cwd (or supported via `include`);
- root `name` and `homepage` required;
- each item validated against the registry-item schema (Zod), duplicate item names rejected;
- every `files[].path` must exist and be readable relative to the declaring registry file;
- a built item is re-validated against the item schema (the `$schema`-stamped form).

It does **not** verify that `registryDependencies` namespaces resolve; that failure surfaces only
when `shadcn add` runs (unknown registry error above). The roundtrip fixture is what catches it:

- `raya:tools/roundtrip-fixture/check.sh` runs `npx shadcn build`, serves `public/` on
  127.0.0.1, then loops **every item** in `public/r/registry.json` through
  `npx shadcn add "@raya/$item" --overwrite --yes`, patches in HugeIcons deps, rewrites
  `src/styles.css`, and runs `npx tsc --noEmit && npx vite build`.
- After install it **overwrites `src/styles.css`** with imports of the installed core/system
  files. Any `cssVars` the CLI injected during `add` are therefore discarded in the fixture —
  theme values must live in file items (`core.css`) for the fixture to exercise them.
- The fixture's `components.json` only configures the `@raya` registry
  (`raya:tools/roundtrip-fixture/components.json`), so `@coss/*` deps cannot resolve there.
- Two hygiene gaps to fix at port time: fixture `package.json` has no `cva`/`clsx`/`tailwind-merge`
  (must come from item `dependencies`), and the fixture lockfile pins `@base-ui/react@1.7.0`
  (`raya:tools/roundtrip-fixture/package-lock.json:44`), which must be refreshed to 1.8.
- Verified for this audit: a clean copy of the fixture builds under Vite 8.2.2 without extra
  config, `@/` aliases resolve, and a module with a top-level `"use client"` builds with no
  warning or error (rolldown 1.2.5). The fixture's own `vite.config.ts` has no
  `resolve.tsconfigPaths`, unlike raya's root config; in practice aliases work.

---

## 3. Theme / Tailwind bridge

### 3.1 What coss ships

`coss:packages/ui/src/styles/globals.css` (imported by the app via
`coss:apps/ui/app/globals.css` → `@import "@coss/ui/globals.css"`) is the whole design system:

1. `@import "tailwindcss"` + `@source "../../../apps/**/*.{ts,tsx}"` + `@source "../**/*.{ts,tsx}"`.
2. `@custom-variant dark (&:is(.dark *))` and `@custom-variant fixed (&:is(.layout-fixed *))`.
3. `@theme inline` mapping 56 names: color tokens (`background` … `sidebar-*`, `chart-1..5`,
   `info/success/warning*`, `code*`), radii, fonts, `--breakpoint-3xl: 1600px`,
   `--breakpoint-4xl: 2000px`, six `--animate-*` entries, the matching `@keyframes`, and
   `--tw-shadow-color: #000` (coss overrides Tailwind's default shadow color to pure black).
4. `:root` / `.dark` values against Tailwind's built-in neutral/red/etc. palette (42 custom
   properties in `:root`).
5. `@layer base` body defaults (`bg-background text-foreground`, mono for code/kbd/samp/pre).
6. `@utility container` (max-w 1416px, `lg:px-6`) and docs-only `@layer components` rules for
   rehype-pretty-code output (the `[data-rehype-pretty-code-figure]`/`.highlighted-word` blocks,
   plus a `[data-lib=radix-ui]`/`[data-lib=base-ui]` migration highlight) — not needed by the
   component suite.

### 3.2 What raya has

`raya:registry/default/styles/core.css` (installed to `src/styles/raya/core.css`) has the same
`@custom-variant dark` convention and a 26-name `@theme inline` bridge (basic semantic colors,
radius derivation, `--font-sans/serif/mono`) plus `.raya-*` component classes for the current
component set. `raya:src/styles.css` imports `tailwindcss` → `core.css` → System stylesheets.

### 3.3 Bridge gap (exact)

Diffing the two `@theme inline` blocks: coss declares **31 properties raya's core.css does not** —

- `--color-sidebar`, `--color-sidebar-{foreground,primary,primary-foreground,accent,accent-foreground,border,ring}` (8)
- `--color-chart-1..5` (5)
- `--color-info`, `--color-info-foreground`, `--color-success`, `--color-success-foreground`, `--color-warning`, `--color-warning-foreground` (6)
- `--color-code`, `--color-code-foreground`, `--color-code-highlight` (3)
- `--animate-skeleton`, `--animate-caret-blink`, `--animate-toast-success-{odd,even}`, `--animate-toast-error-{odd,even}` (6)
- `--breakpoint-3xl`, `--breakpoint-4xl` (2)
- `--font-heading` (1; coss maps it to `--font-sans`)

and raya declares one coss doesn't: `--font-serif`.

Class-level impact from the 54: `text-sidebar-accent-foreground` (16 occurrences),
`bg-sidebar-accent` (11), `text-sidebar-foreground` (8), `ring-sidebar-ring` (5), `bg-sidebar` (5),
`bg-sidebar-border`/`border-sidebar-border` (2+2), plus info/success/warning color, text, and
border utilities (~19 occurrences total). Without the extra bridge names, these utilities do not
exist; `--chart-*` and `--code*` are needed for the docs chrome and charts rather than the 54
(matchData: `registry/default/systems/baseline.css` already defines the *values* `--chart-*` and
`--sidebar*`, but the bridge names are missing, so Tailwind never emits the classes).

Also missing from raya's core: the six `@keyframes`, `--tw-shadow-color: #000`, `@utility container`,
and `@custom-variant fixed`. The keyframes are load-bearing: `skeleton`, `otp-field`, and `toast`
reference `animate-skeleton` / `caret-blink` / `animate-toast-*`; `--animate-*` names alone are
useless without the keyframes, and the items' `cssVars.theme` entries only carry the former.

`@custom-variant fixed` is not referenced by the 54 (only the docs shell/particles use the
`.layout-fixed` pattern), so it can ride with the docs-shell work.

### 3.4 Where the bridge lives for consumers

Raya's model is file-based: the `core` item is `registry:theme` with
`files[].target: src/styles/raya/core.css`, imported by the consumer after Tailwind
(`raya:registry.json`, `docs` field of `core`). coss's model is CLI-injected: the `style` item
carries `css` + `cssVars` that `shadcn add` merges into the consumer's Tailwind CSS. Both pass
`shadcn build`; raya's is testable by the fixture and doesn't depend on the consumer's CSS file
shape. **Recommendation implied by the audit:** bake coss's theme into raya's `core` file item
(values + bridge + keyframes), keep `cssVars` off items (or only for genuinely per-item
animations if the fixture is taught to preserve them).

---

## 4. Next.js-isms and their TanStack Start / Vite equivalents

### 4.1 Registry components: none

The 54 have no `next/*` imports; the only Next-specific marker is the `"use client"` directive
(47/54). coss's own contributor guidance (`coss:apps/ui/AGENTS.md` §13) tells authors to keep
particles framework-agnostic and avoid `next/link`/`next/image`. `"use client"` is a no-op
outside React Server Components; TanStack Start does not use RSC, so ported files can keep it
(verified harmless in a Vite 8 build) or drop it when touching files.

### 4.2 Docs chrome inventory (`apps/ui/components/*`, `app/layout.tsx`)

| File (LOC) | Next/other coupling | Notes |
| --- | --- | --- |
| `category-thumbnails.tsx` (1078) | `@coss/ui/lib/utils` (AGPL), lucide | huge — mostly static markup |
| `mdx-components.tsx` (380) | `next/image`, `next/link`, fumadocs `mdxComponents`; `@coss/ui/shared/{copy-button,icons}` (AGPL) | rewrite links/images + shared bits |
| `command-menu.tsx` (243) | `next/link`, jotai `useConfig`, `@coss/ui/components/command` (AGPL), HugeIcons | |
| `media-query-demo.tsx` (152) | registry `use-media-query` + badge | reusable as-is |
| `mobile-nav.tsx` (137) | `next/link`, `next/navigation`, HugeIcons | |
| `code-block-command.tsx` (127) | jotai, `@coss/ui/hooks/use-copy-to-clipboard` (AGPL), HugeIcons | copy-to-clipboard hook exists in coss registry (`registry/default/hooks/`) |
| `docs-toc.tsx` (90) | react only | reusable |
| `docs-sidebar.tsx` (68) | `next/link`, `next/navigation`, fumadocs source | |
| `component-preview-tabs.tsx` (68) | react + registry tabs | reusable |
| `component-source.tsx` (58) | `node:fs/promises`, `@coss/ui/shared/code-block` (AGPL) | server-side file reads |
| `copy-registry.tsx` (55) | `@coss/ui/shared/icons` (AGPL), HugeIcons | |
| `app/layout.tsx` (51) | `@coss/ui/fonts` (`next/font/local`), `@coss/ui/shared/theme-provider` (`next-themes`), registry toast providers | root shell |
| `code-collapsible-wrapper.tsx` (49) | react + registry button/collapsible/separator | reusable |
| `component-preview.tsx` (46) | `registry/__index__` generated index | needs generated component index |
| `main-nav.tsx` (36) | `next/link`, `next/navigation` | |
| `site-header.tsx` (30) | `@coss/ui/shared/site-header` + separator (AGPL) | |
| `site-footer.tsx` (29) | `next/link` | |
| `code-tabs.tsx` (25) | jotai, registry tabs | |
| `docs-copy-page.tsx` (21) | `@coss/ui/hooks/use-copy-to-clipboard` (AGPL) | |

Supporting pieces: `source.config.ts` (fumadocs-mdx + rehype-pretty-code + shiki + zod),
`app/docs/[[...slug]]/page.tsx` (fumadocs `loader`/`source`, `generateStaticParams`,
`generateMetadata`, `force-static`), `app/api/raw/[...slug]/route.ts`
(`NextRequest`/`NextResponse` file server), `app/particles/*` (search with
`useRouter`/`usePathname`/`useSearchParams`), `next.config.ts` (`basePath: /ui`, rewrites,
`transpilePackages: ["@coss/ui"]`, MDX plugin), `lib/source.ts` (`fumadocs-core/source` +
`@/.source/server`), `lib/registry.ts` (ts-morph file processing), `hooks/use-config.ts`
(jotai `atomWithStorage`), `hooks/use-is-mac.ts` (`navigator.platform`), content
`content/docs/**` (64 `.mdx` files, explicitly out of scope for raya).

### 4.3 Rewrite map

| coss | TanStack Start / Vite equivalent |
| --- | --- |
| `next/link` | `Link` from `@tanstack/react-router` (raya already uses it) |
| `next/navigation` (`usePathname`, `useRouter`, `useSearchParams`, `notFound`) | router hooks + `notFound()` from `@tanstack/react-router`; route `validateSearch`/search params |
| `next/image` | plain `<img>` / `unplugin` image tooling (none in raya today) |
| `next/font/local` (`packages/ui/src/fonts`, Cal Sans VF + Paper Mono woff2) | `@fontsource` packages (raya's existing pattern, `raya:registry/default/styles/raya-fonts.css`) or self-hosted `@font-face` |
| `next-themes` theme provider | raya's own System/`.dark` switching (no direct equivalent needed) |
| route handlers (`api/raw`), `generateStaticParams`, `metadata` | TanStack Start server routes / route `head()` + prerender options |
| `fumadocs-mdx/next` + `next.config` MDX | `fumadocs-mdx` has a TanStack Start/Vite integration — Fumadocs' own scaffolder offers a TanStack Start template (`https://www.fumadocs.dev/docs`, Quick Start) |
| `jotai` (`atomWithStorage`) | can stay (framework-agnostic), or use router state/localStorage |
| `@coss/ui/shared/*`, `@coss/ui/components/*`, `@coss/ui/hooks/*` imports | **AGPL boundary — do not copy.** These are `packages/ui` (AGPLv3). Re-implement from the MIT `apps/ui` components or raya's own registry items |

Raya's docs shell is itself in scope as the Studio shell look (`#21`), but the audit says: only
`apps/ui` files are legally copyable, and most of them still need Next→TanStack swaps + removal of
`@coss/ui/*` imports. The pure-React files (`docs-toc`, `component-preview-tabs`,
`code-collapsible-wrapper`, `media-query-demo`, `category-thumbnails` with its lucide icons) are
the cheap ones.

---

## 5. Base UI 1.7 → 1.8 delta

**Hard requirement first:** `coss:apps/ui/registry/default/ui/combobox.tsx:436` exports

```ts
export const createComboboxItems: typeof ComboboxPrimitive.createItems =
  ComboboxPrimitive.createItems;
```

`createItems` is new in Base UI 1.8.0 (release notes: "Combobox — Add `createItems` collection API
(#5326)"). Raya's installed `@base-ui/react@1.7.0` has zero `createItems` occurrences in its
`combobox` typings; the 1.8.0 tarball exports `createComboboxItems as createItems` from
`combobox/index.parts.d.ts`. So the port cannot typecheck on 1.7.0.

Everything else about the delta:

- All 37 `@base-ui/react/*` subpaths the 54 import exist in 1.7.0 already (checked against
  raya's installed package) — no other new namespaces are required.
- The 1.8.0 release notes list **no breaking changes** — the release is ~80 bug fixes, many of
  them in exactly the components being ported: Dialog/Popover/AlertDialog outside-press
  handling, Field validation lifecycle/IDs, Combobox/Autocomplete/Select/Menu/ScrollArea
  accessibility-tree and highlight fixes, Drawer gesture fixes, Toast functional updates,
  Number Field selection fixes, Slider/Tabs update loops. Good reason to ship the port on 1.8.
- Also new in 1.8 but unused by the 54: `Avatar.Image keepMounted`.
- Raya's Studio keeps working on 1.8: the components it uses today (button, input, select,
  checkbox, …) are covered by the same bug-fix notes; no breaking API removals are listed.
- Bump mechanics: `raya:package.json` has `@base-ui/react: ^1.7.0` — the caret already allows
  1.8, but the lockfile pins 1.7.0, and the fixture lockfile pins `1.7.0` explicitly
  (`raya:tools/roundtrip-fixture/package-lock.json:44`). Refresh both, and expect the ported
  items to declare `@base-ui/react` (they all do upstream).
- Caveat for the docs-chrome calendar: `@daypicker/react` is unrelated to Base UI.

Reference: `https://github.com/mui/base-ui/releases/tag/v1.8.0` (published 2026-09-04,
commit `47b4052`) and `.../releases/tag/v1.7.0`.

---

## 6. SSR / interactive care in the Studio

Base UI primitives are SSR-safe; the following ported components need deliberate handling in a
TanStack Start (SSR-by-default) Studio:

- **Portals (13 files).** dialog, alert-dialog, sheet, drawer, menu, context-menu, select,
  popover, preview-card, tooltip, autocomplete, combobox, command (via dialog), toast,
  sidebar (via sheet) render through Base UI `Portal`. They only mount client-side when opened —
  no SSR crash — but the Studio must be structured so the toast provider(s) wrap the app shell
  (`toast.tsx` exports `ToastProvider` + `AnchoredToastProvider`, both with `portalProps`), and
  `container` overrides need a client ref.
- **`sidebar.tsx`** is the heaviest client component: `useState` for mobile/desktop open,
  a `window` keydown listener (cleanup present), and **`cookieStore.set(...)`** inside
  `setOpen` (async, browser-only) plus `useMediaQuery("max-md")` whose server snapshot is
  `false`. SSR is safe, but initial paint can flash the wrong open state unless the studio
  seeds `defaultOpen`/cookie state; `cookieStore` is unavailable in older browsers and in any
  server render path.
- **`useMediaQuery`** (`coss:apps/ui/registry/default/hooks/use-media-query.ts`) uses
  `useSyncExternalStore` with `getServerSnapshot → false` — hydration-safe, client-only truth.
- **Toast animations**: `animate-toast-*`, `animate-skeleton`, `caret-blink` keyframes must be
  in the theme CSS (§3.3), and `toast.tsx` composes `buttonVariants` from `button.tsx`.
- **Calendar**: DayPicker renders relative to "today"; with server/client timezones differing,
  the today marker/default month can hydrate differently. If the Studio ever pre-selects dates,
  pass explicit values from the server rather than `new Date()` defaults.
- **Drawer/scroll-area/combobox measurements** happen after mount; no `window` reads during
  render, so no SSR guard needed. `combobox.tsx` uses a single `useRef` internally.
- **`"use client"`** can be left in place: TanStack Start doesn't use RSC and Vite/rolldown
  build it without warnings (verified).

---

## 7. What converts cleanly vs what needs reshaping

Clean:

- 54 file bodies (imports are all registry-local or npm packages).
- Item schema (`type`/`files`/`dependencies`/`registryDependencies`/`cssVars`) — both use the
  same `shadcn/schema` vocabulary.
- Base UI subpaths (all exist pre-1.8); `shadcn build` output format.

Needs reshaping:

1. `@coss/*` → `@raya/*` registry deps; add `utils`, `segmented-control`, `use-media-query` items.
2. Common npm deps (`@base-ui/react`, `class-variance-authority`, `clsx`, `tailwind-merge`,
   `@hugeicons/*`) hoisted into `core`/utils items; `@daypicker/react` on calendar only;
   drop `lucide-react` after icon conversion.
3. Theme: extend `core.css` with coss's full bridge + keyframes + `--tw-shadow-color` +
   `@utility container`; decide `cssVars` policy (fixture overwrites injected vars).
4. Icons → `IconPlaceholder` conversions for 17 files.
5. Fix `group.tsx`'s `@/lib/utils` import (or add `src/lib/utils.ts` in raya).
6. Base UI 1.8 bump + lock refresh (combobox `createItems` requires it).
7. Optional guardrail: port coss's `validate-registry-deps` idea into raya CI/pre-commit so 54
   hand-authored items don't drift (raya's current `shadcn registry validate` won't catch it).
8. Docs chrome: rebuild on TanStack + Fumadocs; replace every `@coss/ui/*` (AGPL) import; drop
   Next APIs; keep the layout/classes as the visual reference.

## 8. Open items the next tickets must answer

- `cssVars` policy for ported items (bake into core vs per-item injection + fixture change).
- Whether raya keeps an aggregate `@raya/ui` item and a `colors-neutral`-style token item.
- Whether the port keeps coss's `"use client"` lines verbatim (harmless) for cheaper diffs.
- HugeIcons name mapping table (19 lucide exports) and `@hugeicons/*` dependency declaration.
- Cal Sans / Paper Mono font licensing + `@fontsource`-style packaging (map already tracks).
- How the System model expresses per-System token values once coss's exact theme lands in core.

---

## Appendix A — per-component matrix (all 54)

`cva` = imports `class-variance-authority`; cross-file = imports from
`@/registry/default/{ui,lib,hooks}/*` (all also import `cn` from
`@/registry/default/lib/utils` unless shown; `group` uses `@/lib/utils` instead).

| component | LOC | `"use client"` | cva | `@base-ui/react/*` | lucide | cross-file |
| --- | --- | --- | --- | --- | --- | --- |
| accordion | 69 | yes | — | accordion | ChevronDownIcon | lib/utils |
| alert | 85 | — | yes | — | — | lib/utils |
| alert-dialog | 168 | yes | — | alert-dialog | — | lib/utils |
| autocomplete | 304 | yes | — | autocomplete | ChevronsUpDownIcon, XIcon | lib/utils, ui/input, ui/scroll-area |
| avatar | 56 | yes | — | avatar | — | lib/utils |
| badge | 65 | yes | yes | merge-props, use-render | — | lib/utils |
| breadcrumb | 110 | yes | — | merge-props, use-render | ChevronRight, MoreHorizontal | lib/utils |
| button | 97 | yes | yes | merge-props, use-render | — | lib/utils, ui/spinner |
| calendar | 140 | yes | — | — | ChevronLeftIcon, ChevronRightIcon, ChevronsUpDownIcon | lib/utils |
| card | 254 | yes | — | merge-props, use-render | — | lib/utils |
| checkbox | 69 | yes | — | checkbox | — | lib/utils |
| checkbox-group | 20 | yes | — | checkbox-group | — | lib/utils |
| collapsible | 43 | yes | — | collapsible | — | lib/utils |
| combobox | 443 | yes | — | combobox | ChevronsUpDownIcon, XIcon | lib/utils, ui/input, ui/scroll-area |
| command | 264 | yes | — | dialog | SearchIcon | lib/utils, ui/autocomplete |
| context-menu | 343 | yes | — | context-menu | ChevronRightIcon | lib/utils |
| dialog | 221 | yes | — | dialog, merge-props, use-render | XIcon | lib/utils, ui/button, ui/scroll-area |
| drawer | 633 | yes | — | checkbox, drawer, merge-props, radio, radio-group, use-render | ChevronRightIcon, XIcon | lib/utils, ui/button, ui/scroll-area |
| empty | 135 | — | yes | — | — | lib/utils |
| field | 81 | yes | — | field | — | lib/utils |
| fieldset | 33 | yes | — | fieldset | — | lib/utils |
| form | 14 | yes | — | form | — | — |
| frame | 88 | — | — | — | — | lib/utils |
| group | 93 | yes | yes | merge-props, use-render | — | ui/separator |
| input | 69 | yes | — | input | — | lib/utils |
| input-group | 108 | yes | yes | — | — | lib/utils, ui/input, ui/textarea |
| kbd | 32 | — | — | — | — | lib/utils |
| label | 27 | yes | — | merge-props, use-render | — | lib/utils |
| menu | 353 | yes | — | menu | ChevronRightIcon | lib/utils |
| meter | 81 | yes | — | meter | — | lib/utils |
| number-field | 158 | yes | — | number-field | MinusIcon, PlusIcon | lib/utils, ui/label |
| otp-field | 66 | yes | — | otp-field | — | lib/utils, ui/separator |
| pagination | 131 | yes | — | merge-props, use-render | ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon | lib/utils, ui/button |
| popover | 119 | yes | — | popover | — | lib/utils |
| preview-card | 62 | yes | — | preview-card | — | lib/utils |
| progress | 85 | yes | — | progress | — | lib/utils |
| radio-group | 43 | yes | — | radio, radio-group | — | lib/utils |
| scroll-area | 79 | yes | — | scroll-area | — | lib/utils |
| select | 258 | yes | yes | merge-props, select, use-render | ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon | lib/utils |
| separator | 24 | — | — | separator | — | lib/utils |
| sheet | 232 | yes | — | dialog, merge-props, use-render | XIcon | lib/utils, ui/button, ui/scroll-area |
| sidebar | 741 | yes | yes | merge-props, use-render | PanelLeftIcon | hooks/use-media-query, lib/utils, ui/button, ui/input, ui/scroll-area, ui/separator, ui/sheet, ui/skeleton, ui/tooltip |
| skeleton | 19 | — | — | — | — | lib/utils |
| slider | 77 | yes | — | slider | — | lib/utils |
| spinner | 18 | — | — | — | Loader2Icon | lib/utils |
| switch | 31 | yes | — | switch | — | lib/utils |
| table | 152 | yes | — | merge-props, use-render | — | lib/utils |
| tabs | 119 | yes | — | tabs | — | lib/segmented-control, lib/utils |
| textarea | 59 | yes | — | field, merge-props | — | lib/utils |
| toast | 326 | yes | — | toast | CircleAlertIcon, CircleCheckIcon, InfoIcon, LoaderCircleIcon, TriangleAlertIcon | lib/utils, ui/button |
| toggle | 47 | yes | yes | toggle | — | lib/utils |
| toggle-group | 104 | yes | yes | toggle, toggle-group | — | lib/utils, ui/separator, ui/toggle |
| toolbar | 92 | yes | — | toolbar | — | lib/utils |
| tooltip | 68 | yes | — | tooltip | — | lib/utils |

## Appendix B — coss runtime dependency budgets (from `coss:apps/ui/package.json`)

Direct deps touching the component suite: `@base-ui/react` (pinned `1.8.0`), `@daypicker/react`
(`10.0.1`), `class-variance-authority` `^0.7.1`, `clsx` `^2.1.1`, `tailwind-merge` `^3.4.0`,
`lucide-react` `^0.555.0` (to be replaced), `react`/`react-dom` `^19.2.6`. Docs/build only:
`fumadocs-core` `^16`, `fumadocs-mdx` `^14`, `jotai` `^2.15`, `next` `16.2.5`, `next-themes`
(peer via `packages/ui`), `shadcn` `^4.1.0`, `ts-morph` `^27`, `zod` `^4`, `shiki`/`rehype-pretty-code`,
`@hugeicons/*` (docs chrome only), `date-fns` `^4.1` (particles only), `@remixicon/react` `^4.7`
(particles/app only), `@tanstack/react-table` `^9.2.4` (particles only, per `AGENTS.md`/`registry-particles.ts`).
`next-themes` is a dependency of `packages/ui` (AGPL surface), not of the component suite.

## Appendix C — verification snippets used

```bash
# dependency census
for f in apps/ui/registry/default/ui/*.tsx; do grep -oE 'from "[^"]+"' "$f"; done
# base-ui subpaths demanded by the suite
grep -ohE '@base-ui/react/[\w-]+' apps/ui/registry/default/ui/*.tsx | sort -u
# 1.7 vs 1.8 createItems
grep -rn createItems node_modules/@base-ui/react/combobox/            # 0 matches @ 1.7.0
tar -xzf base-ui-react-1.8.0.tgz && grep createItems package/combobox/index.parts.d.ts
# bridge diff: coss @theme inline vs raya core.css (31 missing vars)
# fixture smoke test: tar-copy tools/roundtrip-fixture, symlink node_modules, `npx vite build`
```
