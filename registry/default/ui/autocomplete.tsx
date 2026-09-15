"use client"

import { Autocomplete as Primitive } from "@base-ui/react/autocomplete"
import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export const Autocomplete = Primitive.Root
export const AutocompleteInput = Primitive.Input
export const AutocompleteItem = Primitive.Item
export function AutocompleteList({ className, ...props }: ComponentProps<typeof Primitive.List>) { return <Primitive.List data-slot="autocomplete-list" className={cn("max-h-56 overflow-auto p-1", className)} {...props} /> }
export function AutocompletePopup({ className, ...props }: ComponentProps<typeof Primitive.Popup>) { return <Primitive.Popup data-slot="autocomplete-popup" className={cn("z-50 min-w-48 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md", className)} {...props} /> }
export const AutocompletePortal = Primitive.Portal
export const AutocompletePositioner = Primitive.Positioner
export const AutocompleteEmpty = Primitive.Empty
