import type { HTMLAttributes } from "react"

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="skeleton" aria-hidden="true" className={["animate-pulse rounded-md bg-muted", className].filter(Boolean).join(" ")} {...props} />
}
