/*
 * PROTOTYPE (#26) — floating variant switcher for throwaway UI routes.
 * Not production. Hidden in production builds; drop from main with the prototype.
 */
import { useEffect } from "react"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export interface PrototypeVariant {
  key: string
  name: string
}

export function PrototypeSwitcher({
  variants,
  current,
  onSelect,
}: {
  variants: PrototypeVariant[]
  current: string
  onSelect: (key: string) => void
}) {
  const enabled = !import.meta.env.PROD
  const index = Math.max(0, variants.findIndex((v) => v.key === current))
  const cycle = (step: number) => {
    const next = variants[(index + step + variants.length) % variants.length]
    if (next) onSelect(next.key)
  }

  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return
      if (e.key === "ArrowRight") cycle(1)
      if (e.key === "ArrowLeft") cycle(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  if (!enabled) return null
  const active = variants[index]

  return (
    <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2">
      <div
        className={cx(
          "flex items-center gap-1 rounded-full border border-white/15 bg-neutral-900/95 px-1.5 py-1 text-white shadow-xl backdrop-blur",
          "font-sans text-xs",
        )}
      >
        <button
          type="button"
          aria-label="Previous variant"
          onClick={() => cycle(-1)}
          className="cursor-pointer rounded-full px-2.5 py-1 text-white/80 hover:bg-white/10 hover:text-white"
        >
          ←
        </button>
        <span className="min-w-[13rem] px-2 text-center">
          <span className="font-semibold uppercase tracking-wider text-white/60">proto</span>{" "}
          <span className="font-semibold">{active?.key}</span>
          <span className="text-white/70"> — {active?.name}</span>
        </span>
        <button
          type="button"
          aria-label="Next variant"
          onClick={() => cycle(1)}
          className="cursor-pointer rounded-full px-2.5 py-1 text-white/80 hover:bg-white/10 hover:text-white"
        >
          →
        </button>
      </div>
    </div>
  )
}
