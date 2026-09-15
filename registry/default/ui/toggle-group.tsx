"use client"

import { createContext, useContext, useState, type ComponentProps, type ReactNode } from "react"
import { cn } from "@/registry/default/lib/utils"

type ToggleGroupContextValue = { value?: string; setValue: (value: string) => void }
const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null)

export function ToggleGroup({ className, value, defaultValue, onValueChange, children, ...props }: ComponentProps<"div"> & { value?: string; defaultValue?: string; onValueChange?: (value: string) => void; children?: ReactNode }) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const activeValue = value ?? uncontrolledValue
  const setValue = (next: string) => { if (value === undefined) setUncontrolledValue(next); onValueChange?.(next) }
  return <ToggleGroupContext.Provider value={{ value: activeValue, setValue }}><div role="group" aria-label={props["aria-label"] ?? "Toggle options"} data-slot="toggle-group" className={cn("inline-flex items-center rounded-md border border-border p-1", className)} {...props}>{children}</div></ToggleGroupContext.Provider>
}

export function ToggleGroupItem({ className, value, defaultPressed = false, pressed, onClick, ...props }: ComponentProps<"button"> & { value?: string; defaultPressed?: boolean; pressed?: boolean }) {
  const context = useContext(ToggleGroupContext)
  const [uncontrolledPressed, setUncontrolledPressed] = useState(defaultPressed)
  const isPressed = context && value !== undefined ? context.value === value : pressed ?? uncontrolledPressed
  return <button type="button" aria-pressed={isPressed} data-state={isPressed ? "on" : "off"} data-slot="toggle-group-item" className={cn("inline-flex h-8 items-center justify-center rounded px-3 text-sm font-medium transition-colors hover:bg-accent data-[state=on]:bg-accent data-[state=on]:text-accent-foreground", className)} {...props} onClick={(event) => { onClick?.(event); if (context && value !== undefined) context.setValue(value); else if (pressed === undefined) setUncontrolledPressed((current) => !current) }} />
}
