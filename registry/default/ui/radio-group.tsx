import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import type { ComponentProps } from "react"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export const RadioGroup = RadioGroupPrimitive

export function Radio({ className, ...props }: Omit<ComponentProps<typeof RadioPrimitive.Root>, "className"> & { className?: string }) {
  return (
    <RadioPrimitive.Root data-slot="radio" className={cx("raya-radio", className)} {...props}>
      <RadioPrimitive.Indicator data-slot="radio-indicator" className="raya-radio-indicator" />
    </RadioPrimitive.Root>
  )
}
