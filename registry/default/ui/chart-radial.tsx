import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts"
import type { CSSProperties } from "react"

export interface RadialDatum { label: string; value: number; max?: number; colorVar?: string }
export interface RadialChartProps { data: RadialDatum[]; height?: number; className?: string }

export function RadialChart({ data, height = 240, className }: RadialChartProps) {
  return (
    <div className={`w-full ${className ?? ""}`} style={{ height }} data-slot="radial-chart">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="18%" outerRadius="88%" barSize={16} data={data} startAngle={90} endAngle={-270} cx="50%" cy="50%">
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
          {data.map((item, index) => <RadialBar key={item.label} dataKey="value" cornerRadius={4} background={{ fill: "var(--muted)" }} fill={`var(${item.colorVar ?? `--chart-${(index % 5) + 1}`})`} />)}
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="-mt-[calc(50%+1.25rem)] flex flex-col items-center justify-center gap-1 text-center">
        <span className="text-2xl font-semibold tabular-nums">{Math.round(data.reduce((sum, item) => sum + item.value, 0) / Math.max(data.length, 1))}%</span>
        <span className="text-xs text-muted-foreground">average attainment</span>
      </div>
      <div className="mt-[calc(50%-1rem)] flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {data.map((item, index) => <span key={item.label} className="inline-flex items-center gap-1.5"><i className="size-2 rounded-full" style={{ background: `var(${item.colorVar ?? `--chart-${(index % 5) + 1}`})` } as CSSProperties} />{item.label} {item.value}%</span>)}
      </div>
    </div>
  )
}
