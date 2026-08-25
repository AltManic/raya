# Research: shadcn Registry schema, Base UI compatibility, HugeIcons config, static serving

**Ticket:** [#2 — Research: shadcn Registry schema, Base UI compatibility, HugeIcons config](https://github.com/AltManic/raya/issues/2)
**Date:** 2026-08-25
**Method:** Official docs (ui.shadcn.com, tanstack.com, developers.cloudflare.com, hugeicons.com) + shadcn CLI source (`shadcn-ui/ui`) + npm registry checks + local precedent (`~/Desktop/klndr`).

---

## 1. Registry-item JSON schema (what the CLI consumes today)

Source: <https://ui.shadcn.com/docs/registry/registry-item-json> · JSON Schema: <https://ui.shadcn.com/schema/registry-item.json>

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `$schema` | string | `"https://ui.shadcn.com/schema/registry-item.json"` |
| `name` | string | **Required.** Unique within the registry |
| `type` | string | **Required.** One of: `registry:base`, `registry:block`, `registry:component`, `registry:font`, `registry:lib`, `registry:hook`, `registry:ui`, `registry:page`, `registry:file`, `registry:style`, `registry:theme`, `registry:item`. Type drives the install target path |
| `title` | string | Human-readable short title |
| `description` | string | Longer description (required in practice for blocks) |
| `author` | string | e.g. `"Name <email>"` |
| `dependencies` | string[] | npm packages installed by `add`; version via `name@1.2.0` |
| `devDependencies` | string[] | Same, dev-only |
| `registryDependencies` | string[] | Item addresses: bare names (`button` → built-in shadcn item), namespaced (`@acme/input-form`), GitHub (`owner/repo/item#v1.2.0`), full URLs (`https://example.com/r/editor.json`), or local paths (`./editor.json`) |
| `files` | object[] | Each `{ path, type, target? }`. `path` is relative to the source registry root (or to the declaring `registry.json` when using `include`). `target` is **required** for `registry:page` / `registry:file`; otherwise optional (CLI derives it from the consumer's `components.json`) |
| `cssVars` | object | `{ theme: {}, light: {}, dark: {} }` — merged into the consumer's CSS (this is how Systems could ship token overrides) |
| `css` | object | Adds rules to project CSS: `@layer base/components`, `@utility`, `@keyframes`, `@plugin` |
| `envVars` | object | Written to `.env.local` (never overwritten). Dev/example vars only |
| `font` | object | Required for `registry:font` items (`family`, `provider`, `import`, `variable`, …) |
| `tailwind` | object | **Deprecated** — use `cssVars.theme` for Tailwind v4 |
| `docs` | string | Message printed by the CLI after install |
| `categories` | string[] | e.g. `["dashboard"]` |
| `meta` | object | Free-form key/value metadata — Raya can use this for System/knob data |

### File-target placeholders

Inside `files[].target`, placeholders resolve against the consumer's aliases: `@components/`, `@ui/`, `@lib/`, `@hooks/` (e.g. `target: "@ui/button.tsx"` installs under the configured ui dir regardless of import prefix). Unknown placeholders are treated as literal paths. `~` refers to the project root.

### URL convention

- Items are served as `<origin>/r/<name>.json` (the docs' canonical example; `shadcn build` writes them to `public/r/`).
- The registry **catalog** is served at `/r/registry.json` (used by `shadcn list` / `search`).
- Consumers add a namespace template in `components.json`: `"registries": { "@raya": "https://raya.alfrizk.dev/r/{name}.json" }` — `{name}` is replaced per item. Install then works as `npx shadcn add @raya/button`.

### Minimal valid example

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "button",
  "type": "registry:ui",
  "title": "Button",
  "description": "A button component.",
  "dependencies": ["@base-ui/react"],
  "files": [
    {
      "path": "registry/default/ui/button.tsx",
      "type": "registry:ui"
    }
  ]
}
```

Built with `npx shadcn build` into `public/r/button.json`. Source authoring convention: keep items under `registry/[style]/[name]/…` with internal imports written as `@/registry/...` (the CLI rewrites them to the consumer's aliases at install time).

---

## 2. Base UI compatibility — yes, first-class since late 2025

**Answer: yes.** Base UI is an officially supported primitive library, selected entirely via the `style` field.

- **Official announcement:** ["Customize Everything" changelog, Dec 2025](https://ui.shadcn.com/docs/changelog/2025-12-shadcn-create): *"We rebuilt every component for Base UI… fully compatible with your existing components, even those pulled from remote registries."* New visual styles: Vega, Nova, Maia, Lyra, Mira.
- **Authoritative enum** ([components.json schema](https://ui.shadcn.com/schema.json)) — style values encode library-style as `{library}-{style}`; current Base UI options: `base-vega`, `base-nova`, `base-maia`, `base-lyra`, `base-mira`, `base-luma`, `base-sera`, `base-rhea` (plus `radix-*` and `aria-*` counterparts).
- **CLI**: `shadcn init --base base|radix` ([init source](https://github.com/shadcn-ui/ui/blob/main/packages/shadcn/src/commands/init.ts)); `--defaults` uses preset `base-nova` with template `next`. Docs serve Base UI variants at `/docs/components/base/*`.
- **Package name:** the current package is **`@base-ui/react`** (v1.7.0 on npm today). `@base-ui-components/react` is the legacy 0.x/beta name (last publish `1.0.0-rc.0`). Some older third-party posts still cite the old name.
- Docs pages exist under `/docs/components/base/` confirming maintained parity.

### Local precedent: `~/Desktop/klndr`

klndr runs the shadcn CLI end-to-end on Base UI:

- `components.json`: `"style": "base-nova"`, `"iconLibrary": "tabler"` (plus `menuColor`/`menuAccent`, empty `registries`).
- `package.json`: `@base-ui/react ^1.0.0`, `shadcn ^3.6.0`.
- Generated components import primitives as `import { Menu as MenuPrimitive } from "@base-ui/react/menu"`, `@base-ui/react/select`, `@base-ui/react/alert-dialog`, etc., with `data-slot` attributes — i.e. standard CLI-generated output, no manual patching.

### Differences & gotchas

- APIs are *not* drop-in identical to Radix variants: Base UI uses `render={}` instead of `asChild`, and some callbacks differ (noted in [shadcn-ui/ui#9142](https://github.com/shadcn-ui/ui/issues/9142)). Switching bases means re-installing components (`add --overwrite`).
- Known bug for **third-party registries whose URL embeds `{style}`**: the CLI can rewrite `components.json#style` to `new-york-v4` on Tailwind v4 projects before resolving ([#10496](https://github.com/shadcn-ui/ui/issues/10496)). Raya's registry serves fixed URLs (`/r/{name}.json`, no `{style}` segment) and ships its own component code, so this does not apply — but worth re-checking if we ever add `{style}` templating.

Confidence: high (official schema + changelog + working local project).

---

## 3. `iconLibrary` + HugeIcons

### How `iconLibrary` works

Source: [`packages/shadcn/src/icons/libraries.ts`](https://github.com/shadcn-ui/ui/blob/main/packages/shadcn/src/icons/libraries.ts), [`transform-icons.ts`](https://github.com/shadcn-ui/ui/blob/main/packages/shadcn/src/utils/transformers/transform-icons.ts), [CLI skill doc](https://github.com/shadcn-ui/ui/blob/HEAD/skills/shadcn/cli.md).

- In `components.json`, `iconLibrary` is a plain string (schema: `{"type":"string"}`). At `init` you pick one of five built-in libraries: `lucide`, `tabler`, `hugeicons`, `phosphor`, `remixicon`.
- During `shadcn add`, the CLI reads the config and **installs the mapped package(s)** (e.g. `tabler` → `@tabler/icons-react`; `hugeicons` → `@hugeicons/react` + `@hugeicons/core-free-icons`).
- Officially-authored items contain `<IconPlaceholder lucide="…" tabler="…" hugeicons="…" />` elements; `transform-icons.ts` swaps each placeholder for the configured library's import + JSX usage at install time (for hugeicons: `import { HugeiconsIcon } from '@hugeicons/react'` + `<HugeiconsIcon icon={ICON} strokeWidth={2} />`). `shadcn migrate icons` re-swaps already-installed components.
- There is **no `icons` alias** like `@/components/ui/icons`: generated components import icons straight from the icon package (confirmed by klndr: `import { IconCheck } from "@tabler/icons-react"` inside `components/ui/*.tsx`). If Raya wants an indirection layer, that would be our own convention layered on top, not something the CLI provides.

### HugeIcons licensing (relevant to a public repo)

Sources: <https://hugeicons.com/pricing> · <https://hugeicons.com/license-agreement> · <https://hugeicons.com/docs/integrations/react/overview>

| | Free | Pro ($99/yr) | Pro Plus ($1,197 once) |
| --- | --- | --- | --- |
| Icons | 6,000+, **Stroke Rounded style only** | 60,000+, 10 styles | same |
| Packages | `@hugeicons/react` + `@hugeicons/core-free-icons` on **public npm** | `@hugeicons-pro/core-*` via **private registry** `npm.hugeicons.com` (license key, seats) | same |
| Limits | — | 300K pageviews / 2GB bandwidth/mo; extra paid | 900K pageviews / 4GB |

License terms (effective Apr 2024, HLAB UX WEB DESIGN CO LLC):

- Use in commercial products allowed; end users don't need a seat.
- **You may NOT share/redistribute source files** — SVGs, icon fonts, Figma sources "cannot be published online, shared publicly, or provided to anyone who has not purchased a license." This applies to the agreement generally ("including the free versions").
- Implication for Raya (public GitHub repo): consuming icons **via the public npm packages is fine**; committing extracted SVGs or vendoring icon source files into the repo would violate the license terms even for the free set. Pro icons additionally require per-seat licenses for everyone committing icon code, and the private registry makes CI/consumer setup harder — **stick to the free set** if using HugeIcons at all.

### Official integration path

Yes — `hugeicons` is a built-in value of `iconLibrary` in the CLI itself (see above), wired to the free packages. So `npx shadcn init` (choose HugeIcons) or setting `"iconLibrary": "hugeicons"` is the official path; no custom wiring needed for consumers of Raya's registry as long as Raya's items either use `IconPlaceholder` or hard-code hugeicons imports deliberately.

Caveat: the placeholder swap only handles `IconPlaceholder` usages. Third-party registry items with hard-coded `lucide-react` imports are **not** auto-rewritten — so Raya must pick one icon story for its published components (placeholders preferred, so each consumer gets their own library).

Confidence: high on CLI mechanics (read from source); medium-high on license interpretation (plain-text terms, but "free versions included" redistribution clause deserves a second read before committing any SVG assets).

---

## 4. Serving `/r/*.json` statically from TanStack Start on Cloudflare Workers

**Answer: yes — put the files in `public/r/` and they ship as Workers static assets; requests never invoke the Worker.**

- **TanStack Start → Cloudflare Workers is the officially documented path** ([hosting guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting), [Cloudflare framework guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/)): add `@cloudflare/vite-plugin` + `wrangler`, plugin order `cloudflare({ viteEnvironment: { name: 'ssr' } })` → `tanstackStart()` → `viteReact()`, `wrangler.jsonc` with `"main": "@tanstack/react-start/server-entry"`, deploy via `wrangler deploy`. With the Vite plugin, Wrangler picks up the client build output as the static-assets directory automatically.
- **Vite copies everything in `public/` verbatim to the build output**, so `public/r/button.json` is served at `/r/button.json`. This matches exactly what `shadcn build` produces (`--output` defaults to `public/r`) — zero glue code.
- **Cloudflare routing behavior** ([static assets docs](https://developers.cloudflare.com/workers/static-assets/)): *"if a requested URL matches a file in the static assets directory, that file will be served — without invoking Worker code."* Unmatched requests fall through to the SSR worker. `.json` extension gets correct `application/json` content-type automatically; responses get automatic edge caching.

### Recommended setup for Raya

```
raya/
├── registry/               # source items (authored TSX)
│   └── default/ui/button.tsx
├── registry.json           # or composed via include
└── public/
    └── r/                  # npx shadcn build output
        ├── registry.json   # catalog (list/search)
        └── button.json     # items
```

Consumers: `"@raya": "https://<studio-domain>/r/{name}.json"` in `components.json#registries`.

### Gotchas

- **Don't route `/r/$name` through Start server routes** unless you need dynamic generation — every registry fetch becomes a billed Worker invocation. Static files are free and cached.
- If prerendering is enabled (`tanstackStart({ prerender: { enabled: true, crawlLinks: true } })`) it generates HTML for routes; it doesn't conflict with `public/r/*.json`, but make sure no app route shadows `/r/:name` (route collisions would be masked by the static asset anyway — assets win).
- `not_found_handling`: leave default for an SSR app (worker handles 404s); SPA mode would swallow missing-item 404s into `index.html` and confuse the CLI's error reporting.
- Custom cache headers for JSON are available via `_headers` file support in Workers static assets if finer control than defaults is needed.
- Registry JSON contains file `path`s resolved at `shadcn build` time — rebuild and redeploy whenever component source changes; consider CI running `shadcn build` before `wrangler deploy`.

Confidence: high (official docs on both sides; no conflicting sources found).

---

## Summary for design decisions

1. **Registry format is settled**: standard `registry-item.json`, served statically from `public/r/`, consumed via `@raya/{name}` namespace. System-specific data (knobs, tokens) can ride along in `meta` / `cssVars`.
2. **Base UI is safe as the primitive layer**: `style: "base-*"` + `@base-ui/react`; proven locally in klndr; watch the `render=` vs `asChild` API difference when porting patterns from Radix-era examples.
3. **HugeIcons free set is CLI-supported** (`iconLibrary: "hugeicons"` → `@hugeicons/react` + `@hugeicons/core-free-icons`); npm-package consumption is public-repo-safe; do not vendor SVGs. Decide between placeholder-based items (consumer chooses library) vs hard-coded hugeicons imports (Raya controls look).
