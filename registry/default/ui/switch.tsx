"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import type { ComponentProps } from "react"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export const Switch = ({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) => (
  <SwitchPrimitive.Root data-slot="switch" className={cx("raya-switch", className)} {...props}>
    <SwitchPrimitive.Thumb data-slot="switch-thumb" className="raya-switch-thumb" />
  </SwitchPrimitive.Root>
)
