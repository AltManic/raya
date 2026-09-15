"use client"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import type { ComponentProps } from "react"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export const DropdownMenu = MenuPrimitive.Root

export function DropdownMenuTrigger({ className, ...props }: ComponentProps<typeof MenuPrimitive.Trigger>) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" className={cx("", className)} {...props} />
}

export function DropdownMenuContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  ...props
}: ComponentProps<typeof MenuPrimitive.Popup> & Pick<ComponentProps<typeof MenuPrimitive.Positioner>, "side" | "sideOffset" | "align">) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner side={side} sideOffset={sideOffset} align={align} className="z-50">
        <MenuPrimitive.Popup data-slot="dropdown-menu-content" className={cx("raya-menu-content", className)} {...props} />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

export function DropdownMenuItem({ className, ...props }: ComponentProps<typeof MenuPrimitive.Item>) {
  return <MenuPrimitive.Item data-slot="dropdown-menu-item" className={cx("raya-menu-item cursor-pointer font-[family-name:var(--font-sans)]", className)} {...props} />
}

export function DropdownMenuGroup({ className, ...props }: ComponentProps<typeof MenuPrimitive.Group>) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" className={cx("", className)} {...props} />
}

export function DropdownMenuLabel({ className, ...props }: ComponentProps<typeof MenuPrimitive.GroupLabel>) {
  return <MenuPrimitive.GroupLabel data-slot="dropdown-menu-label" className={cx("raya-menu-group-label font-[family-name:var(--font-sans)]", className)} {...props} />
}

export function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cx("raya-menu-separator", className)} {...props} />
}
