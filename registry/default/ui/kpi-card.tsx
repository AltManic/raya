import type { ReactNode } from "react"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export interface KpiCardProps {
  label: ReactNode
  value: ReactNode
  delta?: { value: string; direction: "up" | "down" }
  sparkline?: ReactNode
  className?: string
}

export function KpiCard({ label, value, delta, sparkline, className }: KpiCardProps) {
  return (
    <div data-slot="kpi-card" className={cx("raya-kpi w-full", className)}>
      <span className="raya-kpi-label">{label}</span>
      <span className="raya-kpi-value">{value}</span>
      {(delta || sparkline) && (
        <span className="flex items-center justify-between gap-2">
          {delta && (
            <span className="raya-kpi-delta" data-direction={delta.direction}>
              {delta.direction === "up" ? "▲" : "▼"} {delta.value}
            </span>
          )}
          {sparkline}
        </span>
      )}
    </div>
  )
}
