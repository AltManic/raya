import { useCallback, useMemo, useState } from "react"
import type { Knobs, SemanticToken, System } from "@/lib/model/model"
import { emitConfig, emitStylesheet } from "@/lib/model/export"
import * as storedSystems from "@/lib/systems"

const initial: System[] = Object.values(storedSystems)

export type Mode = "light" | "dark"

export interface StudioState {
  systems: System[]
  activeSlug: string
  dark: boolean
  view: "gallery" | "focus"
  focusComponent: string | null
  exportOpen: boolean
}

/** Inline overrides live on the canvas wrapper element — outranking every System scope. */
export interface Overrides {
  [slug: string]: Partial<Record<Mode, Partial<Record<SemanticToken, string>>> & { ramp?: Record<number, string> }>
}

export function useStudio() {
  const [systems, setSystems] = useState<System[]>(initial)
  const [activeSlug, setActive] = useState(initial[0].slug)
  const [dark, setDark] = useState(false)
  const [view, setView] = useState<"gallery" | "focus">("gallery")
  const [focusComponent, setFocusComponent] = useState<string | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [overrides, setOverrides] = useState<Overrides>({})

  const active = systems.find((s) => s.slug === activeSlug) ?? systems[0]

  const patchSystem = useCallback((slug: string, patch: (sys: System) => System) => {
    setSystems((prev) => prev.map((s) => (s.slug === slug ? patch(s) : s)))
  }, [])

  const setKnob = useCallback(
    <K extends keyof Knobs>(component: K, value: Knobs[K]) => {
      patchSystem(active.slug, (s) => ({ ...s, knobs: { ...s.knobs, [component]: value } }))
    },
    [active.slug, patchSystem],
  )

  const setRamp = useCallback(
    (hue: number, chroma: number) => patchSystem(active.slug, (s) => ({ ...s, ramp: { hue, chroma } })),
    [active.slug, patchSystem],
  )

  const setRadius = useCallback(
    (radius: string) => patchSystem(active.slug, (s) => ({ ...s, radius })),
    [active.slug, patchSystem],
  )

  const setFonts = useCallback(
    (slot: "sans" | "serif" | "mono", families: string[]) =>
      patchSystem(active.slug, (s) => ({ ...s, fonts: { ...s.fonts, [slot]: families } })),
    [active.slug, patchSystem],
  )

  const overrideToken = useCallback(
    (mode: Mode, token: SemanticToken, value: string | undefined) => {
      setOverrides((prev) => {
        const sys = { ...prev[active.slug] }
        const modes = { ...sys }
        const m = { ...(modes[mode] ?? {}) }
        if (value === undefined) delete m[token]
        else m[token] = value
        modes[mode] = m
        sys.light = modes.light
        sys.dark = modes.dark
        return { ...prev, [active.slug]: sys }
      })
    },
    [active.slug],
  )

  const saveOverrides = useCallback(() => {
    const ov = overrides[active.slug]
    if (!ov) return
    patchSystem(active.slug, (s) => ({
      ...s,
      light: { semantic: { ...s.light.semantic, ...(ov.light ?? {}) } },
      dark: { semantic: { ...s.dark.semantic, ...(ov.dark ?? {}) } },
    }))
    setOverrides((prev) => ({ ...prev, [active.slug]: {} }))
  }, [active.slug, overrides, patchSystem])

  const createSystem = useCallback(
    (name: string) => {
      let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "system"
      while (systems.some((s) => s.slug === slug)) slug = `${slug}-2`
      const copy: System = {
        ...structuredClone(active),
        slug,
        name,
        description: `Custom System based on ${active.name}.`,
        isDefault: undefined,
      }
      setSystems((prev) => [...prev, copy])
      setActive(slug)
    },
    [active, systems],
  )

  const duplicateSystem = useCallback(
    (slug: string) => {
      const src = systems.find((s) => s.slug === slug)
      if (!src) return
      let slugCopy = `${src.slug}-copy`
      while (systems.some((s) => s.slug === slugCopy)) slugCopy = `${slugCopy}-2`
      setSystems((prev) => [
        ...prev.map((s) => ({ ...s })),
        { ...structuredClone(src), slug: slugCopy, name: `${src.name} Copy`, isDefault: undefined },
      ])
    },
    [systems],
  )

  const renameSystem = useCallback(
    (slug: string, name: string) => patchSystem(slug, (s) => ({ ...s, name })),
    [patchSystem],
  )

  const deleteSystem = useCallback(
    (slug: string) => {
      if (slug === "baseline") return
      setSystems((prev) => prev.filter((s) => s.slug !== slug))
      setOverrides((prev) => {
        const next = { ...prev }
        delete next[slug]
        return next
      })
      if (slug === activeSlug) setActive("baseline")
    },
    [activeSlug],
  )

  const exported = useMemo(() => {
    const css = emitStylesheet({ ...active })
    const config = JSON.stringify(emitConfig(active), null, 2)
    return { css, config }
  }, [active])

  return {
    systems, active, activeSlug, dark, view, focusComponent, exportOpen, overrides,
    setActive, setDark, setView, setFocusComponent, setExportOpen,
    setKnob, setRamp, setRadius, setFonts,
    overrideToken, saveOverrides,
    createSystem, duplicateSystem, renameSystem, deleteSystem,
    exported,
  }
}

export type Studio = ReturnType<typeof useStudio>
