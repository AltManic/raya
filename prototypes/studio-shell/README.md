# Prototype — Studio shell as coss's docs layout, tuner rehomed (#26)

Throwaway. Answers one question: **where does the token tuner live once the Studio wears coss's docs-site shell?**
Supporting question: which parts of coss's docs chrome survive contact with a live tuner, and does a docs-style Studio imply real docs content beyond previews?

Route: `/studio-shell-proto?variant=A|B|C|D`
Arrows (`←`/`→`) or the floating bottom pill switch variants. The pill is hidden in production builds.

## Run it

```bash
npm install
npm run dev
# → http://localhost:3000/studio-shell-proto?variant=A
```

## What is real here

- **The shell** reimplements coss's docs layout (`coss@e937bec`): `bg-sidebar` page tint, the 1416px container, the two 1px frame rails 12px outside the container edges, the two 8px notch markers at the header line, sticky header, 240px nav sidebar, background card in a `CardFrame`, sticky right rail with "On This Page".
- **The theme** is coss's real (MIT-published) token set, transcribed into `coss-theme.css` — light and dark, sidebar tokens, chart/info/success/warning. Not raya's Baseline look.
- **The components** in previews are `prototype/coss-components` ports (coss Button/Input/Field/Card, MIT surface) from #25.
- **The tuner** is raya's existing live model (`useStudio`): ramp, semantic overrides, radius, fonts, knobs. It still edits the active System.

## What is faked / deliberately rough

- Docs content is four stub sections (Preview, Usage, Tokens in use, API) — enough to give the TOC something real to track, not real documentation.
- Nav selects a component but only button/input/card have live previews.
- System management (create/duplicate/rename/delete) is reduced to the switcher; no persistence.
- No responsive mobile nav (coss has one; out of scope for the placement question).
- Fully synthetic: no tests, no error handling, no abstractions.

## Why the shell wears coss while previews wear the System

The map's destination says the Studio is "styled by coss's exact theme" and "Systems become token presets". So the shell chrome (header, rails, sidebar, content card, TOC) uses coss's tokens via `.coss-theme`; the preview surface alone carries `data-raya="<system>"`, so System switching still paints the component being inspected. An open consequence for #27: the Studio no longer repaints wholesale on System switch — only the preview does.

## The variants

| Key | Tuner home | One-line trade-off |
| --- | --- | --- |
| A | Docs right rail (TOC moves to a tab) | Always visible, never covers the preview; a 288px rail is cramped and the TOC is demoted. |
| B | Slide-over over untouched docs chrome | Most honest docs page; the panel covers what you're tuning and competes with the TOC edge. |
| C | Inline collapsible dock under the header | Tuner and preview coexist; always costs vertical space and a horizontal dock fights vertical controls. |
| D | Browse / Tune mode switch → full workbench | Roomiest tuning surface and a pristine browse mode; it leaves the docs metaphor and doubles the layout. |

Each variant renders its own note card above the content (variant D puts it at the top of the workbench).

## Provenance / licensing

`coss-theme.css` values come from coss's MIT surface only: `apps/ui/registry/registry-styles.ts` and `apps/ui/public/r/style.json` at `e937becd2d5ffb5c621eed6f8b1f223cbb6051e7`. The docs chrome is **reimplemented** from the layout's visual language, not copied — the coss docs wrappers are partly AGPL (`docs/research/coss-copy-audit.md`, sections 3–4). The 1416px container and the rail/notch geometry are re-expressed in raya's own classes (`.coss-container`).
