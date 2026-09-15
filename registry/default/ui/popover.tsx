"use client"

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import type { ComponentProps } from "react"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export const Popover = PopoverPrimitive.Root

export function PopoverTrigger({ className, ...props }: ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" className={cx("", className)} {...props} />
}

export function PopoverContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "center",
  children,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Popup> & Pick<ComponentProps<typeof PopoverPrimitive.Positioner>, "side" | "sideOffset" | "align">) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner side={side} sideOffset={sideOffset} align={align} className="z-50">
        <PopoverPrimitive.Popup data-slot="popover-content" className={cx("raya-popover-content raya-select-content font-[family-name:var(--font-sans)] text-sm", className)} {...props}>
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}
