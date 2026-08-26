import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import type { CSSProperties, ReactNode } from "react"
import { ChartLegend, ChartTip, chartAxisProps, chartGridProps, type ChartSeries } from "./chart-shared"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

const scopeVars = {
  "--raya-chart-legend-display": "var(--raya-chart-line-legend-display, none)",
  "--raya-chart-grid-visibility": "var(--raya-chart-line-grid-visibility, visible)",
} as CSSProperties

export interface LineChartProps {
  data: Array<Record<string, unknown>>
  xKey: string
  series: ChartSeries[]
  height?: number
  xLabels?: ReactNode
  className?: string
}

export function LineChartWrapper({ data, xKey, series, height = 240, className }: LineChartProps) {
  return (
    <div data-slot="chart" className={cx("raya-chart w-full flex flex-col gap-3", className)} style={{ ...scopeVars, height }}>
      <ChartLegend series={series} />
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} {...chartGridProps} />
          <XAxis dataKey={xKey} {...chartAxisProps} />
          <YAxis width={44} {...chartAxisProps} />
          <ChartTip />
          {series.map((s, i) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={`var(${s.colorVar ?? `--chart-${(i % 5) + 1}`})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
