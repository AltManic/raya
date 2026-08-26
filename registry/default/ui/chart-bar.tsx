import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import type { CSSProperties } from "react"
import { ChartLegend, ChartTip, chartAxisProps, chartGridProps, type ChartSeries } from "./chart-shared"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

const scopeVars = {
  "--raya-chart-legend-display": "var(--raya-chart-bar-legend-display, none)",
  "--raya-chart-grid-visibility": "var(--raya-chart-bar-grid-visibility, visible)",
} as CSSProperties

export interface BarChartProps {
  data: Array<Record<string, unknown>>
  xKey: string
  series: ChartSeries[]
  height?: number
  className?: string
}

export function BarChartWrapper({ data, xKey, series, height = 240, className }: BarChartProps) {
  const barSize = Math.max(8, Math.floor(480 / Math.max(data.length * series.length, 1) / 2))
  return (
    <div data-slot="chart" className={cx("raya-chart w-full flex flex-col gap-3", className)} style={{ ...scopeVars, height }}>
      <ChartLegend series={series} />
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} {...chartGridProps} />
          <XAxis dataKey={xKey} {...chartAxisProps} />
          <YAxis width={44} {...chartAxisProps} />
          <ChartTip />
          {series.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={`var(${s.colorVar ?? `--chart-${(i % 5) + 1}`})`}
              radius={[3, 3, 0, 0]}
              maxBarSize={barSize}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
