"use client"

import { Combobox as Primitive } from "@base-ui/react/combobox"
import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export const Combobox = Primitive.Root
export const ComboboxInput = Primitive.Input
export const ComboboxTrigger = Primitive.Trigger
export const ComboboxValue = Primitive.Value
export const ComboboxItem = Primitive.Item
export const ComboboxPortal = Primitive.Portal
export const ComboboxPositioner = Primitive.Positioner
export const ComboboxEmpty = Primitive.Empty
export function ComboboxPopup({ className, ...props }: ComponentProps<typeof Primitive.Popup>) { return <Primitive.Popup data-slot="combobox-popup" className={cn("z-50 min-w-48 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md", className)} {...props} /> }
export function ComboboxList({ className, ...props }: ComponentProps<typeof Primitive.List>) { return <Primitive.List data-slot="combobox-list" className={cn("max-h-56 overflow-auto p-1", className)} {...props} /> }
