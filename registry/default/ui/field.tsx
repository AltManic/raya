import { Field as FieldPrimitive } from "@base-ui/react/field"
import type { ComponentProps } from "react"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export const Field = FieldPrimitive.Root

export function FieldLabel({ className, ...props }: ComponentProps<typeof FieldPrimitive.Label>) {
  return <FieldPrimitive.Label data-slot="field-label" className={cx("raya-label", className)} {...props} />
}

export function FieldDescription({ className, ...props }: ComponentProps<typeof FieldPrimitive.Description>) {
  return <FieldPrimitive.Description data-slot="field-description" className={cx("raya-field-description", className)} {...props} />
}

export function FieldError({ className, ...props }: ComponentProps<typeof FieldPrimitive.Error>) {
  return <FieldPrimitive.Error data-slot="field-error" className={cx("raya-field-error", className)} {...props} />
}

export function FieldControl({ className, ...props }: ComponentProps<typeof FieldPrimitive.Control>) {
  return (
    <FieldPrimitive.Control
      data-slot="field-control"
      className={cx("raya-input", className)}
      {...props}
    />
  )
}
