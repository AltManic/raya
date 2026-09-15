"use client"

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import type { ComponentProps } from "react"

import { IconPlaceholder } from "@/registry/internal/icon-placeholder"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export const Dialog = DialogPrimitive.Root

export function DialogTrigger({ className, ...props }: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" className={cx("", className)} {...props} />
}

export function DialogBackdrop({ className, ...props }: ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cx("fixed inset-0 z-40 bg-black/50 transition-opacity duration-150", className)}
      {...props}
    />
  )
}

export function DialogPopup({ className, children, ...props }: ComponentProps<typeof DialogPrimitive.Popup>) {
  return (
    <DialogPrimitive.Portal>
      <DialogBackdrop />
      <DialogPrimitive.Popup data-slot="dialog-popup" className={cx("raya-dialog-popup fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50", className)} {...props}>
        {children}
        <DialogClose className="absolute top-3 right-3 cursor-pointer opacity-60 hover:opacity-100">
          <IconPlaceholder lucide="XIcon" tabler="IconX" hugeicons="Cancel01Icon" phosphor="XIcon" remixicon="RiCloseLine" className="size-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cx("raya-dialog-title font-[family-name:var(--font-sans)]", className)} {...props} />
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cx("raya-dialog-description font-[family-name:var(--font-sans)]", className)} {...props} />
}

export function DialogClose({ className, ...props }: ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" className={cx("", className)} {...props} />
}
