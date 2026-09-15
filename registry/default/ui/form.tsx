import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function Form({ className, ...props }: ComponentProps<"form">) { return <form data-slot="form" className={cn("flex flex-col gap-5", className)} {...props} /> }
export function FormActions({ className, ...props }: ComponentProps<"div">) { return <div data-slot="form-actions" className={cn("flex items-center justify-end gap-2", className)} {...props} /> }
