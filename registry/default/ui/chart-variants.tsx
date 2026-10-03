import type { CSSProperties } from "react"

const DATA = [18, 34, 27, 46, 39, 61, 54, 72]
const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Now"]
export function VariantChart({ variant, className }: { variant: string; className?: string }) {
  const max = Math.max(...DATA)
  const points = DATA.map((value, i) => `${(i / (DATA.length - 1)) * 100},${100 - (value / max) * 78 - 10}`).join(" ")
  const bar = variant.includes("bar") || variant.includes("histogram") || variant.includes("pareto") || variant.includes("waterfall")
  const rings = variant.includes("radar") || variant.includes("polar") || variant.includes("rose") || variant.includes("gauge")
  return <div className={`w-full space-y-3 ${className ?? ""}`} data-slot="chart-variant" data-chart={variant}>
    <div className="relative h-52 overflow-hidden rounded-md border border-border/60 bg-muted/20 p-3">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" aria-label={`${variant} chart`} role="img">
        {[20, 40, 60, 80].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="var(--border)" strokeDasharray="2 2" />)}
        {rings ? <><circle cx="50" cy="50" r="36" fill="none" stroke="var(--chart-1)" strokeWidth="8" strokeDasharray="140 90" /><circle cx="50" cy="50" r="24" fill="none" stroke="var(--chart-2)" strokeWidth="7" strokeDasharray="92 60" /><circle cx="50" cy="50" r="12" fill="none" stroke="var(--chart-3)" strokeWidth="6" strokeDasharray="44 32" /></> : bar ? DATA.map((value, i) => <rect key={i} x={i * 12 + 2} y={100 - (value / max) * 78 - 10} width="7" height={(value / max) * 78} rx="1" fill={`var(--chart-${(i % 5) + 1})`} />) : <><polyline points={points} fill="none" stroke="var(--chart-1)" strokeWidth="2" vectorEffect="non-scaling-stroke" /><polyline points={`0,90 ${points} 100,90`} fill="var(--chart-1)" opacity=".12" /></>}
      </svg>
    </div>
    <div className="flex justify-between text-[11px] text-muted-foreground">{labels.map((label) => <span key={label}>{label}</span>)}</div>
    <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="size-2 rounded-full" style={{ background: "var(--chart-1)" } as CSSProperties} />{variant.replaceAll("-", " ")} · last 8 periods</div>
  </div>
}
