"use client"

import { useEffect, useMemo, useState } from "react"
import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function Command({ items, className, onSelect, ...props }: Omit<ComponentProps<"div">, "onSelect"> & { items: string[]; onSelect?: (item: string) => void }) {
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const filtered = useMemo(() => items.filter((item) => item.toLowerCase().includes(query.toLowerCase())), [items, query])
  useEffect(() => setActiveIndex(0), [query])
  const selectActive = () => { if (filtered[activeIndex]) onSelect?.(filtered[activeIndex]) }
  return <div role="dialog" aria-modal="true" aria-label="Command menu" data-slot="command" className={cn("w-72 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl", className)} {...props}><input autoFocus aria-label="Search commands" aria-controls="command-results" aria-activedescendant={filtered[activeIndex] ? `command-option-${activeIndex}` : undefined} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (!filtered.length) return; if (event.key === "ArrowDown") { event.preventDefault(); setActiveIndex((index) => (index + 1) % filtered.length) } else if (event.key === "ArrowUp") { event.preventDefault(); setActiveIndex((index) => (index - 1 + filtered.length) % filtered.length) } else if (event.key === "Enter") { event.preventDefault(); selectActive() } }} placeholder="Type a command…" className="h-10 w-full border-b border-border bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground" /><div id="command-results" role="listbox" className="max-h-56 overflow-auto p-1">{filtered.length ? filtered.map((item, index) => <button id={`command-option-${index}`} key={item} type="button" role="option" aria-selected={index === activeIndex} onMouseEnter={() => setActiveIndex(index)} onClick={() => onSelect?.(item)} className={cn("block w-full rounded px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground", index === activeIndex && "bg-accent text-accent-foreground")}>{item}</button>) : <p className="p-3 text-sm text-muted-foreground">No commands found.</p>}</div></div>
}
