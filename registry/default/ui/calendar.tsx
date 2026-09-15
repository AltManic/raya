"use client"

import { useEffect, useState } from "react"
import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function Calendar({ className, initialDate = new Date(2026, 8, 1), selectedDay: selectedDayProp, onSelect, ...props }: Omit<ComponentProps<"div">, "onSelect"> & { initialDate?: Date; selectedDay?: number | null; onSelect?: (date: Date) => void }) {
  const [month, setMonth] = useState(initialDate.getMonth())
  const [year, setYear] = useState(initialDate.getFullYear())
  const [selectedDay, setSelectedDay] = useState<number | null>(selectedDayProp ?? 15)
  useEffect(() => {
    if (selectedDayProp !== undefined) setSelectedDay(selectedDayProp)
  }, [selectedDayProp])
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(year, month, 1))
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const goToMonth = (offset: number) => {
    const next = new Date(year, month + offset, 1)
    setYear(next.getFullYear())
    setMonth(next.getMonth())
    setSelectedDay(null)
  }
  const days = ["S", "M", "T", "W", "T", "F", "S"]
  return <div role="group" aria-label="Calendar" data-slot="calendar" className={cn("w-72 rounded-lg border border-border bg-card p-3 text-card-foreground", className)} {...props}><div className="mb-3 flex items-center justify-between"><button type="button" aria-label="Previous month" onClick={() => goToMonth(-1)} className="rounded p-1 text-muted-foreground hover:bg-accent">‹</button><span aria-live="polite" className="text-sm font-medium">{monthLabel} {year}</span><button type="button" aria-label="Next month" onClick={() => goToMonth(1)} className="rounded p-1 text-muted-foreground hover:bg-accent">›</button></div><div role="grid" className="grid grid-cols-7 gap-1 text-center text-xs"><div className="contents text-muted-foreground">{days.map((day, index) => <span role="columnheader" key={`${day}-${index}`} className="py-1 font-medium">{day}</span>)}</div>{Array.from({ length: firstDay }, (_, index) => <span aria-hidden="true" key={`empty-${index}`} />)}{Array.from({ length: daysInMonth }, (_, index) => { const day = index + 1; const selected = day === selectedDay; return <button key={day} type="button" role="gridcell" aria-selected={selected} aria-label={`${monthLabel} ${day}, ${year}`} onClick={() => { setSelectedDay(day); onSelect?.(new Date(year, month, day)) }} className={cn("rounded p-1.5 text-sm hover:bg-accent", selected && "bg-primary font-medium text-primary-foreground")}>{day}</button> })}</div></div>
}
