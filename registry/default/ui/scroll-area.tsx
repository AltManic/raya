import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function ScrollArea({ className, ...props }: ComponentProps<"div">) { return <div data-slot="scroll-area" className={cn("overflow-auto", className)} {...props} /> }
