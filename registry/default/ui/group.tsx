import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function Group({ className, ...props }: ComponentProps<"div">) { return <div role="group" data-slot="group" className={cn("flex items-center gap-2", className)} {...props} /> }
