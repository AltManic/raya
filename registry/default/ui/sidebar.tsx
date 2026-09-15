import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function Sidebar({ className, ...props }: ComponentProps<"aside">) { return <aside data-slot="sidebar" className={cn("flex w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground", className)} {...props} /> }
export function SidebarHeader({ className, ...props }: ComponentProps<"div">) { return <div data-slot="sidebar-header" className={cn("border-b border-sidebar-border p-4", className)} {...props} /> }
export function SidebarContent({ className, ...props }: ComponentProps<"div">) { return <div data-slot="sidebar-content" className={cn("flex-1 space-y-1 overflow-auto p-3", className)} {...props} /> }
export function SidebarItem({ className, active, ...props }: ComponentProps<"button"> & { active?: boolean }) { return <button type="button" data-slot="sidebar-item" data-active={active || undefined} className={cn("flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", active && "bg-sidebar-accent font-medium text-sidebar-accent-foreground", className)} {...props} /> }
