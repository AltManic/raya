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

**BI Pack**:
The dashboard/analytics-flavoured members of the component set: data table, KPI cards, chart wrappers, filter bar.
_Avoid_: charts module, pro components

### Export boundary

**Export**:
Emitting a System as the artifacts a consuming app drops in (its stylesheet plus configuration).
_Avoid_: build, publish, sync

**Light/Dark pair**:
Every System ships two modes selected by the standard `.dark` class convention; dark is never its own System.
_Avoid_: night mode system
