import { useState } from "react"
import { Button } from "@/registry/default/ui/button"
import { Input } from "@/registry/default/ui/input"
import { Textarea } from "@/registry/default/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/default/ui/select"
import { Checkbox, CheckboxIndicator } from "@/registry/default/ui/checkbox"
import { Switch } from "@/registry/default/ui/switch"
import { RadioGroup, Radio } from "@/registry/default/ui/radio-group"
import { Slider } from "@/registry/default/ui/slider"
import { Field, FieldControl, FieldDescription, FieldLabel } from "@/registry/default/ui/field"
import { Card, CardDescription, CardTitle } from "@/registry/default/ui/card"
import { Badge } from "@/registry/default/ui/badge"
import { Avatar, AvatarFallback } from "@/registry/default/ui/avatar"
import { Tabs, Tab, TabPanel, TabsList } from "@/registry/default/ui/tabs"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/registry/default/ui/tooltip"
import { LineChartWrapper } from "@/registry/default/ui/chart-line"
import { AreaChartWrapper } from "@/registry/default/ui/chart-area"
import { BarChartWrapper } from "@/registry/default/ui/chart-bar"
import { PieChartWrapper } from "@/registry/default/ui/chart-pie"
import { Sparkline } from "@/registry/default/ui/chart-sparkline"
import { KpiCard } from "@/registry/default/ui/kpi-card"
import { DataTable } from "@/registry/default/ui/data-table"
import { FilterBar } from "@/registry/blocks/filter-bar/filter-bar"
import { kpiCards, mrrTrend, planMix, signupsByChannel, traffic, customers } from "@/lib/demo-data"
import type { Knobs } from "@/lib/model/model"
import type { Studio } from "@/lib/studio/use-studio"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

const columns: unknown[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "company", header: "Company" },
  { accessorKey: "plan", header: "Plan" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "mrr", header: "MRR", cell: (info: { getValue: () => unknown }) => `$${Number(info.getValue()).toLocaleString("en-US")}` },
]

function Gallery() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
      <Tile title="Button" className="col-span-1 flex flex-wrap items-center gap-2">
        <Button>Default</Button>
        <Button style={{ ["--raya-button-bg" as string]: "var(--background)", ["--raya-button-fg" as string]: "var(--foreground)", ["--raya-button-border" as string]: "var(--border)" }}>Outline</Button>
        <Button style={{ background: "transparent", color: "var(--foreground)", borderColor: "transparent" }}>Ghost</Button>
      </Tile>
      <Tile title="Input & Textarea" className="flex flex-col gap-2">
        <Input placeholder="Email address…" />
        <Textarea placeholder="Message…" />
      </Tile>
      <Tile title="Select" className="flex gap-2">
        <Select items={["Starter", "Growth", "Scale"].map((o) => ({ label: o, value: o }))}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Plan" /></SelectTrigger>
          <SelectContent>
            {["Starter", "Growth", "Scale"].map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Tile>
      <Tile title="Checkbox · Switch · Radio" className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox defaultChecked><CheckboxIndicator /></Checkbox> Notify
        </label>
        <Switch defaultChecked />
        <RadioGroup defaultValue="a" className="flex gap-3">
          <label className="flex items-center gap-1.5 text-sm"><Radio value="a" /> A</label>
          <label className="flex items-center gap-1.5 text-sm"><Radio value="b" /> B</label>
        </RadioGroup>
      </Tile>
      <Tile title="Slider & Field" className="flex flex-col gap-4">
        <Slider defaultValue={[60]} />
        <Field>
          <FieldLabel>Workspace name</FieldLabel>
          <FieldControl placeholder="signalpath" />
          <FieldDescription>Lowercase letters and dashes.</FieldDescription>
        </Field>
      </Tile>
      <Tile title="Card" >
        <Card>
          <CardTitle>Signalpath Analytics</CardTitle>
          <CardDescription>Fictional dev-tool SaaS powering the demo dashboards.</CardDescription>
        </Card>
      </Tile>
      <Tile title="Badge & Avatar" className="flex flex-wrap items-center gap-3">
        <Badge>active</Badge>
        <Badge style={{ background: "var(--secondary)", color: "var(--secondary-foreground)" }}>trial</Badge>
        <Avatar><AvatarFallback>PR</AvatarFallback></Avatar>
      </Tile>
      <Tile title="Tabs" className="flex justify-center">
        <Tabs defaultValue="overview">
          <TabsList>
            <Tab value="overview">Overview</Tab>
            <Tab value="billing">Billing</Tab>
            <Tab value="usage">Usage</Tab>
          </TabsList>
          <TabPanel value="overview" />
          <TabPanel value="billing" />
          <TabPanel value="usage" />
        </Tabs>
      </Tile>
      <Tile title="Tooltip" className="flex justify-center py-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger render={<Button>Hover me</Button>} />
            <TooltipContent>MRR grew 8.2% month over month.</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Tile>
      <Tile title="Line — MRR trend" wide>
        <LineChartWrapper
          data={mrrTrend as unknown as Array<Record<string, unknown>>}
          xKey="month"
          series={[
            { key: "mrr", label: "MRR" },
            { key: "newMrr", label: "New MRR", colorVar: "--chart-2" },
          ]}
        />
      </Tile>
      <Tile title="Area — Traffic" wide>
        <AreaChartWrapper data={traffic as unknown as Array<Record<string, unknown>>} xKey="month" series={[{ key: "organic", label: "Organic" }, { key: "referral", label: "Referral", colorVar: "--chart-2" }, { key: "paid", label: "Paid", colorVar: "--chart-3" }]} />
      </Tile>
      <Tile title="Bar — Signups by channel" wide>
        <BarChartWrapper data={signupsByChannel as unknown as Array<Record<string, unknown>>} xKey="channel" series={[{ key: "signups", label: "Signups" }]} />
      </Tile>
      <Tile title="Donut — Plan mix">
        <PieChartWrapper
          data={planMix as unknown as Array<Record<string, unknown>>}
          nameKey="plan"
          valueKey="accounts"
          slices={planMix.map((p, i) => ({ key: p.plan, label: p.plan, colorVar: `--chart-${i + 1}` }))}
          height={200}
        />
      </Tile>
      <Tile title="KPI cards" className="col-span-full grid grid-cols-4 gap-4">
        {kpiCards.map((k) => (
          <KpiCard
            key={k.id}
            label={k.label}
            value={k.value}
            delta={k.delta}
            sparkline={
              <Sparkline
                height={30}
                valueKey="v"
                data={k.sparkline.map((v, i) => ({ i, v }))}
                colorVar={`--chart-${(kpiCards.indexOf(k) % 5) + 1}`}
              />
            }
          />
        ))}
      </Tile>
      <Tile title="Data table — customers" className="col-span-full">
        <DataTable columns={columns as never} data={customers} pageSize={15} />
      </Tile>
    </div>
  )
}

