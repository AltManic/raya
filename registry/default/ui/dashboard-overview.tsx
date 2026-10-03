import type { ReactNode } from "react"
import { AreaChartWrapper } from "./chart-area"
import { BarChartWrapper } from "./chart-bar"
import { PieChartWrapper } from "./chart-pie"
import { FunnelChart, type FunnelDatum } from "./chart-funnel"
import { HeatmapChart, type HeatmapRow } from "./chart-heatmap"
import { KpiCard } from "./kpi-card"

export interface DashboardMetric { id: string; label: string; value: string; delta?: { value: string; direction: "up" | "down" }; sparkline?: ReactNode }
export interface DashboardOverviewProps { metrics: DashboardMetric[]; revenue: Array<Record<string, unknown>>; revenueKey?: string; revenueLabel?: string; channels: Array<Record<string, unknown>>; channelKey?: string; channelValueKey?: string; channelLabel?: string; plans: Array<Record<string, unknown>>; planNameKey?: string; planValueKey?: string; funnel: FunnelDatum[]; retention: HeatmapRow[] }

export function DashboardOverview({ metrics, revenue, revenueKey = "mrr", revenueLabel = "Revenue", channels, channelKey = "channel", channelValueKey = "signups", channelLabel = "Signups", plans, planNameKey = "plan", planValueKey = "accounts", funnel, retention }: DashboardOverviewProps) {
  return (
    <section className="grid gap-4" data-slot="dashboard-overview">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ id, ...metric }) => <KpiCard key={id} {...metric} />)}</div>
      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <DashboardPanel title="Revenue trajectory"><AreaChartWrapper data={revenue} xKey="month" series={[{ key: revenueKey, label: revenueLabel }]} height={260} /></DashboardPanel>
        <DashboardPanel title="Acquisition mix"><BarChartWrapper data={channels} xKey={channelKey} series={[{ key: channelValueKey, label: channelLabel }]} height={260} /></DashboardPanel>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.2fr]">
        <DashboardPanel title="Plan mix"><PieChartWrapper data={plans} nameKey={planNameKey} valueKey={planValueKey} slices={plans.map((plan, index) => ({ key: String(plan[planNameKey]), label: String(plan[planNameKey]), colorVar: `--chart-${(index % 5) + 1}` }))} height={220} /></DashboardPanel>
        <DashboardPanel title="Conversion funnel"><FunnelChart data={funnel} /></DashboardPanel>
        <DashboardPanel title="Weekly retention"><HeatmapChart data={retention} /></DashboardPanel>
      </div>
    </section>
  )
}

function DashboardPanel({ title, children }: { title: string; children: ReactNode }) { return <article className="rounded-xl border border-border/70 bg-card/80 p-4 shadow-sm/5"><h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>{children}</article> }
