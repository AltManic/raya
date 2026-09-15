"use client"

import { useState, type ComponentProps, type MouseEvent } from "react"
import { cn } from "@/registry/default/lib/utils"

export function Toggle({ className, pressed, defaultPressed, onPressedChange, ...props }: ComponentProps<"button"> & { pressed?: boolean; defaultPressed?: boolean; onPressedChange?: (pressed: boolean) => void }) {
  const [uncontrolledPressed, setUncontrolledPressed] = useState(defaultPressed ?? false)
  const isPressed = pressed ?? uncontrolledPressed
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(event)
    const nextPressed = !isPressed
    if (pressed === undefined) setUncontrolledPressed(nextPressed)
    onPressedChange?.(nextPressed)
  }
  return <button type="button" aria-pressed={isPressed} data-state={isPressed ? "on" : "off"} data-slot="toggle" className={cn("inline-flex h-9 items-center justify-center rounded-md border border-transparent px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground", className)} {...props} onClick={handleClick} />
}
