import { useState } from "react"
import type { Studio } from "@/lib/studio/use-studio"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export function ExportSlideOver({ studio }: { studio: Studio }) {
  const [tab, setTab] = useState<"css" | "json">("css")
  const [copied, setCopied] = useState(false)
  if (!studio.exportOpen) return null

  const content = tab === "css" ? studio.exported.css : studio.exported.config
  const filename = tab === "css" ? `${studio.active.slug}.css` : `${studio.active.slug}.json`

  const copy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close export panel"
        className="absolute inset-0 bg-black/50"
        onClick={() => studio.setExportOpen(false)}
      />
      <aside className="relative z-10 flex h-full w-[36rem] max-w-[90vw] flex-col border-l border-border bg-card shadow-lg">
        <header className="flex items-center gap-3 border-b border-border px-4 py-3">
          <h2 className="font-[family-name:var(--font-sans)] text-sm font-semibold">Export — {studio.active.name}</h2>
          <div className="ml-auto flex items-center gap-1 rounded-md border border-border p-0.5">
            {(["css", "json"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cx(
                  "cursor-pointer rounded px-2.5 py-1 text-xs font-medium",
                  tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {filename}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={copy}
            className="cursor-pointer rounded-md border border-border px-2.5 py-1 text-xs hover:border-primary"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
          <button
            type="button"
            onClick={() => studio.setExportOpen(false)}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            ✕
          </button>
        </header>
        <pre className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed">{content}</pre>
        <footer className="border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
          Consumers: <code>npx shadcn add @raya/core @{studio.active.slug}</code>, then import per the item docs.
        </footer>
      </aside>
    </div>
  )
}
