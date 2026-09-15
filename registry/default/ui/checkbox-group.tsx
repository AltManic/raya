import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function CheckboxGroup({ className, ...props }: ComponentProps<"div">) { return <div role="group" data-slot="checkbox-group" className={cn("flex flex-col gap-3", className)} {...props} /> }
