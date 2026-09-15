import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function Pagination({ className, ...props }: ComponentProps<"nav">) { return <nav aria-label="Pagination" data-slot="pagination" className={cn("mx-auto flex w-full justify-center", className)} {...props} /> }
export function PaginationContent({ className, ...props }: ComponentProps<"ul">) { return <ul data-slot="pagination-content" className={cn("flex items-center gap-1", className)} {...props} /> }
export function PaginationItem({ className, ...props }: ComponentProps<"li">) { return <li data-slot="pagination-item" className={cn("", className)} {...props} /> }
export function PaginationLink({ className, isActive, ...props }: ComponentProps<"a"> & { isActive?: boolean }) { return <a aria-current={isActive ? "page" : undefined} data-slot="pagination-link" className={cn("inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm hover:bg-accent", isActive && "bg-accent font-medium", className)} {...props} /> }
