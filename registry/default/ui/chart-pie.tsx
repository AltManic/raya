import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useEffect, useState } from "react"
import type { CSSProperties } from "react"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export interface PieSlice {
  key: string
  label: string
  colorVar?: string
}

export interface PieChartProps {
  data: Array<Record<string, unknown>>
  nameKey: string
  valueKey: string
  slices?: PieSlice[]
  height?: number
  className?: string
}

export function PieChartWrapper({ data, nameKey, valueKey, slices = [], height = 240, className }: PieChartProps) {
  const [innerRadius, setInnerRadius] = useState("60%")

  useEffect(() => {
    const probe = document.createElement("div")
    probe.style.display = "none"
    document.body.appendChild(probe)
    const v = getComputedStyle(probe).getPropertyValue("--raya-pie-inner-radius").trim()
    if (v) setInnerRadius(v)
    probe.remove()
  }, [])

  return (
    <div
      data-slot="chart"
      className={cx("raya-chart w-full flex flex-col gap-3", className)}
      style={{ "--raya-chart-legend-display": "flex" } as CSSProperties}
    >
      <div className="raya-chart-legend">
        {(slices.length > 0
          ? slices
          : data.map((d, i) => ({ key: String(d[nameKey] ?? i), label: String(d[nameKey] ?? i), colorVar: undefined }))
        ).map((s, idx) => (
          <span key={s.key} className="raya-chart-legend-item">
            <span
              className="raya-chart-legend-swatch"
              style={{ "--swatch": s.colorVar ? `var(${s.colorVar})` : `var(--chart-${(idx % 5) + 1})` } as Record<string, string>}
            />
            {s.label}
          </span>
        ))}
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Tooltip content={<div className="raya-chart-tooltip" />} />
            <Pie
              data={data}
              dataKey={valueKey}
              nameKey={nameKey}
              innerRadius={innerRadius}
              outerRadius="82%"
              paddingAngle={2}
              stroke="none"
              label={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
              ))}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
