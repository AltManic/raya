# Raya

A tunable design-system studio: browse live component previews, tune tokens and
component defaults into named Systems, and pull those components into your apps
through a shadcn-style Registry.

## Language

### Core concepts

**Studio**:
The Raya website (TanStack Start) where components are browsed, previewed, and tuned.
_Avoid_: playground, docs site, editor

**System**:
A named bundle of token values plus component knobs — e.g. "Terminal" or "Soft". There is exactly one component set; Systems restyle it.
_Avoid_: theme, skin, brand, preset

**Registry**:
The shadcn-style source distribution of components, served statically by the Studio at `/r/*.json` and consumed via the shadcn CLI.
_Avoid_: package, library, npm

**Component set**:
The single collection of components all Systems share. Components are never forked per System.
_Avoid_: kit, package

**Knob**:
A per-component tunable default recorded on a System — e.g. Button's default variant or size.
_Avoid_: prop override, setting, option

**Universal axes**:
The three knobs any component may declare — `variant`, `size`, `density`. Whether a component declares one is per-component; the axis names are shared vocabulary.
_Avoid_: global props, common options

**Component-specific knob**:
A knob only one component declares — e.g. Avatar's `shape`, data table's `zebra`.
_Avoid_: custom prop, extra setting

**Demo data**:
Hand-authored fixture data that renders the BI Pack previews in the Studio — one coherent fictional scenario, identical across Systems and modes. Distinct from the small example files shipped alongside Registry blocks.
_Avoid_: sample data, mock data, generated data

**Block**:
A precomposed section of several components shipped as one Registry item. The filter bar is v1's only block.
_Avoid_: template, layout, example

**BI Pack**:
The dashboard/analytics-flavoured members of the component set: data table, KPI cards, chart wrappers, filter bar.
_Avoid_: charts module, pro components

### Token anatomy

**Semantic tokens**:
The shadcn-named variables (`--primary`, `--card`, `--border`, …) every System defines; the compatibility contract with consuming apps. Semantic tokens are single opaque colors, never gradients.
_Avoid_: custom names for standard variables

**Primitive scales**:
The raw `--raya-*` color ramps semantic tokens reference; what the tuner slides. Namespaced so they never collide with shadcn names.
_Avoid_: palette, swatches

**Vocabulary**:
The fixed layer all Systems share: variable names, `.dark` convention, radius derivation, prefix rules. Values are per-System; the vocabulary is not.
_Avoid_: schema (overloaded), token spec

**Density**:
A per-component knob (size/density variants), not a global token. A global density multiplier may graduate later if needed.
_Avoid_: compact mode system-wide

### Fonts

**Built-in roster**:
The font families Raya ships; any System may point its font tokens at them. Small, curated, freely licensed.
_Avoid_: font pack, bundled fonts

**Bring-your-own font**:
A System referencing a family outside the built-in roster. Legal anywhere; previews fall back to the stack and Export explains self-hosting.
_Avoid_: custom fonts, font upload

### Export boundary

**Export**:
Emitting a System as the artifacts a consuming app drops in (its stylesheet plus configuration).
_Avoid_: build, publish, sync

**Light/Dark pair**:
Every System ships two modes selected by the standard `.dark` class convention; dark is never its own System.
_Avoid_: night mode system
