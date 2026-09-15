import { Button } from "@/registry/default/ui/coss-button"
import type { Studio } from "@/lib/studio/use-studio"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export function Header({ studio, onToggleRail }: { studio: Studio; onToggleRail?: () => void }) {
  return (
    <header className="relative z-10 flex min-h-16 items-center gap-3 border-b border-border/70 bg-sidebar/90 px-4 backdrop-blur-sm lg:px-6">
      <a href="/" className="font-heading text-2xl font-bold tracking-tight hover:opacity-80">raya</a>
      <span className="hidden rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground sm:inline">studio</span>
      <a href="/ui/docs" className="hidden text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline sm:inline">
        Docs
      </a>
      <a href="/ui" className="hidden text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline sm:inline">
        Components
      </a>
      <a href="/r/registry.json" className="hidden text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline sm:inline">
        Registry
      </a>
      <div className="mx-2 hidden items-center gap-1.5 md:flex">
        {studio.systems.map((s) => {
          const isActive = s.slug === studio.activeSlug
          return (
            <button
              key={s.slug}
              type="button"
              onClick={() => studio.setActive(s.slug)}
              onDoubleClick={() => studio.duplicateSystem(s.slug)}
              onContextMenu={(e) => {
                e.preventDefault()
                const name = window.prompt("Rename System", s.name)
                if (name) studio.renameSystem(s.slug, name)
              }}
              onClickCapture={(e) => {
                if (e.altKey && s.slug !== "baseline") {
                  e.preventDefault()
                  e.stopPropagation()
                  if (window.confirm(`Delete System "${s.name}"?`)) studio.deleteSystem(s.slug)
                }
              }}
              title={`${s.name} — double-click: duplicate · right-click: rename${s.slug !== "baseline" ? " · alt-click: delete" : ""}`}
              className={cx(
                "cursor-pointer rounded-md border px-3 py-1 text-xs font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {s.name}
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => {
            const name = window.prompt("New System name", "Soft")
            if (name) studio.createSystem(name)
          }}
          className="cursor-pointer rounded-md border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          +
        </button>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <select
          aria-label="Active System"
          className="max-w-28 rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground md:hidden"
          value={studio.activeSlug}
          onChange={(e) => studio.setActive(e.target.value)}
        >
          {studio.systems.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </select>
        {onToggleRail && <Button variant="ghost" size="sm" className="lg:hidden" onClick={onToggleRail}>Tune</Button>}
        <Button variant="ghost" size="icon" aria-label="Toggle dark mode" onClick={() => studio.setDark(!studio.dark)}>
          {studio.dark ? "☾" : "☀"}
        </Button>
        <Button variant="outline" size="sm" onClick={() => studio.setExportOpen(true)}>Export</Button>
      </div>
    </header>
  )
}
