# Cal Sans + Paper Mono — licenses, availability, self-hosting

Research for [#23](https://github.com/AltManic/raya/issues/23) under the map
[#21 — Raya adopts the coss ui design system](https://github.com/AltManic/raya/issues/21).
All claims below are cited to upstream primary sources (font repos, license files, npm
registry metadata, Google Fonts API, vendor docs). Binaries were fingerprinted with
`fontTools`/`shasum` on 2026-09-12; commands are in [Reproduce](#8-reproduce).

Pinned references:

- coss `e937becd2d5ffb5c621eed6f8b1f223cbb6051e7` — the frozen coss revision
  ([repo](https://github.com/cosscom/coss/tree/e937becd2d5ffb5c621eed6f8b1f223cbb6051e7)).
- `calcom/sans` main @ `bdff1d708ffb7b43d1f3006699d913fbffba08a9` (2026-09-08) —
  Cal Sans upstream.
- `paper-design/paper-mono` main @ `9fbc4d9877798252494ad517a5db9ee89f4fd972`
  (2026-08-27) — Paper Mono upstream.

## TL;DR

- **Both faces can be bundled and redistributed by raya.** Cal Sans is
  **SIL OFL-1.1** ([calcom/sans `OFL.txt`](https://github.com/calcom/sans/blob/bdff1d708ffb7b43d1f3006699d913fbffba08a9/OFL.txt))
  and Paper Mono is **SIL OFL-1.1** ([paper-mono `OFL.txt`](https://github.com/paper-design/paper-mono/blob/9fbc4d9877798252494ad517a5db9ee89f4fd972/OFL.txt),
  [`LICENSE.txt`](https://github.com/paper-design/paper-mono/blob/9fbc4d9877798252494ad517a5db9ee89f4fd972/LICENSE.txt)).
  Neither declares a Reserved Font Name. OFL condition 2 permits bundling with software
  provided each copy carries the copyright notice and license text — so raya must ship
  the OFL files + credits alongside the woff2 (which BUILD-SPEC §4.3's credits section
  already anticipates).
- **Neither font has a Fontsource/npm package matching coss's build**, so coss parity
  requires **vendored woff2 + `@font-face`** (Vite fingerprints `url()` assets), pinned
  by upstream commit **and** sha256. coss's own files come from these upstream projects:
  Paper Mono is byte-identical to the upstream `v0.100` release asset; Cal Sans is an
  upstream **v1.998 (2026-06-15, WORDMARK)** variable build that matches
  `fonts/calsans-cossui/CalSansVF.woff2` at upstream commit `b5d86f05` (2026-07-02) —
  no longer in upstream `main`, whose `fonts/` directory is regenerated on every build.
- The current upstream `calsans-cossui` build is **v2.001** (upright + italic, 5 axes,
  `wght` 400–700); upstream Paper Mono is **v0.320** with a single variable
  `wght` 100–800 woff2 (52.6 KB). Raya should pin one of these rather than coss's
  older copies; the only reason to copy coss's bytes is exact visual parity.
- **The `raya-fonts` registry item cannot carry the binaries.** `shadcn build` embeds
  file contents as JSON strings; a real woff2 round-trips to 10,950 U+FFFD replacement
  characters (experiment below). Deliver them to registry consumers either via a small
  raya npm package listed in `dependencies`, or as BYO self-host instructions per
  BUILD-SPEC §4.2 — exactly the split coss itself uses: its registry installs
  **Inter + Geist Mono via Fontsource**, while coss.com's Cal Sans/Paper Mono live
  inside `@coss/ui/fonts` ([get-started.mdx](https://github.com/cosscom/coss/blob/e937becd2d5ffb5c621eed6f8b1f223cbb6051e7/apps/ui/content/docs/%28root%29/get-started.mdx),
  [styling.mdx](https://github.com/cosscom/coss/blob/e937becd2d5ffb5c621eed6f8b1f223cbb6051e7/apps/ui/content/docs/%28root%29/styling.mdx)).
- **No redistribution blockers found.** If vendoring is rejected, the closest legally
  clean substitutes inside raya's existing Fontsource roster are **Geist Mono Variable**
  for Paper Mono (it is Paper Mono's parent face — same cap-height metric) and
  **Inter / Space Grotesk** for Cal Sans.

## 1. What coss actually ships

coss wires both faces in
[`packages/ui/src/fonts/index.ts`](https://github.com/cosscom/coss/blob/e937becd2d5ffb5c621eed6f8b1f223cbb6051e7/packages/ui/src/fonts/index.ts)
via `next/font/local`:

```ts
export const fontMono = localFont({ display: "swap", src: "./PaperMono-Regular.woff2", variable: "--font-mono" });
export const fontSans = localFont({ display: "swap", src: "./CalSansVF.woff2", variable: "--font-sans", weight: "300 700" });
```

[`fonts/README.md`](https://github.com/cosscom/coss/blob/e937becd2d5ffb5c621eed6f8b1f223cbb6051e7/packages/ui/src/fonts/README.md)
describes them as “Cal Sans 2.0 variable font (`CalSansVF.woff2`)” and “Paper Mono for
code and monospace UI”.

| vendored file | bytes | sha256 | name table / axes (measured) |
|---|---|---|---|
| `CalSansVF.woff2` | 185,744 | `986ab4149c994b2f419968ecad5860686dbf11f11079601bbacdb12b28e28afe` | Cal Sans, **v1.998** build stamp `1998-CalSansWORD-2026-06-15`, © 2026 Mark Davis DBA Wordmark; axes `opsz 8–32 (14)`, `GEOM 0–100 (25)`, `wght 400–700 (400)`, `YTAS 720–800`, `SHRP 0–100`, `ital 0–1` |
| `PaperMono-Regular.woff2` | 26,368 | `3fa01203ca86216d0ced6bbb6c524240b7897cce035b74385dd46e1274c96880` | Paper Mono **v0.100**, © 2025 The Paper Mono Project Authors; nameID 13 embeds the OFL notice |

Two fidelity notes:

- coss declares `weight: "300 700"` for Cal Sans, but the binary's `wght` axis minimum
  is **400**; anything below 400 clamps. The official npm Cal Sans UI build has a real
  300–700 axis (§2).
- coss's Cal Sans binary does **not** embed the OFL notice (`nameID 13`) — only a
  copyright line. A redistributor must take the license text from upstream.

### License applicability inside coss's repo

coss is AGPL-3.0-or-later by default, with MIT carved out for `apps/origin/` and
`apps/ui/` ([`LICENSING.md`](https://github.com/cosscom/coss/blob/e937becd2d5ffb5c621eed6f8b1f223cbb6051e7/LICENSING.md),
root [`LICENSE`](https://github.com/cosscom/coss/blob/e937becd2d5ffb5c621eed6f8b1f223cbb6051e7/LICENSE)).
The fonts live in `packages/ui/src/fonts/`, which falls under the AGPL default — but a
repo's license label cannot relicense font software: the files carry their own OFL-1.1
grant from their upstream projects, and OFL explicitly permits verbatim redistribution
bundled with software. Raya should still vendor **from upstream** (clearer provenance,
license text included, newer builds) rather than from coss's AGPL tree.

## 2. Cal Sans

### Upstream and license

- Project: **calcom/sans** — “The home for our Cal Sans font”
  ([repo](https://github.com/calcom/sans); the old `calcom/font` name still appears in
  license text and redirects). Commissioned by Cal.com, drawn/engineered by WORDMARK
  ([README](https://github.com/calcom/sans/blob/bdff1d708ffb7b43d1f3006699d913fbffba08a9/README.md)).
- License: **SIL OFL-1.1**. Evidence: [`OFL.txt`](https://github.com/calcom/sans/blob/bdff1d708ffb7b43d1f3006699d913fbffba08a9/OFL.txt)
  (“Copyright 2021 The Cal Sans Project Authors … licensed under the SIL Open Font
  License, Version 1.1”), GitHub’s license API for the repo (`ofl-1.1`), and README
  (“Free for commercial and personal use, thanks to the SIL Open Font License”).
  **No Reserved Font Name is declared** in the copyright line.
- AUTHORS: Mark Davis (`AUTHORS.txt`).

### What the variable font offers

Per [`fonts/README.md`](https://github.com/calcom/sans/blob/bdff1d708ffb7b43d1f3006699d913fbffba08a9/fonts/README.md)
(the fonts directory is “wiped and regenerated on every build”):

- `calsans-var-full/CalSansVF.woff2` — full variable font, six axes (`opsz`, `GEOM`,
  `wght`, `YTAS`, `SHRP`, `ital`), 8–45pt optical range.
- `calsans-cossui/CalSansVF.woff2` + `CalSansVF-Italic.woff2` — “the lean cal.com,
  Framer-friendly, and **COSS UI** build”: `ssXX`/`cvXX` features subset out, `opsz`
  peaks at 32, delivered as separate upright/italic files. **This is the family coss
  vendored** (its v1.998 build predates the current split).
- `calsans-static-*` — 384 static instances (four `GEOM` families × four weights ×
  three optical tiers × upright/italic), TTF + WOFF2 plus Google-Fonts-packaged cuts.

Current `calsans-cossui` build (upstream main @ `bdff1d7`): **v2.001**, build stamp
`2000-CalSansWORD-2026-07-31`, axes `opsz 8–32`, `GEOM 0–100`, `wght 400–700`,
`YTAS 720–800`, `SHRP 0–100` (no `ital` — it is a separate file).

| upstream file (main @ `bdff1d7`) | bytes | sha256 |
|---|---|---|
| `fonts/calsans-cossui/CalSansVF.woff2` | 133,556 | `8fd76dcde6c4ff3d5ac3ab3f61a10ec72cd491467439ee64d9bbe6bd56bb5d1d` |
| `fonts/calsans-cossui/CalSansVF-Italic.woff2` | 144,776 | `ed74d0088b3f8644f551ecfd2ef45b4123310fdc7f742ebd25a30b1a35b30ff9` |

The exact coss bytes **are** reachable in upstream history:
`fonts/calsans-cossui/CalSansVF.woff2` at commit
[`b5d86f05`](https://github.com/calcom/sans/blob/b5d86f057dce21735d0cfe2fbca35de615095121/fonts/calsans-cossui/CalSansVF.woff2)
(2026-07-02) is byte-identical — same 185,744 bytes, same sha256 `986ab414…`. coss's
[`feat: update fonts (#810)`](https://github.com/cosscom/coss/commit/bd3777acfb44921d4a90b43693a9e26b970b2ecb)
commit (2026-07-13) added precisely this build and removed the older
`CalSans-Regular.woff2` / `CalSansUI[wght,GEOM].woff2`. Upstream rebuilt the directory
from `c9bc104bdd` (2026-07-03) onward, so current `main` is v2.001 with different bytes.
For exact coss parity, vendor upstream `b5d86f05` (or coss's copy) + checksum; for a
maintained copy, vendor upstream v2.001.

### Distribution channels

| channel | what it carries | variable coss build? |
|---|---|---|
| [calcom/sans](https://github.com/calcom/sans) repo + [releases](https://github.com/calcom/sans/releases) | all builds above (v2.001) | **yes** (`calsans-cossui`, `calsans-var-full`) — the only source |
| [`@calcom/cal-sans-ui@1.3.0`](https://www.npmjs.com/package/@calcom/cal-sans-ui) (OFL-1.1, ships `OFL.txt`) | **Cal Sans UI / Text / Geo v1.100** (`CalSansUI[wght,GEOM].woff2` axes `wght 300–700`, `GEOM 0–100`, + statics, CSS subpaths) | no — older generation, no `opsz`/`YTAS`/`SHRP`, different family naming |
| `cal-sans@1.0.1` npm (old `calendso/font`) | v1 single SemiBold static only; package.json says “SEE LICENSE IN OFL.TXT” but the tarball contains no `OFL.TXT` | no |
| [`@fontsource/cal-sans@5.3.0`](https://www.npmjs.com/package/@fontsource/cal-sans) | static **400 only**, latin/latin-ext/vietnamese, v1.000 file, OFL-1.1; Fontsource API reports `"variable": false` | no |
| `@fontsource-variable/cal-sans` | **does not exist** (npm 404; Fontsource API 404) | no |
| [Google Fonts API](https://fonts.googleapis.com/css2?family=Cal+Sans) | static 400 TTF only (`fonts.gstatic.com/s/calsans/v2/...ttf`) | no |

Practical consequence: if the map insists on “Fontsource npm packages only”
(BUILD-SPEC §1/§4), the coss Cal Sans is unavailable; the npm-distributed options are
`@calcom/cal-sans-ui` (official, OFL, but the v1.100 UI cut) or the static 400
Fontsource/Google cut. Full coss parity ⇒ vendored woff2.

### Redistribution terms (OFL-1.1, from `OFL.txt`)

- Copying, merging, embedding, modifying, redistributing are permitted, including
  bundled with commercial software; the font may not be **sold by itself**.
- Each copy must include the copyright notice and the license text. Raya should ship
  upstream `OFL.txt` + `AUTHORS.txt` with the vendored files.
- Modified versions must not use a Reserved Font Name — none is declared for Cal Sans,
  so subsetting/renaming (`CalSansVF.woff2`) is allowed; the OFL text still travels
  with the files.

## 3. Paper Mono

### Upstream and license

- Project: **paper-design/paper-mono** — “A beautiful monospace font for design and code
  by [Paper](https://paper.design)” ([readme](https://github.com/paper-design/paper-mono/blob/9fbc4d9877798252494ad517a5db9ee89f4fd972/readme.md)).
- License: **SIL OFL-1.1**. Evidence:
  [`OFL.txt`](https://github.com/paper-design/paper-mono/blob/9fbc4d9877798252494ad517a5db9ee89f4fd972/OFL.txt)
  (“Copyright 2025 The Paper-Mono.Git Project Authors”), [`LICENSE.txt`](https://github.com/paper-design/paper-mono/blob/9fbc4d9877798252494ad517a5db9ee89f4fd972/LICENSE.txt)
  (“Paper Mono, Copyright (c) 2025 Lost Coast Labs, Inc. (Paper Design). Based on Geist
  Mono, Copyright (c) 2023 Vercel, in collaboration with basement.studio”), the
  readme’s License section, and the font binary’s `nameID 13` OFL notice. **No Reserved
  Font Name is declared.**
- Authors: Guido Ferreyra, Vladyslav Moroz, Paper Design; derived from **Geist Mono**
  ([`AUTHORS.txt`](https://github.com/paper-design/paper-mono/blob/9fbc4d9877798252494ad517a5db9ee89f4fd972/AUTHORS.txt)).
  (GitHub’s API reports `NOASSERTION` only because the repo carries two OFL files —
  `OFL.txt` and `LICENSE.txt`.)

### What coss vendored, and what upstream has now

- coss's `PaperMono-Regular.woff2` is **byte-identical** to the upstream
  [v0.100 release asset](https://github.com/paper-design/paper-mono/releases/download/v0.100/PaperMono-Regular.woff2)
  (same 26,368 bytes, same sha256 `3fa01203…`; binary says `Version 0.100`, no fvar).
- Current upstream **v0.320** (2026-08-27) ships 8 static webfonts (Thin–ExtraBold) and
  one variable file:

| upstream file (main @ `9fbc4d9`) | bytes | sha256 |
|---|---|---|
| `fonts/webfonts/PaperMono[wght].woff2` | 52,652 | `6ef64e17b97f4819aef6c36a6bf0882087d88426a1f45f150043bbe9b6df927e` |

  axes: `wght 100–800 (default 400)`; binary name table: `Version 0.320`, OFL notice,
  © 2025 The Paper Mono Project Authors. No italics exist upstream (all weights are
  upright), so a single file covers the whole family for raya.

### Distribution channels

| channel | what it carries |
|---|---|
| [paper-design/paper-mono](https://github.com/paper-design/paper-mono) repo + [releases](https://github.com/paper-design/paper-mono/releases) | statics (otf/ttf/webfonts), `fonts/variable/PaperMono[wght].ttf`, `fonts/webfonts/*.woff2` — **only first-party channel** |
| npm / Fontsource | **none**: npm search finds no Paper Mono font package; `@fontsource/paper-mono` 404; Fontsource API 404. Warning: the bare `paper-mono` npm name is taken by an unrelated MIT CLI (`paper-mono@0.62.5`, “Paper Desktop design-to-code specialist”) — `npm i paper-mono` does **not** install the font |
| Google Fonts API | **not available** — `css2?family=Paper+Mono` returns HTTP 400 |

Readme instructs users to “download the latest release”, so vendoring + OFL text is the
intended distribution path.

### Redistribution terms

Identical to Cal Sans: bundle/embed/redistribute permitted with copyright + license;
no standalone sale; no RFN declared. Because Paper Mono is itself a Geist Mono
derivative (also OFL), keep the Vercel/basement.studio notice from `LICENSE.txt` when
redistributing.

## 4. Self-hosting in raya (Vite + TanStack Start)

### Mechanism

Vite treats font files referenced with `url()` in CSS as static assets: they are
“included as part of the build assets graph, will get hashed file names, and can be
processed by plugins” ([Vite — Static Asset Handling](https://vite.dev/guide/assets)).
This is exactly the Fontsource model, minus the npm package: drop the woff2 next to the
CSS and reference it relatively; no CDN, works under `vite build` → Cloudflare Workers
assets (raya's `vite.config.ts` uses `@tanstack/react-start` + `@cloudflare/vite-plugin`).

Proposed layout (studio bundle):

```
src/styles/raya/fonts/CalSansVF.woff2            # vendored, pinned + checksummed
src/styles/raya/fonts/CalSansVF-Italic.woff2     # optional
src/styles/raya/fonts/PaperMonoVF.woff2          # upstream v0.320 variable (renamed)
src/styles/raya/fonts/OFL-CalSans.txt            # upstream license text
src/styles/raya/fonts/OFL-PaperMono.txt          # upstream license text
```

`src/styles/raya/fonts.css` (which today only re-exports Fontsource) gains:

```css
/* Cal Sans v2.001 — calcom/sans fonts/calsans-cossui, OFL-1.1.
   wght axis is 400–700; do not declare 300 as coss does. */
@font-face {
  font-family: "Cal Sans";
  src: url("./fonts/CalSansVF.woff2") format("woff2");
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
}

/* Paper Mono v0.320 variable — paper-design/paper-mono, OFL-1.1 */
@font-face {
  font-family: "Paper Mono";
  src: url("./fonts/PaperMonoVF.woff2") format("woff2");
  font-weight: 100 800;
  font-style: normal;
  font-display: swap;
}
```

The System token values then read `--font-sans: "Cal Sans", ui-sans-serif, system-ui, sans-serif;`
and `--font-mono: "Paper Mono", ui-monospace, monospace;` — the same fallback shape coss
uses in its theme (`--font-sans: var(--font-sans, ui-sans-serif, system-ui, sans-serif)`,
`--font-mono: var(--font-mono, ui-monospace, monospace)`, see
[`style.json`](https://github.com/cosscom/coss/blob/e937becd2d5ffb5c621eed6f8b1f223cbb6051e7/apps/ui/public/r/style.json)).

Tarball sizes for planning: Cal Sans upright 133.6 KB (+ italic 144.8 KB if wanted);
Paper Mono variable 52.7 KB (vs 8 × ~37 KB statics). Total for sans ≈ 134 KB.

### Fallback metrics

Measured from the binaries with `fontTools` (units/em = 1000 unless noted; `%em` shown
where relevant):

| face | upm | x-height | cap height | typo asc/desc | hhea asc/desc |
|---|---|---|---|---|---|
| Cal Sans (coss v1.998) | 1000 | 515 (51.5%) | 720 (72.0%) | 900 / −245 | 900 / −245 |
| Paper Mono var (v0.320) | 1000 | 509 (50.9%) | 710 (71.0%) | 955 / −245 | 955 / −245 |
| Paper Mono Regular (v0.100) | 1000 | 530 (53.0%) | 740 (74.0%) | 970 / −230 | 970 / −230 |
| Inter Variable (raya default) | 2048 | 1118 (54.6%) | 1490 (72.8%) | 1984 / −494 | 1984 / −494 |
| Space Grotesk Variable (raya alt) | 1000 | 486 (48.6%) | 700 (70.0%) | 984 / −292 | 984 / −292 |
| Geist Mono Variable (raya roster) | 1000 | 530 (53.0%) | 710 (71.0%) | 1005 / −295 | 1005 / −295 |
| JetBrains Mono Variable (raya roster) | 1000 | 550 (55.0%) | 730 (73.0%) | 1020 / −300 | 1020 / −300 |
| SF Pro (macOS `ui-sans-serif`) | 2048 | 1040 (50.8%) | 1443 (70.5%) | 1980 / −432 | 1980 / −432 |
| SF Mono (macOS `ui-monospace`) | 2048 | 1077 (52.6%) | 1443 (70.5%) | 1980 / −432 | 1980 / −432 |
| Arial | 2048 | 1062 (51.9%) | 1467 (71.6%) | 1491 / −431 | 1854 / −434 |
| Menlo | 2048 | 1120 (54.7%) | 1493 (72.9%) | 1556 / −492 | 1901 / −483 |

Derived `size-adjust` for a fallback `@font-face` (ratio of x-height per em, primary ÷
fallback):

- Cal Sans vs system `ui-sans-serif` (SF Pro) ≈ **101% x-height / 102% cap**; vs Arial
  ≈ 99% / 100%. Practically a wash — the stock fallback stacks above need no adjustment.
- Cal Sans vs Inter ≈ **94% x-height / 99% cap**; if raya renders Inter while Cal Sans
  loads, `size-adjust: 94%` on an Inter-based fallback face prevents visible reflow.
- Paper Mono vs Geist Mono Variable ≈ **96% x-height / 100% cap**; vs SF Mono ≈ 97% /
  101%; vs JetBrains Mono ≈ 93% / 97%. Geist Mono is the closest metric relative and,
  as Paper Mono's parent, the natural fallback.

`next/font/local` (coss) automatically emits a metric-adjusted fallback
(`adjustFontFallback`, default `'Arial'` —
[Next.js font docs](https://nextjs.org/docs/app/api-reference/components/font#adjustfontfallback)).
Vite has no equivalent, so raya must write `size-adjust`/`ascent-override` itself if it
cares about the CLS floor.

## 5. Registry delivery to consumers

### `registry:file` cannot carry binaries (verified)

The shadcn `registry-item.json` schema embeds each file's literal contents when built
(`files[].content`; see raya's own
[`public/r/raya-fonts.json`](https://github.com/AltManic/raya/blob/research/coss-fonts/public/r/raya-fonts.json)).
Experiment: building a `registry:file` item pointing at a real 26,368-byte woff2
produced a JSON string with **10,950 U+FFFD replacement characters** and did not
round-trip byte-for-byte. The shadcn schema offers no binary/base64 file type; the only
font-aware type, `registry:font`, is Google-only with an npm `dependency` escape hatch
([shadcn registry-item.json docs](https://ui.shadcn.com/docs/registry/registry-item-json)).

### Options for the `raya-fonts` item

1. **Publish a tiny npm package** (e.g. `raya-fonts`), Fontsource-style: two woff2s +
   `fonts.css` + the OFL texts, listed in the item's `dependencies`. One-command
   install, no binary in JSON, matches BUILD-SPEC §4's npm posture; cost is a package
   to publish/maintain. (If a private scope on the repo's existing tooling is
   preferable, `@raya/fonts`.)
2. **Keep the item Fontsource-only; ship Cal Sans/Paper Mono as BYO self-host faces.**
   BUILD-SPEC §4.2 already specifies flagging non-bundled families and emitting
   copy-paste self-host instructions (woff2 + `@font-face`); the item's `docs` field can
   carry pinned upstream URLs + checksums. Zero new infrastructure; consumers don't get
   the coss-brand faces out of the box.
3. **CSS `url()` to pinned raw/release URLs** — cheapest, but it turns every consumer
   into a CDN fetch, contradicting BUILD-SPEC §4's “no CDN fetches”. Not recommended.

coss's own precedent resolves the tension: its registry's `font-sans`/`font-mono` items
install **Inter + Geist Mono via npm dependencies**
([font-sans.json](https://github.com/cosscom/coss/blob/e937becd2d5ffb5c621eed6f8b1f223cbb6051e7/apps/ui/public/r/font-sans.json),
[font-mono.json](https://github.com/cosscom/coss/blob/e937becd2d5ffb5c621eed6f8b1f223cbb6051e7/apps/ui/public/r/font-mono.json)),
and the coss-brand faces are internal to the UI package. Raya's current `raya-fonts`
item already mirrors that; adding Cal Sans/Paper Mono means choosing between options 1
and 2.

### BUILD-SPEC implication

BUILD-SPEC §4 currently locks “Bundled via Fontsource npm packages … nothing vendored,
no CDN fetches”. Coss parity for Cal Sans/Paper Mono **requires amending that posture**
for these two faces (options: vendored woff2 in the studio, and npm-package or BYO for
consumers). That amendment is a decision for the map, not for this research doc.

## 6. Closest legally clean alternatives (if vendoring is rejected)

| coss face | alternative | evidence / trade-off |
|---|---|---|
| Paper Mono (`--font-mono`) | **Geist Mono Variable** — already bundled (`@fontsource-variable/geist-mono`) | Paper Mono is derived from Geist Mono (`LICENSE.txt`); cap-height identical (71% em), x-height within 4%. This is the closest possible substitute and needs no new assets. |
| Cal Sans (`--font-sans`) | **Inter Variable** (default) or **Space Grotesk Variable** (alternate) — both bundled | No Fontsource variable Cal Sans exists; Inter is neutral UI, Space Grotesk is the roster's geometric-leaning grotesque. Visual parity with Cal Sans v2 is lost (six-axis optical/geometry system). |
| Cal Sans via npm only | **`@calcom/cal-sans-ui@1.3.0`** (OFL-1.1, includes `OFL.txt`) | Official Cal.com package, but ships Cal Sans **UI/Text/Geo v1.100** (`wght` 300–700, `GEOM` 0–100) — not coss's v1.998/v2.001 build (no `opsz`/`YTAS`/`SHRP`, different family names). Legally clean, aesthetically adjacent. |
| Cal Sans static | `@fontsource/cal-sans@5.3.0` / Google Fonts | Static 400 only, v1.000; wrong weights for a coss-like UI. |

## 7. Recommendation for the map

1. **Bundle both faces** in the studio as **vendored woff2 + `@font-face`**, prefers
   upstream `calsans-cossui` v2.001 upright (+ italic if the design needs it) and
   upstream `PaperMono[wght]` v0.320, each pinned by upstream commit **and** sha256
   (upstream rebuilds `fonts/` in place, so commit+hash, not branch, is the pin).
2. **Ship the license texts and notices** (`OFL.txt` for both; Cal Sans `AUTHORS.txt`;
   Paper Mono `LICENSE.txt`/`AUTHORS.txt`/`CONTRIBUTORS.txt`) and add the faces to the
   docs credits section required by BUILD-SPEC §4.3.
3. **For the `raya-fonts` registry item**, prefer option 1 (tiny npm package) if
   one-command consumer parity matters; otherwise option 2 (Fontsource-only item + BYO
   self-host docs). Do not attempt to embed woff2 in registry JSON.
4. **Fallbacks**: use the coss-shaped stacks; add `size-adjust: 94%` for an
   Inter→Cal Sans fallback and `96%` for Geist Mono→Paper Mono only if reflow is
   observed (system-stack differences are within ~1–4%).
5. **Amend BUILD-SPEC §4** for the two vendored faces if the map adopts this — the
   current “nothing vendored” line would otherwise be false.

## 8. Reproduce

```sh
COSS=/private/var/folders/k0/d3qx33w93z7br1lgfmr1yyhm0000gn/T/opencode/coss

# coss vendored files
git -C "$COSS" show HEAD:packages/ui/src/fonts/CalSansVF.woff2 | shasum -a 256
git -C "$COSS" show HEAD:packages/ui/src/fonts/PaperMono-Regular.woff2 | shasum -a 256

# Paper Mono: coss copy == v0.100 release asset
curl -sL https://github.com/paper-design/paper-mono/releases/download/v0.100/PaperMono-Regular.woff2 | shasum -a 256

# coss's exact Cal Sans bytes == upstream calsans-cossui @ b5d86f05 (2026-07-02)
curl -sL https://raw.githubusercontent.com/calcom/sans/b5d86f057dce21735d0cfe2fbca35de615095121/fonts/calsans-cossui/CalSansVF.woff2 | shasum -a 256

# current upstream builds
curl -sL https://raw.githubusercontent.com/calcom/sans/bdff1d708ffb7b43d1f3006699d913fbffba08a9/fonts/calsans-cossui/CalSansVF.woff2 | shasum -a 256
curl -sL https://raw.githubusercontent.com/paper-design/paper-mono/9fbc4d9877798252494ad517a5db9ee89f4fd972/fonts/webfonts/PaperMono%5Bwght%5D.woff2 | shasum -a 256

# name tables / axes (fontTools)
python3 - <<'PY'
from fontTools.ttLib import TTFont
f = TTFont("CalSansVF.woff2")
print([(a.axisTag, a.minValue, a.defaultValue, a.maxValue) for a in f["fvar"].axes])
print([(r.nameID, r.toUnicode()) for r in f["name"].names if r.nameID in (0, 3, 5, 13)])
PY
```

## Primary sources

- coss pinned rev `e937becd2d5ffb5c621eed6f8b1f223cbb6051e7`: [`packages/ui/src/fonts/index.ts`](https://github.com/cosscom/coss/blob/e937becd2d5ffb5c621eed6f8b1f223cbb6051e7/packages/ui/src/fonts/index.ts) · [`fonts/README.md`](https://github.com/cosscom/coss/blob/e937becd2d5ffb5c621eed6f8b1f223cbb6051e7/packages/ui/src/fonts/README.md) · [`LICENSING.md`](https://github.com/cosscom/coss/blob/e937becd2d5ffb5c621eed6f8b1f223cbb6051e7/LICENSING.md) · [get-started](https://github.com/cosscom/coss/blob/e937becd2d5ffb5c621eed6f8b1f223cbb6051e7/apps/ui/content/docs/%28root%29/get-started.mdx) · [styling](https://github.com/cosscom/coss/blob/e937becd2d5ffb5c621eed6f8b1f223cbb6051e7/apps/ui/content/docs/%28root%29/styling.mdx) · [registry fonts](https://github.com/cosscom/coss/tree/e937becd2d5ffb5c621eed6f8b1f223cbb6051e7/apps/ui/public/r) (font-sans/mono/heading, style)
- Cal Sans: [repo](https://github.com/calcom/sans) · [`OFL.txt`](https://github.com/calcom/sans/blob/bdff1d708ffb7b43d1f3006699d913fbffba08a9/OFL.txt) · [`AUTHORS.txt`](https://github.com/calcom/sans/blob/bdff1d708ffb7b43d1f3006699d913fbffba08a9/AUTHORS.txt) · [`fonts/README.md`](https://github.com/calcom/sans/blob/bdff1d708ffb7b43d1f3006699d913fbffba08a9/fonts/README.md) · [`README.md`](https://github.com/calcom/sans/blob/bdff1d708ffb7b43d1f3006699d913fbffba08a9/README.md) · [`calsans-cossui/`](https://github.com/calcom/sans/tree/bdff1d708ffb7b43d1f3006699d913fbffba08a9/fonts/calsans-cossui) · [coss-exact build @ `b5d86f05`](https://github.com/calcom/sans/blob/b5d86f057dce21735d0cfe2fbca35de615095121/fonts/calsans-cossui/CalSansVF.woff2) · [releases](https://github.com/calcom/sans/releases) · npm [`@calcom/cal-sans-ui`](https://registry.npmjs.org/@calcom%2Fcal-sans-ui) · [`cal-sans`](https://registry.npmjs.org/cal-sans) · [`@fontsource/cal-sans`](https://registry.npmjs.org/@fontsource%2Fcal-sans) · [Fontsource API](https://api.fontsource.org/v1/fonts/cal-sans) · [Google Fonts css2](https://fonts.googleapis.com/css2?family=Cal+Sans)
- Paper Mono: [repo](https://github.com/paper-design/paper-mono) · [`OFL.txt`](https://github.com/paper-design/paper-mono/blob/9fbc4d9877798252494ad517a5db9ee89f4fd972/OFL.txt) · [`LICENSE.txt`](https://github.com/paper-design/paper-mono/blob/9fbc4d9877798252494ad517a5db9ee89f4fd972/LICENSE.txt) · [`AUTHORS.txt`](https://github.com/paper-design/paper-mono/blob/9fbc4d9877798252494ad517a5db9ee89f4fd972/AUTHORS.txt) · [`readme.md`](https://github.com/paper-design/paper-mono/blob/9fbc4d9877798252494ad517a5db9ee89f4fd972/readme.md) · [releases v0.100/v0.320](https://github.com/paper-design/paper-mono/releases) · Fontsource API 404 (`/v1/fonts/paper-mono`) · Google Fonts css2 HTTP 400
- Raya: [`registry.json`](https://github.com/AltManic/raya/blob/research/coss-fonts/registry.json) (`raya-fonts` item) · [`registry/default/styles/raya-fonts.css`](https://github.com/AltManic/raya/blob/research/coss-fonts/registry/default/styles/raya-fonts.css) · [`src/lib/model/export.ts`](https://github.com/AltManic/raya/blob/research/coss-fonts/src/lib/model/export.ts) · BUILD-SPEC.md §1, §4, §7 (local, read-only)
- Tooling/docs: [Vite — Static Asset Handling](https://vite.dev/guide/assets) · [Next.js font module](https://nextjs.org/docs/app/api-reference/components/font) · [shadcn registry-item.json](https://ui.shadcn.com/docs/registry/registry-item-json) · [SIL OFL 1.1](https://openfontlicense.org)
