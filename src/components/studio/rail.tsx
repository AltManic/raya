import { useState } from "react"
import type { Knobs, SemanticToken } from "@/lib/model/model"
import { KNOBBED_COMPONENTS } from "@/lib/model/model"
import { COMPONENT_GROUPS } from "@/lib/model/components"
import type { Studio } from "@/lib/studio/use-studio"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

const SEMANTIC_SWATCHES: SemanticToken[] = [
  "background", "foreground", "card", "primary", "secondary", "muted",
  "accent", "destructive", "border", "input", "ring",
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-border px-4 py-3">
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </section>
  )
}

function ComponentNav({ studio, onSelect }: { studio: Studio; onSelect?: () => void }) {
  return (
    <Section title="Components">
      <nav className="flex flex-col gap-3">
        {COMPONENT_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="mb-1 px-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/75">{group.title}</p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => { studio.setView("focus"); studio.setFocusComponent(item); onSelect?.() }}
                  aria-current={studio.view === "focus" && studio.focusComponent === item ? "page" : undefined}
                  className={cx(
                    "cursor-pointer rounded-md px-2 py-1 text-left text-xs transition-colors hover:bg-sidebar-accent hover:text-foreground",
                    studio.view === "focus" && studio.focusComponent === item
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </Section>
  )
}

function RampControls({ studio }: { studio: Studio }) {
  const { active } = studio
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center justify-between gap-2 text-xs">
        Hue
        <input
          type="range" min={0} max={360}
          value={active.ramp.hue}
          onChange={(e) => studio.setRamp(Number(e.target.value), active.ramp.chroma)}
          className="w-36"
        />
      </label>
      <label className="flex items-center justify-between gap-2 text-xs">
        Chroma
        <input
          type="range" min={0} max={30} step={1}
          value={Math.round(active.ramp.chroma * 100)}
          onChange={(e) => studio.setRamp(active.ramp.hue, Number(e.target.value) / 100)}
          className="w-36"
        />
      </label>
      <div className="mt-1 flex overflow-hidden rounded-md border border-border">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="h-5 flex-1" style={{ background: `var(--raya-accent-${i + 1})` }} title={`--raya-accent-${i + 1}`} />
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">12-step accent ramp — seed sliders regenerate all steps live.</p>
    </div>
  )
}

function SemanticSwatches({ studio }: { studio: Studio }) {
  const mode = studio.dark ? ("dark" as const) : ("light" as const)
  const ov = studio.overrides[studio.activeSlug]?.[mode] ?? {}
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {SEMANTIC_SWATCHES.map((token) => (
        <label key={token} className="flex cursor-pointer flex-col items-center gap-1" title={`--${token}${ov[token] ? " · overridden" : ""}`}>
          <span
            className={cx("h-6 w-full rounded border", ov[token] ? "border-primary" : "border-border")}
            style={{
              background: ov[token] ?? `var(--${token})`,
              backgroundImage:
                ov[token]?.startsWith("var(") || ov[token]?.includes("gradient")
                  ? undefined
                  : undefined,
            }}
          />
          <input
            type="color"
            className="sr-only"
            value="#000000"
            onChange={(e) => studio.overrideToken(mode, token, e.target.value)}
          />
          <span className="max-w-full truncate text-[10px] text-muted-foreground">{token}</span>
        </label>
      ))}
    </div>
  )
}

function RadiusShadows({ studio }: { studio: Studio }) {
  const px = parseFloat(studio.active.radius) * 16 || 0
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center justify-between gap-2 text-xs">
        Radius <code className="text-muted-foreground">--radius: {studio.active.radius}</code>
        <input
          type="range" min={0} max={20} step={1}
          value={px}
          onChange={(e) => studio.setRadius(`${Number(e.target.value) / 16}rem`)}
          className="w-36"
        />
      </label>
    </div>
  )
}

