# COSS UI integration notes

Reviewed against the pinned COSS revision `e937becd2d5ffb5c621eed6f8b1f223cbb6051e7`.

## Findings

- The public COSS UI catalog describes the component set as Base UI-backed primitives and includes Calendar, Date Picker, Command, Segmented Control, and the other adopted surfaces. Source: [COSS UI catalog](https://coss.com/ui).
- Raya’s key ports use the same Base UI foundation and the repository is pinned to `@base-ui/react` `^1.8.0`, satisfying the integration audit’s Base UI requirement. Source: [Raya package manifest](../../package.json).
- COSS source imports are adapted into Raya’s shadcn-compatible registry paths. Raya keeps HugeIcons as its default icon library and uses an `IconPlaceholder` only where installed output must rewrite the icon implementation. Source: [Raya spinner port](../../registry/default/ui/coss-spinner.tsx), [Raya registry](../../registry.json).
- Composed items must declare internal registry dependencies. Date Picker declares Calendar, Popover, and Button, allowing a consumer to install it independently. Source: [Date Picker registry entry](../../registry.json#L289).
- Stateful ports need a client boundary for server-component consumers. Raya marks interactive components such as Calendar, Date Picker, Command, Toggle Group, and Segmented Control with `use client`. Source: [Raya interactive registry components](../../registry/default/ui).
- The registry round-trip is validated independently from the Studio build: all generated items are installed into the fixture, then typechecked and built. Source: [round-trip checker](../../tools/roundtrip-fixture/check.sh).

## Consumer contract

Consumers install `@raya/core` plus a component item through the shadcn CLI. Components use the generated Tailwind/theme bridge in `core.css`; a System stylesheet supplies token values. Registry items keep component dependencies separate from npm dependencies so composed items remain installable.

## Open decisions

The token vocabulary and the long-term System model remain product decisions tracked in GitHub Issues [#27](https://github.com/AltManic/raya/issues/27) and [#28](https://github.com/AltManic/raya/issues/28). This note records integration facts only and does not resolve those decisions.
