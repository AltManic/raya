# Prototype: Studio theme-tuner UX (ticket #6)

**Question:** how does tuning *feel*? What does the user see while editing tokens
and knobs, how does live `data-raya` switching reflect across a gallery vs a
single focused component, and how is Export triggered?

## Run

Double-click `index.html`. No build, no deps, no persistence. (Google Fonts CDN
for the built-in roster faces; offline just falls back to system fonts.)

Flip variants with the floating bottom bar or `←` / `→` keys (also `?variant=A|B|C`).

## Variants — structurally different on purpose

| | Name | Layout | Knobs live… | Token editing | Export |
|---|---|---|---|---|---|
| A | Rail & Gallery | persistent left control rail + canvas | in the rail's "Component knobs" section; Focus mode shows them above the big instance | primitive ramp sliders (hue/chroma → 12 steps) + per-semantic override swatches + radius/shadow/type sections | header button → slide-over with `baseline.css` / `baseline.json` tabs |
| B | Canvas-first | full-bleed gallery, no rail | popover anchored to the clicked component | bottom dock trays: Color / Type / Shape / Shadow (+ Knobs tray) | ⌘K palette or header button → centered modal |
| C | Three-pane | systems column · big editor pane · preview column | hero stage above the live preview shows the focused component's knobs | same groups as A/B but one group at a time, generously sized | button → 2-step export wizard |

The interesting feedback is usually "A's rail with B's popovers" — say so.

## What's real vs sketch

- **Real to the decisions:** two demo Systems (`Baseline`, `Terminal`) as stored
  light+dark variable sets (#4); cascade order `:root/.dark` first,
  `[data-raya]`-scoped after (#5 finding); knob tables are #3's verbatim;
  fonts are the #8 roster; token edits apply as inline overrides so they beat
  every System scope and survive System/mode switches.
- **Sketch:** the CSS/JSON serialization in Export reads current computed
  values — the real emitter lands with the build. The ramp editor regenerates
  ramps from hue/chroma sliders rather than editing stored steps one by one.
  New-system flow, persistence, and the actual component set are out of scope.

Throwaway — do not promote to production code.
