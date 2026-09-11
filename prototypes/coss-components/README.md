# Prototype: coss components in raya (#25)

Throwaway artifacts proving how a coss ui component lands in raya: registry item → Studio
preview → System/dark switching → HugeIcons substitution → consumer build.

Pinned coss revision: `e937becd2d5ffb5c621eed6f8b1f223cbb6051e7`, copied only from the MIT
surface (`apps/ui/**`) per the copy-source audit (#22).

## Files

| File | What it is |
| --- | --- |
| `registry/default/lib/utils.ts` | coss's `cn` (clsx + tailwind-merge), shipped as the `utils` item |
| `registry/default/ui/coss-spinner.tsx` | coss Spinner, lucide icon authored as raya's `IconPlaceholder` (`hugeicons="Loading03Icon"`) |
| `registry/default/ui/coss-button.tsx` | coss Button (cva variants + `useRender`), depends on `coss-spinner` |
| `registry/default/ui/coss-input.tsx` | coss Input |
| `registry/default/ui/coss-field.tsx` | coss Field parts |
| `registry/default/ui/coss-card.tsx` | coss Card + CardFrame families |
| `registry/default/styles/core.css` | + `--font-heading` (the one bridge gap this slice needs) |
| `src/routes/coss-proto.tsx` | Studio-mounted demo route: `/coss-proto` |
| `registry.json` | six prototype items: `utils`, `coss-spinner`, `coss-button`, `coss-input`, `coss-field`, `coss-card` |

## Run

```sh
npm install
npm run dev
# → http://localhost:3000/coss-proto  (System switching + dark toggle in the header)
```

## Verify

```sh
npx shadcn registry validate
npx shadcn build        # emits public/r/coss-*.json
npm run typecheck
```

Findings and friction log: https://github.com/AltManic/raya/issues/25
