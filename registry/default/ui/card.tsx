import type { ComponentProps } from "react"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card" className={cx("raya-card", className)} {...props} />
}

export function CardTitle({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-title" className={cx("raya-card-title", className)} {...props} />
}

export function CardDescription({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-description" className={cx("raya-card-description", className)} {...props} />
}

export function CardAction({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-action" className={cx("ml-auto self-start", className)} {...props} />
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-content" className={cx("flex flex-col gap-2", className)} {...props} />
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cx("flex items-center justify-end gap-2", className)} {...props} />
}
