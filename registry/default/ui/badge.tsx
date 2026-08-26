import type { ComponentProps } from "react"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export function Badge({ className, ...props }: ComponentProps<"span">) {
  return <span data-slot="badge" className={cx("raya-badge", className)} {...props} />
}
