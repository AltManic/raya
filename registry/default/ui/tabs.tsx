import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import type { ComponentProps } from "react"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export const Tabs = TabsPrimitive.Root

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List data-slot="tabs-list" className={cx("raya-tabs-list", className)} {...props} />
}

export function Tab({ className, ...props }: ComponentProps<typeof TabsPrimitive.Tab>) {
  return <TabsPrimitive.Tab data-slot="tab" className={cx("raya-tab", className)} {...props} />
}

export function TabPanel({ className, ...props }: ComponentProps<typeof TabsPrimitive.Panel>) {
  return (
    <TabsPrimitive.Panel
      data-slot="tab-panel"
      className={cx("font-[family-name:var(--font-sans)] text-sm text-foreground", className)}
      {...props}
    />
  )
}
