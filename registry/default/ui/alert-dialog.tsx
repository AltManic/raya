"use client"

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import type { ComponentProps } from "react"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export const AlertDialog = AlertDialogPrimitive.Root

export function AlertDialogTrigger({ className, ...props }: ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" className={cx("", className)} {...props} />
}

export function AlertDialogBackdrop({ className, ...props }: ComponentProps<typeof AlertDialogPrimitive.Backdrop>) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-backdrop"
      className={cx("fixed inset-0 z-40 bg-black/50 transition-opacity duration-150", className)}
      {...props}
    />
  )
}

export function AlertDialogPopup({ className, children, ...props }: ComponentProps<typeof AlertDialogPrimitive.Popup>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogBackdrop />
      <AlertDialogPrimitive.Popup data-slot="alert-dialog-popup" className={cx("raya-dialog-popup fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50", className)} {...props}>
        {children}
      </AlertDialogPrimitive.Popup>
    </AlertDialogPrimitive.Portal>
  )
}

export function AlertDialogTitle({ className, ...props }: ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return <AlertDialogPrimitive.Title data-slot="alert-dialog-title" className={cx("raya-dialog-title font-[family-name:var(--font-sans)]", className)} {...props} />
}

export function AlertDialogDescription({ className, ...props }: ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return <AlertDialogPrimitive.Description data-slot="alert-dialog-description" className={cx("raya-dialog-description font-[family-name:var(--font-sans)]", className)} {...props} />
}

export function AlertDialogCancel({ className, ...props }: ComponentProps<typeof AlertDialogPrimitive.Close>) {
  return <AlertDialogPrimitive.Close data-slot="alert-dialog-cancel" className={cx("raya-button cursor-pointer", className)} {...props} />
}

export function AlertDialogAction({ className, ...props }: ComponentProps<typeof AlertDialogPrimitive.Close>) {
  return <AlertDialogPrimitive.Close data-slot="alert-dialog-action" className={cx("raya-button cursor-pointer", className)} {...props} />
}
