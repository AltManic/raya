"use client"

import { Toast as Primitive } from "@base-ui/react/toast"
import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export const ToastProvider = Primitive.Provider
export const ToastRoot = Primitive.Root
export function ToastViewport({ className, ...props }: ComponentProps<typeof Primitive.Viewport>) { return <Primitive.Viewport data-slot="toast-viewport" className={cn("fixed right-4 bottom-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2", className)} {...props} /> }
export function ToastContent({ className, ...props }: ComponentProps<typeof Primitive.Content>) { return <Primitive.Content data-slot="toast-content" className={cn("flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground shadow-lg", className)} {...props} /> }
export const ToastTitle = Primitive.Title
export const ToastDescription = Primitive.Description
export const ToastClose = Primitive.Close
export const ToastPortal = Primitive.Portal
export const useToastManager = Primitive.useToastManager