function Tile({ title, children, wide, className }: { title: string; children: React.ReactNode; wide?: boolean; className?: string }) {
  return (
    <section className={cx("rounded-lg border border-border bg-card p-4", wide && "col-span-full", className)}>
      <h3 className="mb-3 font-[family-name:var(--font-sans)] text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </section>
  )
}

function Focus({ studio }: { studio: Studio }) {
  const component = studio.focusComponent ?? "button"
  const axes = (component === "button" || component === "select" ? ["variant"] : []).concat(["size"])
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 rounded-lg border border-dashed border-border bg-card/50 p-10">
      <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 shadow-sm">
        <span className="font-mono text-xs text-muted-foreground">{component}</span>
        {axes.map((axis) => (
          <select
            key={axis}
            className="rounded border border-input bg-background px-1.5 py-0.5 text-xs"
            value={(studio.active.knobs[component as keyof Knobs] as Record<string, string>)?.[axis]}
            onChange={(e) => studio.setKnob(component as keyof Knobs, { ...(studio.active.knobs[component as keyof Knobs] as object), [axis]: e.target.value } as never)}
          >
            {(axis === "variant" ? ["default", "outline", "ghost", "destructive", "link"] : ["sm", "md", "lg"]).map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ))}
      </div>
      <FocusPreview component={component} />
    </div>
  )
}

function FocusPreview({ component }: { component: string }) {
  if (component === "button") return <Button>Deploy dashboard</Button>
  if (component === "input") return <Input className="max-w-xs" placeholder="Search events…" />
  return <Button>Preview {component}</Button>
}

export function Canvas({ studio }: { studio: Studio }) {
  const [filterSearch, setFilterSearch] = useState("")
  void filterSearch
  return (
    <main className="flex-1 overflow-y-auto bg-background p-6">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
          {(["gallery", "focus"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => studio.setView(v)}
              className={cx(
                "cursor-pointer rounded px-2.5 py-1 text-xs font-medium capitalize",
                studio.view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {v}
            </button>
          ))}
        </div>
        {studio.view === "focus" && (
          <select
            className="rounded-md border border-input bg-background px-2 py-1 text-xs"
            value={studio.focusComponent ?? "button"}
            onChange={(e) => studio.setFocusComponent(e.target.value)}
          >
            {["button", "input", "textarea", "card", "badge", "avatar", "kpi-card"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        )}
      </div>
      {studio.view === "gallery" ? (
        <>
          <div className="mb-5">
            <FilterBar search={filterSearch} onSearchChange={setFilterSearch} filters={[{ key: "plan", placeholder: "All plans", options: ["Starter", "Growth", "Scale"] }]} onReset={() => setFilterSearch("")} />
          </div>
          <Gallery />
        </>
      ) : (
        <Focus studio={studio} />
      )}
    </main>
  )
}
