import type { CSSProperties } from "react"

export interface HeatmapRow { label: string; values: number[] }
export interface HeatmapChartProps { data: HeatmapRow[]; columns?: string[]; className?: string }

export function HeatmapChart({ data, columns = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], className }: HeatmapChartProps) {
  const max = Math.max(...data.flatMap((row) => row.values), 1)
  return (
    <div className={`w-full overflow-x-auto ${className ?? ""}`} data-slot="heatmap-chart">
      <div className="min-w-[30rem] space-y-2 text-xs">
        <div className="grid grid-cols-[5rem_repeat(7,minmax(1.5rem,1fr))] gap-1 text-center text-muted-foreground">
          <span />{columns.map((column) => <span key={column}>{column}</span>)}
        </div>
        {data.map((row) => (
          <div key={row.label} className="grid grid-cols-[5rem_repeat(7,minmax(1.5rem,1fr))] items-center gap-1">
            <span className="truncate text-muted-foreground">{row.label}</span>
            {row.values.map((value, index) => <span key={`${row.label}-${index}`} title={`${row.label}, ${columns[index] ?? index + 1}: ${value}`} className="aspect-square rounded-sm" style={{ background: `color-mix(in oklch, var(--chart-1) ${Math.max(10, Math.round((value / max) * 100))}%, var(--muted))` } as CSSProperties} />)}
          </div>
        ))}
      </div>
    </div>
  )
}
