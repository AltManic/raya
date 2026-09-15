"use client"

import { useCallback, useSyncExternalStore } from "react"

const BREAKPOINTS = { "2xl": 1536, "3xl": 1600, "4xl": 2000, lg: 1024, md: 800, sm: 640, xl: 1280 } as const
type Breakpoint = keyof typeof BREAKPOINTS
type BreakpointQuery = Breakpoint | `max-${Breakpoint}` | `${Breakpoint}:max-${Breakpoint}`
export type MediaQueryInput = { min?: Breakpoint | number; max?: Breakpoint | number; pointer?: "coarse" | "fine" }

const resolve = (value: Breakpoint | number, kind: "min" | "max") => {
  const px = typeof value === "number" ? value : BREAKPOINTS[value]
  return `(${kind}-width: ${kind === "max" ? px - 1 : px}px)`
}

function parseQuery(query: BreakpointQuery | MediaQueryInput | (string & {})) {
  if (typeof query !== "string") {
    const parts = []
    if (query.min != null) parts.push(resolve(query.min, "min"))
    if (query.max != null) parts.push(resolve(query.max, "max"))
    if (query.pointer) parts.push(`(pointer: ${query.pointer})`)
    return parts.join(" and ") || "(min-width: 0px)"
  }
  if (query.startsWith("(")) return query
  const parts = query.split(":").flatMap((segment) => segment.startsWith("max-") ? [resolve(segment.slice(4) as Breakpoint, "max")] : segment in BREAKPOINTS ? [resolve(segment as Breakpoint, "min")] : [])
  return parts.join(" and ") || query
}

export function useMediaQuery(query: BreakpointQuery | MediaQueryInput | (string & {})) {
  const mediaQuery = parseQuery(query)
  const subscribe = useCallback((callback: () => void) => {
    if (typeof window === "undefined") return () => {}
    const mql = window.matchMedia(mediaQuery)
    mql.addEventListener("change", callback)
    return () => mql.removeEventListener("change", callback)
  }, [mediaQuery])
  const getSnapshot = useCallback(() => typeof window !== "undefined" && window.matchMedia(mediaQuery).matches, [mediaQuery])
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

export function useIsMobile() {
  return useMediaQuery("max-md")
}
