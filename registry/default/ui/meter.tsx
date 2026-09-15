import type { ComponentProps } from "react"
import { cn } from "@/registry/default/lib/utils"

export function Meter({ className, value = 0, min = 0, max = 100, ...props }: ComponentProps<"div"> & { value?: number; min?: number; max?: number }) {
  const percentage = Math.max(0, Math.min(100, ((value - min) / Math.max(1, max - min)) * 100))
  return <div role="meter" aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} data-slot="meter" className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)} {...props}><div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${percentage}%` }} /></div>
}
