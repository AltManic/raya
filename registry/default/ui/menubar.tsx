import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function Menubar({ className, ...props }: ComponentProps<"div">) { return <div role="menubar" data-slot="menubar" className={cn("flex items-center gap-1 rounded-md border border-border bg-card p-1", className)} {...props} /> }
export function MenubarItem({ className, ...props }: ComponentProps<"button">) { return <button type="button" role="menuitem" data-slot="menubar-item" className={cn("rounded px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground", className)} {...props} /> }
