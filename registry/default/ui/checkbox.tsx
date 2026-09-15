"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import type { ComponentProps } from "react"

import { IconPlaceholder } from "@/registry/internal/icon-placeholder"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export const Checkbox = CheckboxPrimitive.Root

export function CheckboxIndicator({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Indicator>) {
  return (
    <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className={cx("inline-flex", className)} {...props}>
      <IconPlaceholder
        lucide="CheckIcon"
        tabler="IconCheck"
        hugeicons="Tick02Icon"
        phosphor="CheckIcon"
        remixicon="RiCheckLine"
        className="size-[0.75em]"
      />
    </CheckboxPrimitive.Indicator>
  )
}
