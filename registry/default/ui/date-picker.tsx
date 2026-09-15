"use client"

import { useState } from "react"
import { Button } from "@/registry/default/ui/coss-button"
import { Calendar } from "@/registry/default/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/default/ui/popover"

export function DatePicker() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 8, 15))
  const [open, setOpen] = useState(false)
  const label = date ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date) : "Pick a date"
  return <Popover open={open} onOpenChange={setOpen}><PopoverTrigger render={<Button variant="outline">{label}</Button>} /><PopoverContent className="w-auto p-2"><Calendar initialDate={date ?? undefined} selectedDay={date?.getDate() ?? null} onSelect={(next) => { setDate(next); setOpen(false) }} /></PopoverContent></Popover>
}
