import { Button as ButtonPrimitive } from "@base-ui/react/button"
import type { ComponentProps } from "react"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export function Button({ className, ...props }: ComponentProps<typeof ButtonPrimitive>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cx("raya-button", className)}
      {...props}
    />
  )
}
