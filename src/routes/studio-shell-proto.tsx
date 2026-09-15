/*
 * COSS-style Studio shell and component documentation surface.
 * Route: /studio-shell-proto?variant=A|B|C|D&prototype=true (prototype switcher is opt-in)
 * The variants remain available as a local layout workbench.
 *
 * Variants differ only in the tuner's home:
 *   A — the docs right rail becomes the tuner ("On this page" moves to a tab)
 *   B — tuner in a slide-over over untouched docs chrome
 *   C — tuner docked inline under the header, pushing the page
 *   D — a Browse / Tune mode switch, Tune swapping the docs world for a workbench
 */
import { lazy, Suspense, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { createFileRoute, useLocation } from "@tanstack/react-router"
import { PrototypeSwitcher } from "@/components/prototype-switcher"
const ExportSlideOver = lazy(() => import("@/components/studio/export-panel").then((module) => ({ default: module.ExportSlideOver })))
import { FocusPreview } from "@/components/studio/canvas"
import { COMPONENT_DESCRIPTIONS, COMPONENT_GROUPS, COMPONENT_NAMES, HOOKS } from "@/lib/model/components"
import { KNOBBED_COMPONENTS, type Knobs } from "@/lib/model/model"
import type { Studio } from "@/lib/studio/use-studio"
import { useStudio } from "@/lib/studio/use-studio"
import { Button } from "@/registry/default/ui/coss-button"
import { Card, CardFrame, CardPanel } from "@/registry/default/ui/coss-card"
import { Field, FieldControl, FieldDescription, FieldLabel } from "@/registry/default/ui/coss-field"
import { Input } from "@/registry/default/ui/coss-input"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/registry/default/ui/breadcrumb"
import { Command } from "@/registry/default/ui/command"
import { useCopyToClipboard } from "@/registry/default/hooks/use-copy-to-clipboard"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

const VARIANTS = [
  {
    key: "A",
    name: "Tuner in the TOC rail",
    idea: "coss's right rail is repurposed: it opens as the tuner, with “On this page” one tab away.",
    tradeoffs: [
      "Tuner is one glance away while you browse — nothing is covered.",
      "The TOC is demoted to a tab; at 288px the swatch grid and knobs get cramped.",
      "No overlay, but the docs shell's calmest surface is now the busiest one.",
    ],
  },
  {
    key: "B",
    name: "Slide-over tuner",
    idea: "The docs chrome stays exactly coss's; a Tune button in the header slides the tuner over the right side.",
    tradeoffs: [
      "Most honest docs page — nothing about the layout changes until you tune.",
      "The panel covers the TOC and the preview you are tuning; open/close churn.",
      "Two right-side surfaces (TOC rail, slide-over) compete for the same edge.",
    ],
  },
  {
    key: "C",
    name: "Inline dock",
    idea: "A collapsible tuner strip rides under the header, inside the content column, pushing the page down when open.",
    tradeoffs: [
      "Tuner and preview coexist with nothing covered; collapsed it is one thin row.",
      "Always costs vertical space; the docs page is never fully “clean”.",
      "Controls want a vertical column, a dock wants a horizontal row — the expanded grid fights this.",
    ],
  },
  {
    key: "D",
    name: "Tune mode",
    idea: "A Browse / Tune switch in the header. Tune replaces the docs world with a wide workbench: tuner left, previews right.",
    tradeoffs: [
      "Roomiest tuning surface, and Browse mode stays a pristine docs page.",
      "A context switch, not a panel: you leave the docs metaphor to tune.",
      "Two layouts to build and maintain (and two states to keep consistent).",
    ],
  },
] as const

export const Route = createFileRoute("/studio-shell-proto")({
  head: () => ({
    meta: [
      { title: "Raya Docs — COSS-aligned components" },
      { name: "description", content: "Browse, preview, tune, and install Raya's COSS-aligned component registry." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    variant: typeof search.variant === "string" ? search.variant.toUpperCase() : "A",
    component: typeof search.component === "string" && COMPONENT_NAMES.some((name) => name === search.component) ? search.component : undefined,
    prototype: search.prototype === "true" || search.prototype === true,
    catalog: search.catalog === "true" || search.catalog === true,
  }),
  component: StudioShellProto,
})

function StudioShellProto() {
  const studio = useStudio()
  const { variant: requested, component: requestedComponent, prototype, catalog } = Route.useSearch()
  const navigate = Route.useNavigate()
  const variant = VARIANTS.find((v) => v.key === requested) ?? VARIANTS[0]
  const [selected, setSelected] = useState(requestedComponent ?? "button")
  const [tuneOpen, setTuneOpen] = useState(false)
  const [dockOpen, setDockOpen] = useState(false)
  const [tuneMode, setTuneMode] = useState(false)

  useEffect(() => {
    setTuneOpen(false)
  }, [variant.key])

  useEffect(() => {
    if (requestedComponent) setSelected(requestedComponent)
  }, [requestedComponent])

  useEffect(() => {
    document.title = catalog ? "Raya UI — COSS-aligned components" : `Raya Docs — ${selected}`
  }, [catalog, selected])

  const setVariant = (key: string) => {
    void navigate({ search: { variant: key, component: selected, prototype, catalog: false }, replace: true })
  }
  const selectComponent = (component: string) => {
    setSelected(component)
    void navigate({ search: { variant: variant.key, component, prototype, catalog: false }, replace: true })
  }

  return (
    <div
      className={cx(
        "coss-theme relative isolate flex min-h-svh flex-col overflow-clip bg-sidebar font-sans text-foreground [--header-height:4rem]",
        studio.dark && "dark",
      )}
    >
      <Rails />
      <SiteHeader
        studio={studio}
        onSelect={selectComponent}
        right={
          <>
            {variant.key === "B" && (
              <Button size="sm" variant="outline" onClick={() => setTuneOpen((o) => !o)}>
                {tuneOpen ? "Close tune" : "Tune"}
              </Button>
            )}
            {variant.key === "D" && <ModeSwitch tune={tuneMode} onChange={setTuneMode} />}
          </>
        }
      />
      {catalog ? (
        <CatalogPage />
      ) : variant.key === "D" && tuneMode ? (
        <TuneWorkbench studio={studio} selected={selected} onSelect={selectComponent} variant={variant} />
      ) : (
            <DocsShell
              studio={studio}
              variant={variant}
              selected={selected}
              onSelect={selectComponent}
          dockOpen={dockOpen}
          setDockOpen={setDockOpen}
        />
      )}
      <SlideOverTuner studio={studio} open={variant.key === "B" && tuneOpen} onClose={() => setTuneOpen(false)} />
      {studio.exportOpen && <Suspense fallback={null}><ExportSlideOver studio={studio} /></Suspense>}
      <footer className="border-t border-border/64 bg-sidebar/60 px-4 py-8 text-xs text-muted-foreground sm:px-6">
        <div className="coss-container flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>Raya is a COSS-aligned studio for tuning and owning your components.</p>
          <nav aria-label="Footer" className="flex items-center gap-3">
            <a href="/ui/docs" className="hover:text-foreground">Docs</a>
            <a href="/ui" className="hover:text-foreground">Components</a>
            <a href="/r/registry.json" className="hover:text-foreground">Registry</a>
            <a href="/" className="hover:text-foreground">Studio</a>
          </nav>
        </div>
      </footer>
      {prototype && <PrototypeSwitcher
          variants={VARIANTS.map(({ key, name }) => ({ key, name }))}
          current={variant.key}
          onSelect={setVariant}
        />}
    </div>
  )
}

/* ------------------------------------------------------------------ chrome */

export function Rails() {
  return (
    <>
      <div
        aria-hidden="true"
        className="coss-container pointer-events-none absolute inset-0 z-[45] before:absolute before:inset-y-0 before:-left-3 before:w-px before:bg-border/64 after:absolute after:inset-y-0 after:-right-3 after:w-px after:bg-border/64"
      />
      <div
        aria-hidden="true"
        className="coss-container pointer-events-none fixed inset-0 z-[45] before:absolute before:top-[calc(var(--header-height)-4.5px)] before:-left-[11.5px] before:size-2 before:rounded-[2px] before:border before:border-border before:bg-popover after:absolute after:top-[calc(var(--header-height)-4.5px)] after:-right-[11.5px] after:size-2 after:rounded-[2px] after:border after:border-border after:bg-background"
      />
    </>
  )
}

export function SiteHeader({ studio, right, onSelect }: { studio: Studio; right?: ReactNode; onSelect?: (component: string) => void }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const { pathname } = useLocation()
  const isCurrent = (path: string) => pathname === path || pathname.startsWith(`${path}/`)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === "Escape") setSearchOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])
  return (
    <header className="sticky top-0 z-40 w-full bg-sidebar/80 backdrop-blur-sm before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border/64">
      <a href="#components" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:text-foreground focus:shadow-lg">
        Skip to components
      </a>
      <div className="coss-container relative flex h-(--header-height) items-center justify-between gap-2">
        <div className="flex shrink-0 items-center gap-2.5">
          <a href="/" className="font-heading text-2xl font-bold tracking-tight hover:opacity-80">raya</a>
          <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">studio</span>
        </div>
        <nav aria-label="Primary" className="hidden items-center gap-1 text-sm text-muted-foreground sm:flex">
          <a href="/ui/docs" aria-current={isCurrent("/ui/docs") ? "page" : undefined} className="rounded-md px-2.5 py-1.5 hover:bg-accent hover:text-accent-foreground">Docs</a>
          <a href="/ui" aria-current={pathname === "/ui" ? "page" : undefined} className="rounded-md px-2.5 py-1.5 hover:bg-accent hover:text-accent-foreground">Components</a>
          <a href="/ui/particles" aria-current={isCurrent("/ui/particles") ? "page" : undefined} className="rounded-md px-2.5 py-1.5 hover:bg-accent hover:text-accent-foreground">Particles</a>
          <a href="https://github.com/AltManic/raya" target="_blank" rel="noreferrer" className="rounded-md px-2.5 py-1.5 hover:bg-accent hover:text-accent-foreground">GitHub</a>
        </nav>
        <details className="relative sm:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Menu</summary>
          <nav aria-label="Mobile primary" className="absolute right-0 top-10 z-50 flex min-w-44 flex-col gap-1 rounded-lg border border-border bg-popover p-1 text-sm text-popover-foreground shadow-lg">
            <a href="/ui/docs" aria-current={isCurrent("/ui/docs") ? "page" : undefined} className="rounded-md px-3 py-2 hover:bg-accent">Docs</a>
            <a href="/ui" aria-current={pathname === "/ui" ? "page" : undefined} className="rounded-md px-3 py-2 hover:bg-accent">Components</a>
            <a href="/ui/particles" aria-current={isCurrent("/ui/particles") ? "page" : undefined} className="rounded-md px-3 py-2 hover:bg-accent">Particles</a>
            <a href="/ui/docs/get-started" className="rounded-md px-3 py-2 hover:bg-accent">Get started</a>
            <a href="/ui/docs/roadmap" className="rounded-md px-3 py-2 hover:bg-accent">Roadmap</a>
            <a href="/ui/docs/radix-shadcn-migration" className="rounded-md px-3 py-2 hover:bg-accent">Migration</a>
            <a href="/r/registry.json" className="rounded-md px-3 py-2 hover:bg-accent">Registry</a>
            <a href="https://github.com/AltManic/raya" target="_blank" rel="noreferrer" className="rounded-md px-3 py-2 hover:bg-accent">GitHub</a>
          </nav>
        </details>
        <Button size="sm" variant="outline" className="hidden sm:inline-flex" onClick={() => setSearchOpen(true)}>
          Search components <span className="ml-2 text-[10px] text-muted-foreground">⌘K</span>
        </Button>
        <Button size="icon" variant="outline" className="sm:hidden" aria-label="Search components" onClick={() => setSearchOpen(true)}>
          ⌕
        </Button>
        <div className="ms-auto flex items-center gap-2">
          <label className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            System
            <select
              className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground"
              value={studio.activeSlug}
              onChange={(e) => studio.setActive(e.target.value)}
            >
              {studio.systems.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          {right}
          <Button
            size="icon"
            variant="ghost"
            aria-label="Toggle dark mode"
            onClick={() => studio.setDark(!studio.dark)}
          >
            {studio.dark ? "☾" : "☀"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => studio.setExportOpen(true)}>
            Export
          </Button>
        </div>
      </div>
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/60 px-4 pt-[12vh] backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div onClick={(event) => event.stopPropagation()}>
            <Command items={COMPONENT_NAMES} onSelect={(component) => { onSelect?.(component); setSearchOpen(false) }} />
          </div>
        </div>
      )}
    </header>
  )
}

