"use client"

import { NumberField as Primitive } from "@base-ui/react/number-field"
import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export const NumberField = Primitive.Root
export const NumberFieldGroup = Primitive.Group
export const NumberFieldInput = Primitive.Input
export function NumberFieldIncrement({ className, ...props }: ComponentProps<typeof Primitive.Increment>) { return <Primitive.Increment data-slot="number-field-increment" className={cn("px-2 text-muted-foreground hover:text-foreground", className)} {...props} /> }
export function NumberFieldDecrement({ className, ...props }: ComponentProps<typeof Primitive.Decrement>) { return <Primitive.Decrement data-slot="number-field-decrement" className={cn("px-2 text-muted-foreground hover:text-foreground", className)} {...props} /> }
