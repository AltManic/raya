import { Button } from "@/registry/default/ui/button"
import type { Studio } from "@/lib/studio/use-studio"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export function Header({ studio }: { studio: Studio }) {
  return (
    <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-2.5">
      <span className="font-[family-name:var(--font-serif)] text-lg tracking-tight">Raya</span>
      <div className="mx-2 flex items-center gap-1.5">
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
                "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors",
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
          className="cursor-pointer rounded-full border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          +
        </button>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button onClick={() => studio.setDark(!studio.dark)} style={{ paddingInline: "0.75rem" }}>
          {studio.dark ? "☾" : "☀"}
        </Button>
        <Button onClick={() => studio.setExportOpen(true)}>Export</Button>
      </div>
    </header>
  )
}
