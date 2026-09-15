import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function InputGroup({ className, ...props }: ComponentProps<"div">) { return <div data-slot="input-group" className={cn("flex w-full items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring/30", className)} {...props} /> }
export function InputGroupAddon({ className, ...props }: ComponentProps<"div">) { return <div data-slot="input-group-addon" className={cn("flex shrink-0 items-center px-3 text-sm text-muted-foreground", className)} {...props} /> }
export function InputGroupInput({ className, ...props }: ComponentProps<"input">) { return <input data-slot="input-group-input" className={cn("min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground", className)} {...props} /> }
