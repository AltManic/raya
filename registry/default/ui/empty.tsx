import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function Empty({ className, ...props }: ComponentProps<"section">) {
  return <section data-slot="empty" className={cn("flex min-h-48 w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center", className)} {...props} />
}

export function EmptyTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 data-slot="empty-title" className={cn("font-medium", className)} {...props} />
}

export function EmptyDescription({ className, ...props }: ComponentProps<"p">) {
  return <p data-slot="empty-description" className={cn("max-w-sm text-sm text-muted-foreground", className)} {...props} />
}