function FontRoster({ studio }: { studio: Studio }) {
  const roster = {
    sans: ["Inter Variable", "Space Grotesk Variable"],
    serif: ["Instrument Serif"],
    mono: ["JetBrains Mono Variable", "Geist Mono Variable"],
  } as const
  const familyName = (value: string[]) => value[0] ?? ""
  const setSlot = (slot: "sans" | "serif" | "mono", display: string) => {
    const stacks: Record<string, string[]> = {
      "Inter Variable": ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      "Space Grotesk Variable": ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
      "Instrument Serif": ["Instrument Serif", "Georgia", "serif"],
      "JetBrains Mono Variable": ["JetBrains Mono", "ui-monospace", "monospace"],
      "Geist Mono Variable": ["Geist Mono", "ui-monospace", "monospace"],
    }
    studio.setFonts(slot, stacks[display])
  }
  return (
    <div className="flex flex-col gap-2">
      {(Object.keys(roster) as Array<keyof typeof roster>).map((slot: keyof typeof roster) => (
        <label key={slot} className="flex items-center justify-between gap-2 text-xs">
          --font-{slot}
          <select
            className="rounded-md border border-input bg-background px-2 py-1 text-xs"
            value={familyName(studio.active.fonts[slot] ?? [])}
            onChange={(e) => setSlot(slot, e.target.value)}
          >
            {roster[slot].map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </label>
      ))}
    </div>
  )
}

function KnobControl({ component, knob, value, options, onChange }: {
  component: string
  knob: string
  value: string | number | boolean
  options: readonly string[]
  onChange: (v: string) => void
}) {
  return (
    <label className="flex items-center justify-between gap-2 text-xs">
      <span className="text-muted-foreground">{knob}</span>
      <select
        className="rounded-md border border-input bg-background px-2 py-1 text-xs"
        value={String(value)}
        data-knob={`${component}.${knob}`}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}

const KNOB_OPTIONS: Record<keyof Knobs, Record<string, readonly string[]>> = {
  button: { variant: ["default", "outline", "ghost", "destructive", "link"], size: ["sm", "md", "lg"] },
  input: { size: ["sm", "md", "lg"] },
  textarea: { size: ["sm", "md", "lg"] },
  select: { variant: ["outline", "ghost"], size: ["sm", "md", "lg"] },
  checkbox: { size: ["sm", "md", "lg"] },
  switch: { size: ["sm", "md", "lg"] },
  "radio-group": { size: ["sm", "md", "lg"] },
  slider: { size: ["sm", "md", "lg"] },
  field: { size: ["sm", "md", "lg"] },
  card: { variant: ["plain", "outline", "elevated"], density: ["comfortable", "compact"] },
  badge: { variant: ["default", "secondary", "outline", "destructive"], size: ["sm", "md"] },
  avatar: { shape: ["circle", "rounded", "square"], size: ["sm", "md", "lg"] },
  tabs: { variant: ["underline", "pills", "enclosed"], size: ["sm", "md"] },
  dialog: { size: ["sm", "md", "lg"] },
  "dropdown-menu": { density: ["comfortable", "compact"] },
  tooltip: { variant: ["dark", "inverted"] },
  "data-table": { density: ["comfortable", "compact"], zebra: ["off", "on"] },
  "kpi-card": { variant: ["plain", "outline", "elevated"], density: ["comfortable", "compact"] },
  "chart-line": { legend: ["show", "hide"], grid: ["show", "hide"] },
  "chart-area": { legend: ["show", "hide"], grid: ["show", "hide"] },
  "chart-bar": { legend: ["show", "hide"], grid: ["show", "hide"] },
  "chart-pie": { variant: ["pie", "donut"] },
  "filter-bar": { density: ["comfortable", "compact"] },
}

function KnobsAccordion({ studio }: { studio: Studio }) {
  const [open, setOpen] = useState<string | null>("button")
  const knobs = studio.active.knobs
  return (
    <div className="flex flex-col">
      {KNOBBED_COMPONENTS.map((component) => {
        const axes = KNOB_OPTIONS[component]
        const isOpen = open === component
        return (
          <div key={component} className="border-b border-border/60 last:border-0">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : component)}
              className="flex w-full cursor-pointer items-center justify-between px-1 py-2 text-xs font-medium hover:text-foreground"
            >
              {component}
              <span className="text-muted-foreground">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div className="flex flex-col gap-1.5 pb-2 pl-1">
                {Object.keys(axes).map((axis) => (
                  <KnobControl
                    key={axis}
                    component={component}
                    knob={axis}
                    value={(knobs[component] as Record<string, string>)[axis]}
                    options={axes[axis]}
                    onChange={(v) => studio.setKnob(component, { ...(knobs[component] as object), [axis]: v } as never)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      )}
    </div>
  )
}

export function Rail({ studio, open = false, onClose }: { studio: Studio; open?: boolean; onClose?: () => void }) {
  const hasOverrides = Object.keys(studio.overrides[studio.activeSlug]?.light ?? {}).length > 0 ||
    Object.keys(studio.overrides[studio.activeSlug]?.dark ?? {}).length > 0
  return (
    <>
    {open && onClose && <button type="button" aria-label="Close token tuner" onClick={onClose} className="fixed inset-0 z-40 bg-black/20 lg:hidden" />}
    <aside className={cx(
      "w-72 shrink-0 overflow-y-auto border-r border-border/70 bg-sidebar",
      "hidden lg:block",
      open && "fixed inset-y-0 right-0 z-50 block shadow-xl lg:static lg:shadow-none",
    )}>
      {open && onClose && (
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/70 bg-sidebar px-4 py-3 lg:hidden">
          <span className="font-heading text-sm font-semibold">Tune System</span>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
            Close
          </button>
        </div>
      )}
      <ComponentNav studio={studio} onSelect={onClose} />
      <Section title="Accent ramp">
        <RampControls studio={studio} />
      </Section>
      <Section title="Semantic tokens">
        <SemanticSwatches studio={studio} />
        {hasOverrides && (
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={() => studio.saveOverrides()} className="cursor-pointer rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">
              Save into System
            </button>
            <button type="button" onClick={() => window.location.reload()} className="cursor-pointer rounded-md border border-border px-2 py-1 text-xs">
              Discard
            </button>
          </div>
        )}
      </Section>
      <Section title="Radius">
        <RadiusShadows studio={studio} />
      </Section>
      <Section title="Type">
        <FontRoster studio={studio} />
      </Section>
      <Section title="Component knobs">
        <KnobsAccordion studio={studio} />
      </Section>
    </aside>
    </>
  )
}
