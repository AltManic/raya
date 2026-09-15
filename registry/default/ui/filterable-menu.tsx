"use client"

import { useEffect, useMemo, useState } from "react"
import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function FilterableMenu({ items, className, onSelect, ...props }: Omit<ComponentProps<"div">, "onSelect"> & { items: string[]; onSelect?: (item: string) => void }) {
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const filtered = useMemo(() => items.filter((item) => item.toLowerCase().includes(query.toLowerCase())), [items, query])
  useEffect(() => setActiveIndex(0), [query])
  const selectActive = () => { if (filtered[activeIndex]) onSelect?.(filtered[activeIndex]) }
  return <div role="dialog" aria-label="Filterable menu" data-slot="filterable-menu" className={cn("w-64 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md", className)} {...props}><input aria-label="Filter menu" aria-controls="filterable-menu-results" aria-activedescendant={filtered[activeIndex] ? `filterable-menu-option-${activeIndex}` : undefined} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (!filtered.length) return; if (event.key === "ArrowDown") { event.preventDefault(); setActiveIndex((index) => (index + 1) % filtered.length) } else if (event.key === "ArrowUp") { event.preventDefault(); setActiveIndex((index) => (index - 1 + filtered.length) % filtered.length) } else if (event.key === "Enter") { event.preventDefault(); selectActive() } }} placeholder="Filter actions…" className="mb-1 h-8 w-full rounded border-0 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground" />{filtered.length ? <div id="filterable-menu-results" role="listbox">{filtered.map((item, index) => <button id={`filterable-menu-option-${index}`} key={item} type="button" role="option" aria-selected={index === activeIndex} onMouseEnter={() => setActiveIndex(index)} onClick={() => onSelect?.(item)} className={cn("block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground", index === activeIndex && "bg-accent text-accent-foreground")}>{item}</button>)}</div> : <p className="p-2 text-sm text-muted-foreground">No actions found.</p>}</div>
}
