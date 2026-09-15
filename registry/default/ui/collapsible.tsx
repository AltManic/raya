"use client"

import { Collapsible as Primitive } from "@base-ui/react/collapsible"
import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export const Collapsible = Primitive.Root
export function CollapsibleTrigger({ className, ...props }: ComponentProps<typeof Primitive.Trigger>) { return <Primitive.Trigger data-slot="collapsible-trigger" className={cn("text-sm font-medium underline-offset-4 hover:underline", className)} {...props} /> }
export function CollapsiblePanel({ className, ...props }: ComponentProps<typeof Primitive.Panel>) { return <Primitive.Panel data-slot="collapsible-panel" className={cn("overflow-hidden text-sm text-muted-foreground", className)} {...props} /> }
