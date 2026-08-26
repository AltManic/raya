import { Line, LineChart, ResponsiveContainer } from "recharts"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export interface SparklineProps {
  data: Array<Record<string, unknown>>
  valueKey: string
  height?: number
  colorVar?: string
  className?: string
}

export function Sparkline({ data, valueKey, height = 36, colorVar = "--chart-1", className }: SparklineProps) {
  return (
    <div data-slot="sparkline" className={cx("raya-chart w-full", className)} style={{ height }} aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 0, bottom: 4, left: 0 }}>
          <Line
            type="monotone"
            dataKey={valueKey}
            stroke={`var(${colorVar})`}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