export function SiteFooter() {
  return <footer className="border-t border-border/64 bg-sidebar/60 px-4 py-8 text-xs text-muted-foreground sm:px-6"><div className="coss-container flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p>Raya is a COSS-aligned studio for tuning and owning your components.</p><nav aria-label="Footer" className="flex items-center gap-3"><a href="/ui/docs" className="hover:text-foreground">Docs</a><a href="/ui" className="hover:text-foreground">Components</a><a href="/r/registry.json" className="hover:text-foreground">Registry</a><a href="/" className="hover:text-foreground">Studio</a></nav></div></footer>
}

function ModeSwitch({ tune, onChange }: { tune: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center rounded-md border border-border p-0.5 text-xs">
      {([false, true] as const).map((value) => (
        <button
          key={String(value)}
          type="button"
          onClick={() => onChange(value)}
          className={cx(
            "cursor-pointer rounded px-2.5 py-1 font-medium",
            tune === value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {value ? "Tune" : "Browse"}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------- docs shell */

export function CatalogPage() {
  return (
    <main id="components" className="coss-container flex w-full flex-1 flex-col px-4 py-12 sm:px-6 lg:py-16">
      <div className="max-w-2xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Raya UI</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Components for your next interface.</h1>
        <p className="mt-3 text-sm font-medium text-foreground">Built for developers and AI.</p>
        <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">Accessible, composable components built on Base UI and styled through Raya Systems. Browse a component, tune it, and copy the source into your app.</p>
      </div>
      <div className="mt-12 flex flex-col gap-10">
        {COMPONENT_GROUPS.map((group) => (
          <section key={group.title} aria-labelledby={`catalog-${group.title.toLowerCase()}`}>
            <h2 id={`catalog-${group.title.toLowerCase()}`} className="mb-3 border-b border-border pb-2 font-heading text-xl font-semibold">{group.title}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((component) => (
                <a key={component} href={`/ui/docs/components/${component}`} className="group rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-ring/60 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="font-medium group-hover:text-foreground">{component}</span>
                  <span className="mt-1 block text-sm leading-5 text-muted-foreground">{COMPONENT_DESCRIPTIONS[component]}</span>
                </a>
              ))}
            </div>
          </section>
        ))}
        <section aria-labelledby="catalog-hooks">
          <h2 id="catalog-hooks" className="mb-3 border-b border-border pb-2 font-heading text-xl font-semibold">Hooks</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {HOOKS.map((hook) => (
                <a key={hook.name} href={`/ui/docs/hooks/${hook.name}`} className="group rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-ring/60 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className="font-mono text-sm font-medium group-hover:text-foreground">{hook.title}</span>
                <span className="mt-1 block text-sm leading-5 text-muted-foreground">{hook.description}</span>
                <span className="mt-3 block text-xs text-muted-foreground">Read hook docs →</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

const NAV = COMPONENT_GROUPS.map(({ title: group, items }) => ({ group, items }))

export function SidebarNav({
  selected,
  onSelect,
  className,
}: {
  selected: string
  onSelect: (name: string) => void
  className?: string
}) {
  return (
    <aside
      className={cx(
        "sticky top-(--header-height) h-[calc(100svh-var(--header-height))] overflow-y-auto py-4 pe-4",
        className,
      )}
    >
      <nav className="flex flex-col gap-6">
        {NAV.map((group) => (
          <div key={group.group}>
            <p className="mb-1.5 px-2 text-xs font-medium text-sidebar-foreground/70">{group.group}</p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    className={cx(
                      "w-full cursor-pointer rounded-md px-2 py-1 text-left text-sm",
                      item === selected
                        ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}

function VariantNote({ variant, className }: { variant: (typeof VARIANTS)[number]; className?: string }) {
  return (
    <div className={cx("rounded-xl border border-dashed border-border bg-muted/50 p-4 text-xs leading-relaxed text-muted-foreground", className)}>
      <p className="mb-1 font-semibold uppercase tracking-wider text-foreground/80">
        Studio layout — variant {variant.key}: {variant.name}
      </p>
      <p>{variant.idea}</p>
      <ul className="mt-2 list-disc space-y-0.5 ps-4">
        {variant.tradeoffs.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  )
}

function DocsShell({
  studio,
  variant,
  selected,
  onSelect,
  dockOpen,
  setDockOpen,
}: {
  studio: Studio
  variant: (typeof VARIANTS)[number]
  selected: string
  onSelect: (name: string) => void
  dockOpen: boolean
  setDockOpen: (v: boolean) => void
}) {
  return (
    <main id="components" className="coss-container flex w-full flex-1 flex-col">
      <div className="px-4 pt-4 lg:hidden">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Component
          <select
            aria-label="Choose component"
            value={selected}
            onChange={(event) => onSelect(event.target.value)}
            className="min-w-0 flex-1 rounded-md border border-input bg-background px-2 py-2 text-sm text-foreground"
          >
            {COMPONENT_NAMES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="grid items-start lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_288px]">
        <SidebarNav selected={selected} onSelect={onSelect} className="hidden lg:block" />
        <div className="flex min-w-0 flex-col lg:mt-8 lg:mb-8">
          {variant.key === "C" && <InlineDock studio={studio} open={dockOpen} onToggle={() => setDockOpen(!dockOpen)} />}
          <VariantNote variant={variant} className="mx-4 mb-4 lg:mx-0" />
          <div className="relative flex min-w-0 flex-col">
            <CardFrame className="border-sidebar-border shadow-lg/5 max-lg:border-none dark:bg-background">
              <Card className="max-lg:rounded-none! dark:bg-background">
                <CardPanel className="px-4 py-6 sm:px-6 lg:p-8">
                  <div className="mx-auto w-full max-w-3xl">
                    <ComponentPage studio={studio} selected={selected} />
                  </div>
                </CardPanel>
              </Card>
            </CardFrame>
          </div>
        </div>
        <div className="sticky top-(--header-height) hidden h-[calc(100svh-var(--header-height))] flex-col overflow-hidden xl:flex">
          {variant.key === "A" ? (
            <RailTuner studio={studio} />
          ) : (
            <TocRail className="pt-4" />
          )}
        </div>
      </div>
    </main>
  )
}

/* --------------------------------------------------------------- content */

export function ComponentPage({ studio, selected }: { studio: Studio; selected: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 1600 })
  const description = COMPONENT_DESCRIPTIONS[selected] ?? "A component in Raya's COSS-aligned registry."
  const knobShape = KNOBBED_COMPONENTS.includes(selected as never)
    ? studio.active.knobs[selected as keyof Knobs]
    : undefined
  const apiAxes = knobShape && typeof knobShape === "object" ? Object.keys(knobShape).join(" · ") : "content and event props"
  return (
    <article className="flex flex-col gap-8">
      <header>
        <Breadcrumb className="mb-3">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/ui">Components</BreadcrumbLink><BreadcrumbSeparator /></BreadcrumbItem>
            <BreadcrumbItem><BreadcrumbPage>{selected}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="scroll-m-20 font-heading text-3xl font-bold xl:text-4xl">{selected}</h1>
        <p className="mt-2 text-muted-foreground sm:text-lg">{description}</p>
        <div className="mt-4 flex items-center gap-2">
          <Button size="xs" variant="outline" onClick={() => document.getElementById("api")?.scrollIntoView({ behavior: "smooth" })}>
            API reference
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => {
              copyToClipboard(`npx shadcn@latest add https://raya.alfrizk.dev/r/${selected}.json`)
            }}
          >
            {isCopied ? "Copied" : "Copy install command"}
          </Button>
        </div>
      </header>

      <Section id="preview" title="Preview">
        <div
          data-raya={studio.activeSlug}
          className={cx("rounded-xl border border-border bg-background p-6", studio.dark && "dark")}
        >
          <Preview selected={selected} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Preview is scoped to System <span className="font-medium text-foreground">{studio.active.name}</span> — the shell
          chrome around it wears coss's theme.
        </p>
      </Section>

      <Section id="usage" title="Usage">
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs leading-relaxed">
{`# shadcn-style install from raya's registry
npx shadcn@latest add @raya/${selected}

# or by URL
npx shadcn@latest add https://raya.alfrizk.dev/r/${selected}.json`}
        </pre>
      </Section>

      <Section id="tokens" title="Tokens in use">
        <div
          data-raya={studio.activeSlug}
          className={cx("grid grid-cols-3 gap-2 sm:grid-cols-4", studio.dark && "dark")}
        >
          {(["background", "foreground", "card", "primary", "secondary", "muted", "accent", "border"] as const).map(
            (token) => (
              <div key={token} className="flex flex-col gap-1.5 rounded-lg border border-border p-2">
                <span className="h-8 rounded border border-border/60" style={{ background: `var(--${token})` }} />
                <span className="truncate font-mono text-[10px] text-muted-foreground">--{token}</span>
              </div>
            ),
          )}
        </div>
      </Section>

      <Section id="api" title="API">
        <dl className="flex flex-col gap-3 text-sm">
          <div className="grid grid-cols-[8rem_1fr] gap-2">
            <dt className="font-mono text-xs text-muted-foreground">variant</dt>
            <dd>{apiAxes}</dd>
          </div>
          <div className="grid grid-cols-[8rem_1fr] gap-2">
            <dt className="font-mono text-xs text-muted-foreground">size</dt>
            <dd>System defaults with component-level overrides where declared.</dd>
          </div>
          <div className="grid grid-cols-[8rem_1fr] gap-2">
            <dt className="font-mono text-xs text-muted-foreground">props</dt>
            <dd>Base UI composition props plus the component’s native React attributes.</dd>
          </div>
        </dl>
      </Section>

      <nav aria-label="Component navigation" className="flex items-center justify-between border-t border-border pt-6 text-sm">
        {(() => {
          const index = COMPONENT_NAMES.indexOf(selected as never)
          const previous = index > 0 ? COMPONENT_NAMES[index - 1] : undefined
          const next = index >= 0 && index < COMPONENT_NAMES.length - 1 ? COMPONENT_NAMES[index + 1] : undefined
          return (
            <>
              {previous ? (
                <a href={`/ui/docs/components/${previous}`} className="group flex flex-col gap-1 rounded-md px-2 py-1 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="text-xs text-muted-foreground">Previous</span>
                  <span className="font-medium">← {previous}</span>
                </a>
              ) : <span />}
              {next ? (
                <a href={`/ui/docs/components/${next}`} className="group flex flex-col items-end gap-1 rounded-md px-2 py-1 text-right hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="text-xs text-muted-foreground">Next</span>
                  <span className="font-medium">{next} →</span>
                </a>
              ) : <span />}
            </>
          )
        })()}
      </nav>
    </article>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-3 border-b border-border pb-2 font-heading text-xl font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function Preview({ selected }: { selected: string }) {
  if (selected === "button") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="destructive-outline">Destructive outline</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add">
            +
          </Button>
          <Button loading>Deploy dashboard</Button>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          The loading state keeps an icon-library placeholder in the source package and resolves to a real spinner when installed.
        </p>
      </div>
    )
  }
  if (selected === "input") {
    return (
      <div className="flex max-w-md flex-col gap-5">
        <Input placeholder="Email address…" />
        <Field>
          <FieldLabel>Workspace name</FieldLabel>
          <FieldControl placeholder="signalpath" />
          <FieldDescription>Lowercase letters and dashes.</FieldDescription>
        </Field>
      </div>
    )
  }
  if (selected === "card") {
    return (
      <Card className="max-w-md">
        <CardPanel className="text-sm text-muted-foreground">
          A coss Card inside the content canvas. CardFrame clips nested cards in the real docs layout.
        </CardPanel>
      </Card>
    )
  }
  return <FocusPreview component={selected} />
}

/* ------------------------------------------------------------- TOC rail */

const TOC_ITEMS = [
  { url: "#preview", label: "Preview" },
  { url: "#usage", label: "Usage" },
  { url: "#tokens", label: "Tokens in use" },
  { url: "#api", label: "API" },
]

function TocRail({ className }: { className?: string }) {
  const [active, setActive] = useState("#preview")
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActive(`#${visible.target.id}`)
      },
      { rootMargin: "0% 0% -70% 0%" },
    )
    for (const item of TOC_ITEMS) {
      const el = document.getElementById(item.url.slice(1))
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div className={cx("flex flex-col gap-1 py-2 ps-6 pe-4 text-sm", className)}>
      <p className="flex h-7 items-center text-xs font-medium">On This Page</p>
      <div className="relative ms-3.5 flex flex-col gap-0.5 before:absolute before:inset-y-0 before:-left-3 before:w-px before:bg-border">
        {TOC_ITEMS.map((item) => (
          <a
            key={item.url}
            href={item.url}
            data-active={item.url === active}
            className="relative py-1 text-[.8125rem] leading-4.5 text-sidebar-foreground transition-colors before:absolute before:inset-y-px before:-left-3 before:w-px hover:text-foreground data-[active=true]:text-foreground data-[active=true]:before:w-0.5 data-[active=true]:before:bg-primary"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ the tuner */

const SEMANTIC_SWATCHES = [
  "background",
  "foreground",
  "card",
  "primary",
  "secondary",
  "muted",
  "accent",
  "destructive",
  "border",
  "input",
  "ring",
] as const

const FONTS = {
  sans: {
    "Inter Variable": ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
    "Space Grotesk Variable": ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
  },
  serif: {
    "Instrument Serif": ["Instrument Serif", "Georgia", "serif"],
  },
  mono: {
    "JetBrains Mono Variable": ["JetBrains Mono", "ui-monospace", "monospace"],
    "Geist Mono Variable": ["Geist Mono", "ui-monospace", "monospace"],
  },
} satisfies Record<"sans" | "serif" | "mono", Record<string, string[]>>

function TunerSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-border/70 py-4 first:pt-0 last:border-0 last:pb-0">
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </section>
  )
}

function Tuner({ studio, className }: { studio: Studio; className?: string }) {
  const { active } = studio
  const mode = studio.dark ? ("dark" as const) : ("light" as const)
  const ov = studio.overrides[active.slug]?.[mode] ?? {}
  const px = parseFloat(active.radius) * 16 || 0

  const setFont = (slot: "sans" | "serif" | "mono", display: string) => {
    const stack = (FONTS[slot] as Record<string, string[]>)[display]
    if (stack) studio.setFonts(slot, stack)
  }
  const fontName = (slot: keyof typeof FONTS) => (active.fonts[slot] ?? [])[0] ?? ""

  return (
    <div className={className ?? "flex flex-col"}>
      <TunerSection title="Accent ramp">
        <div className="flex flex-col gap-2">
          <label className="flex items-center justify-between gap-2 text-xs">
            Hue
            <input
              type="range"
              min={0}
              max={360}
              value={active.ramp.hue}
              onChange={(e) => studio.setRamp(Number(e.target.value), active.ramp.chroma)}
              className="w-32"
            />
          </label>
          <label className="flex items-center justify-between gap-2 text-xs">
            Chroma
            <input
              type="range"
              min={0}
              max={30}
              value={Math.round(active.ramp.chroma * 100)}
              onChange={(e) => studio.setRamp(active.ramp.hue, Number(e.target.value) / 100)}
              className="w-32"
            />
          </label>
          <div
            data-raya={active.slug}
            className={cx("mt-1 flex overflow-hidden rounded-md border border-border", studio.dark && "dark")}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className="h-5 flex-1" style={{ background: `var(--raya-accent-${i + 1})` }} />
            ))}
          </div>
        </div>
      </TunerSection>

      <TunerSection title="Semantic tokens">
        <div
          data-raya={active.slug}
          className={cx("grid grid-cols-4 gap-1.5", studio.dark && "dark")}
        >
          {SEMANTIC_SWATCHES.map((token) => (
            <label key={token} className="flex cursor-pointer flex-col items-center gap-1" title={`--${token}`}>
              <span
                className={cx("h-6 w-full rounded border", ov[token] ? "border-primary" : "border-border")}
                style={{ background: ov[token] ?? `var(--${token})` }}
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
      </TunerSection>

      <TunerSection title="Radius">
        <label className="flex items-center justify-between gap-2 text-xs">
          <code className="text-muted-foreground">--radius: {active.radius}</code>
          <input
            type="range"
            min={0}
            max={20}
            value={px}
            onChange={(e) => studio.setRadius(`${Number(e.target.value) / 16}rem`)}
            className="w-32"
          />
        </label>
      </TunerSection>

      <TunerSection title="Type">
        <div className="flex flex-col gap-2">
          {(["sans", "serif", "mono"] as const).map((slot) => (
            <label key={slot} className="flex items-center justify-between gap-2 text-xs">
              --font-{slot}
              <select
                className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                value={fontName(slot)}
                onChange={(e) => setFont(slot, e.target.value)}
              >
                {Object.keys(FONTS[slot]).map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </TunerSection>

      <TunerSection title="Component knobs">
        <div className="flex flex-col gap-2">
          <label className="flex items-center justify-between gap-2 text-xs">
            button.variant
            <select
              className="rounded-md border border-input bg-background px-2 py-1 text-xs"
              value={active.knobs.button.variant}
              onChange={(e) => studio.setKnob("button", { ...active.knobs.button, variant: e.target.value as never })}
            >
              {["default", "outline", "ghost", "destructive", "link"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center justify-between gap-2 text-xs">
            card.variant
            <select
              className="rounded-md border border-input bg-background px-2 py-1 text-xs"
              value={active.knobs.card.variant}
              onChange={(e) => studio.setKnob("card", { ...active.knobs.card, variant: e.target.value as never })}
            >
              {["plain", "outline", "elevated"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Under adopted coss components these per-component defaults are expected to die (#25 finding 6); they stay here
            so the tuning surface's real footprint is visible.
          </p>
        </div>
      </TunerSection>
    </div>
  )
}

/* ------------------------------------------------------ variant A: rail */

function RailTuner({ studio }: { studio: Studio }) {
  const [tab, setTab] = useState<"tune" | "toc">("tune")
  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-1 px-4 pt-4">
        {(["tune", "toc"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cx(
              "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium",
              tab === t ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t === "tune" ? "Tune" : "On this page"}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">{tab === "tune" ? <Tuner studio={studio} /> : <TocRail />}</div>
    </div>
  )
}

/* ------------------------------------------------- variant B: slide-over */

function SlideOverTuner({ studio, open, onClose }: { studio: Studio; open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-[380px] max-w-[90vw] flex-col border-l border-border bg-background shadow-2xl">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="font-heading text-sm font-semibold">Tune — {studio.active.name}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close tuner"
          className="cursor-pointer text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <Tuner studio={studio} />
      </div>
    </div>
  )
}

/* -------------------------------------------------- variant C: inline dock */

function InlineDock({ studio, open, onToggle }: { studio: Studio; open: boolean; onToggle: () => void }) {
  return (
    <div className="mx-4 mb-3 rounded-xl border border-border bg-card lg:mx-0 lg:mb-4">
      <div className="flex items-center gap-3 px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tune</span>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Hue
          <input
            type="range"
            min={0}
            max={360}
            value={studio.active.ramp.hue}
            onChange={(e) => studio.setRamp(Number(e.target.value), studio.active.ramp.chroma)}
            className="w-28"
          />
        </label>
        <label className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
          Radius
          <input
            type="range"
            min={0}
            max={20}
            value={parseFloat(studio.active.radius) * 16 || 0}
            onChange={(e) => studio.setRadius(`${Number(e.target.value) / 16}rem`)}
            className="w-28"
          />
        </label>
        <span className="ms-auto font-mono text-[11px] text-muted-foreground">{studio.active.name}</span>
        <button
          type="button"
          onClick={onToggle}
          className="cursor-pointer rounded-md border border-border px-2.5 py-1 text-xs hover:text-foreground"
        >
          {open ? "Collapse" : "Expand"}
        </button>
      </div>
      {open && (
        <div className="border-t border-border px-4 py-4">
          <Tuner studio={studio} className="grid gap-x-8 md:grid-cols-2 xl:grid-cols-3" />
        </div>
      )}
    </div>
  )
}

/* --------------------------------------------------- variant D: workbench */

function TuneWorkbench({
  studio,
  selected,
  onSelect,
  variant,
}: {
  studio: Studio
  selected: string
  onSelect: (name: string) => void
  variant: (typeof VARIANTS)[number]
}) {
  return (
    <main className="coss-container flex w-full flex-1 flex-col py-4">
      <VariantNote variant={variant} className="mb-4" />
      <div className="grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="sticky top-[calc(var(--header-height)+1rem)] max-h-[calc(100svh-var(--header-height)-2rem)] overflow-y-auto rounded-2xl border border-border bg-card p-4">
          <p className="mb-3 font-heading text-sm font-semibold">Tune — {studio.active.name}</p>
          <Tuner studio={studio} />
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {["button", "input", "card", "data-table", "kpi-card"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onSelect(c)}
                className={cx(
                  "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium",
                  c === selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div
            data-raya={studio.activeSlug}
            className={cx("rounded-xl border border-border bg-background p-8", studio.dark && "dark")}
          >
            <Preview selected={selected} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Workbench previews are System-scoped, side by side with the tuner — the docs shell is out of the way in this
            mode.
          </p>
        </div>
      </div>
    </main>
  )
}
