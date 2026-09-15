import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function Breadcrumb({ className, ...props }: ComponentProps<"nav">) { return <nav aria-label="Breadcrumb" data-slot="breadcrumb" className={cn("text-sm", className)} {...props} /> }
export function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) { return <ol data-slot="breadcrumb-list" className={cn("flex flex-wrap items-center gap-2 text-muted-foreground", className)} {...props} /> }
export function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) { return <li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-2", className)} {...props} /> }
export function BreadcrumbLink({ className, ...props }: ComponentProps<"a">) { return <a data-slot="breadcrumb-link" className={cn("transition-colors hover:text-foreground", className)} {...props} /> }
export function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) { return <span aria-current="page" data-slot="breadcrumb-page" className={cn("font-medium text-foreground", className)} {...props} /> }
export function BreadcrumbSeparator({ className, ...props }: ComponentProps<"span">) { return <span aria-hidden="true" data-slot="breadcrumb-separator" className={cn("text-muted-foreground/60", className)} {...props}>/</span> }
