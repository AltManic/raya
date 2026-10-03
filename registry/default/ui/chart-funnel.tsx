import type { CSSProperties } from "react"

export interface FunnelDatum { label: string; value: number; colorVar?: string }
export interface FunnelChartProps { data: FunnelDatum[]; height?: number; className?: string }

export function FunnelChart({ data, height = 240, className }: FunnelChartProps) {
  const max = Math.max(...data.map((item) => item.value), 1)
  return (
    <div className={`w-full ${className ?? ""}`} style={{ minHeight: height }} data-slot="funnel-chart">
      <div className="flex h-full flex-col justify-center gap-2 py-2">
        {data.map((item, index) => {
          const width = Math.max(18, (item.value / max) * 100)
          return (
            <div key={item.label} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-3 text-xs">
              <span className="truncate text-muted-foreground">{item.label}</span>
              <div className="h-7 overflow-hidden rounded-sm bg-muted/60">
                <div className="flex h-full items-center rounded-sm px-2 font-medium text-primary-foreground transition-[width] duration-500" style={{ width: `${width}%`, background: `var(${item.colorVar ?? `--chart-${(index % 5) + 1}`})` } as CSSProperties}>
                  {width > 35 ? item.value.toLocaleString() : null}
                </div>
              </div>
              <span className="text-right tabular-nums text-muted-foreground">{item.value.toLocaleString()}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
