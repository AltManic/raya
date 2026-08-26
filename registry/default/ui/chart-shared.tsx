import { Tooltip as RechartsTooltip } from "recharts"
import type { ReactNode } from "react"

export interface ChartSeries {
  key: string
  label: string
  colorVar?: string
}

export function ChartLegend({ series }: { series: ChartSeries[] }) {
  return (
    <div className="raya-chart-legend">
      {series.map((s) => (
        <span key={s.key} className="raya-chart-legend-item">
          <span
            className="raya-chart-legend-swatch"
            style={{ "--swatch": `var(${s.colorVar ?? "--chart-1"})` } as Record<string, string>}
          />
          {s.label}
        </span>
      ))}
    </div>
  )
}

export const chartAxisProps = {
  stroke: "var(--muted-foreground)",
  tickLine: false,
  axisLine: false,
  fontSize: 11,
} as const

export const chartGridProps = {
  stroke: "var(--border)",
  strokeDasharray: "3 3",
} as const

export function ChartTip() {
  return (
    <RechartsTooltip
      cursor={{ stroke: "var(--border)" }}
      content={
        (({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: ReactNode; value?: ReactNode; color?: string }>; label?: ReactNode }) =>
          active && payload && payload.length > 0 ? (
            <div className="raya-chart-tooltip">
              {label != null && <div style={{ fontWeight: 600 }}>{label}</div>}
              {payload.map((entry, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: entry.color }} />
                  <span>{entry.name}</span>
                  <span style={{ marginLeft: "auto", fontVariantNumeric: "tabular-nums" }}>{entry.value}</span>
                </div>
              ))}
            </div>
          ) : null) as never
      }
    />
  )
}
