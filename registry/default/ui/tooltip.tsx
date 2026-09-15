"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import type { ComponentProps } from "react"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export const TooltipProvider = TooltipPrimitive.Provider

export const Tooltip = TooltipPrimitive.Root

export function TooltipTrigger({ className, ...props }: ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" className={cx("", className)} {...props} />
}

export function TooltipContent({
  className,
  side = "top",
  sideOffset = 6,
  children,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Popup> & Pick<ComponentProps<typeof TooltipPrimitive.Positioner>, "side" | "sideOffset">) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner side={side} sideOffset={sideOffset} className="z-50">
        <TooltipPrimitive.Popup data-slot="tooltip-content" className={cx("raya-tooltip-content font-[family-name:var(--font-sans)]", className)} {...props}>
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}
