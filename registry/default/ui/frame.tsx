import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function Frame({ className, ...props }: ComponentProps<"div">) { return <div data-slot="frame" className={cn("overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm", className)} {...props} /> }
export function FrameHeader({ className, ...props }: ComponentProps<"div">) { return <div data-slot="frame-header" className={cn("flex items-center justify-between border-b border-border px-4 py-3", className)} {...props} /> }
export function FrameContent({ className, ...props }: ComponentProps<"div">) { return <div data-slot="frame-content" className={cn("p-4", className)} {...props} /> }
