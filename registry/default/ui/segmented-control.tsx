"use client"

import { createContext, useContext, useState, type ComponentProps, type ReactNode } from "react"
import { cn } from "@/registry/default/lib/utils"

type SegmentedControlContextValue = { value?: string; setValue: (value: string) => void }
const SegmentedControlContext = createContext<SegmentedControlContextValue | null>(null)

export function SegmentedControl({ className, value, defaultValue, onValueChange, children, ...props }: ComponentProps<"div"> & { value?: string; defaultValue?: string; onValueChange?: (value: string) => void; children?: ReactNode }) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const activeValue = value ?? uncontrolledValue
  const setValue = (next: string) => { if (value === undefined) setUncontrolledValue(next); onValueChange?.(next) }
  return <SegmentedControlContext.Provider value={{ value: activeValue, setValue }}><div role="group" aria-label={props["aria-label"] ?? "Segmented options"} data-slot="segmented-control" className={cn("inline-flex items-center rounded-md border border-border bg-muted p-1", className)} {...props}>{children}</div></SegmentedControlContext.Provider>
}

export function SegmentedControlItem({ className, value, pressed, defaultPressed = false, onPressedChange, onClick, ...props }: ComponentProps<"button"> & { value?: string; pressed?: boolean; defaultPressed?: boolean; onPressedChange?: (pressed: boolean) => void }) {
  const context = useContext(SegmentedControlContext)
  const [uncontrolledPressed, setUncontrolledPressed] = useState(defaultPressed)
  const isPressed = context && value !== undefined ? context.value === value : pressed ?? uncontrolledPressed
  return <button type="button" aria-pressed={isPressed} data-state={isPressed ? "on" : "off"} data-slot="segmented-control-item" className={cn("inline-flex h-8 items-center justify-center rounded px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm", className)} {...props} onClick={(event) => { onClick?.(event); const next = !isPressed; if (context && value !== undefined) context.setValue(value); else if (pressed === undefined) setUncontrolledPressed(next); onPressedChange?.(next) }} />
}
