import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function Alert({ className, ...props }: ComponentProps<"div">) {
  return <div role="alert" data-slot="alert" className={cn("flex w-full gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm", className)} {...props} />
}

export function AlertTitle({ className, ...props }: ComponentProps<"h5">) {
  return <h5 data-slot="alert-title" className={cn("font-medium leading-none", className)} {...props} />
}

export function AlertDescription({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="alert-description" className={cn("text-sm text-muted-foreground [&_p]:leading-relaxed", className)} {...props} />
}
