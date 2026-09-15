"use client"

import { Accordion as Primitive } from "@base-ui/react/accordion"
import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export const Accordion = Primitive.Root
export function AccordionItem({ className, ...props }: ComponentProps<typeof Primitive.Item>) { return <Primitive.Item data-slot="accordion-item" className={cn("border-b border-border", className)} {...props} /> }
export function AccordionHeader({ className, ...props }: ComponentProps<typeof Primitive.Header>) { return <Primitive.Header data-slot="accordion-header" className={cn("flex", className)} {...props} /> }
export function AccordionTrigger({ className, ...props }: ComponentProps<typeof Primitive.Trigger>) { return <Primitive.Trigger data-slot="accordion-trigger" className={cn("flex w-full items-center justify-between py-4 text-left text-sm font-medium transition-colors hover:text-primary", className)} {...props} /> }
export function AccordionPanel({ className, ...props }: ComponentProps<typeof Primitive.Panel>) { return <Primitive.Panel data-slot="accordion-panel" className={cn("overflow-hidden pb-4 text-sm text-muted-foreground", className)} {...props} /> }
