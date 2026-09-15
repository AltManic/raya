import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function Fieldset({ className, ...props }: ComponentProps<"fieldset">) { return <fieldset data-slot="fieldset" className={cn("flex min-w-0 flex-col gap-4 rounded-lg border border-border p-4", className)} {...props} /> }
export function FieldsetLegend({ className, ...props }: ComponentProps<"legend">) { return <legend data-slot="fieldset-legend" className={cn("-ml-1 px-1 text-sm font-medium", className)} {...props} /> }
