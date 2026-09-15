import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function Toolbar({ className, ...props }: ComponentProps<"div">) { return <div role="toolbar" data-slot="toolbar" className={cn("flex items-center gap-1 rounded-md border border-border bg-card p-1", className)} {...props} /> }
export function ToolbarSeparator({ className, ...props }: ComponentProps<"span">) { return <span aria-hidden="true" data-slot="toolbar-separator" className={cn("mx-1 h-5 w-px bg-border", className)} {...props} /> }
