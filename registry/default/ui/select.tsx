import { Select as SelectPrimitive } from "@base-ui/react/select"
import type { ComponentProps } from "react"

import { IconPlaceholder } from "@/registry/internal/icon-placeholder"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export const Select = SelectPrimitive.Root

export function SelectTrigger({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cx("raya-select-trigger", className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <IconPlaceholder
            lucide="ChevronDownIcon"
            tabler="IconSelector"
            hugeicons="UnfoldMoreIcon"
            phosphor="CaretDownIcon"
            remixicon="RiArrowDownSLine"
            className="pointer-events-none opacity-60"
          />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

export function SelectValue({ className, ...props }: ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" className={cx("flex-1 text-left", className)} {...props} />
}

export function SelectContent({ className, side = "bottom", sideOffset = 6, ...props }: ComponentProps<typeof SelectPrimitive.Popup> & Pick<ComponentProps<typeof SelectPrimitive.Positioner>, "side" | "sideOffset">) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner side={side} sideOffset={sideOffset} className="z-50">
        <SelectPrimitive.Popup data-slot="select-content" className={cx("raya-select-content raya-menu-content", className)} {...props} />
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

export function SelectGroup({ className, ...props }: ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" className={cx("p-1", className)} {...props} />
}

export function SelectLabel({ className, ...props }: ComponentProps<typeof SelectPrimitive.GroupLabel>) {
  return <SelectPrimitive.GroupLabel data-slot="select-label" className={cx("raya-menu-group-label", className)} {...props} />
}

export function SelectItem({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cx("raya-menu-item justify-between", className)}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator render={<span className="flex items-center" />}>
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
          phosphor="CheckIcon"
          remixicon="RiCheckLine"
        />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}
