/* COSS-aligned loading indicator, ported from coss ui's spinner surface. */
import type React from "react"
import { cn } from "@/registry/default/lib/utils"
import { IconPlaceholder } from "@/registry/internal/icon-placeholder"

export interface SpinnerProps {
  className?: string
}

export function Spinner({ className, ...props }: SpinnerProps): React.ReactElement {
  return (
    <IconPlaceholder
      aria-label="Loading"
      className={cn("animate-spin", className)}
      hugeicons="Loading03Icon"
      lucide="Loader2Icon"
      phosphor="SpinnerGap"
      remixicon="RiLoader4Line"
      role="status"
      tabler="IconLoader2"
      {...props}
    />
  )
}
