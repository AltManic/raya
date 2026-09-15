import { useState } from "react"
import { Button } from "@/registry/default/ui/coss-button"
import { Input } from "@/registry/default/ui/coss-input"
import { Textarea } from "@/registry/default/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/default/ui/select"
import { Checkbox, CheckboxIndicator } from "@/registry/default/ui/checkbox"
import { Switch } from "@/registry/default/ui/switch"
import { RadioGroup, Radio } from "@/registry/default/ui/radio-group"
import { Slider } from "@/registry/default/ui/slider"
import { Field, FieldControl, FieldDescription, FieldLabel } from "@/registry/default/ui/coss-field"
import { Card, CardDescription, CardTitle } from "@/registry/default/ui/coss-card"
import { Badge } from "@/registry/default/ui/badge"
import { Avatar, AvatarFallback } from "@/registry/default/ui/avatar"
import { Tabs, Tab, TabPanel, TabsList } from "@/registry/default/ui/tabs"
import { SegmentedControl, SegmentedControlItem } from "@/registry/default/ui/segmented-control"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/registry/default/ui/tooltip"
import { Dialog, DialogDescription, DialogPopup, DialogTitle, DialogTrigger } from "@/registry/default/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogDescription, AlertDialogPopup, AlertDialogTitle, AlertDialogTrigger } from "@/registry/default/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/registry/default/ui/alert"
import { Empty, EmptyDescription, EmptyTitle } from "@/registry/default/ui/empty"
import { Toggle } from "@/registry/default/ui/toggle"
import { Meter } from "@/registry/default/ui/meter"
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "@/registry/default/ui/accordion"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/registry/default/ui/collapsible"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/registry/default/ui/breadcrumb"
import { Kbd } from "@/registry/default/ui/kbd"
import { Group } from "@/registry/default/ui/group"
import { Form, FormActions } from "@/registry/default/ui/form"
import { Fieldset, FieldsetLegend } from "@/registry/default/ui/fieldset"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/registry/default/ui/input-group"
import { Label } from "@/registry/default/ui/label"
import { Autocomplete, AutocompleteEmpty, AutocompleteInput, AutocompleteItem, AutocompleteList, AutocompletePopup, AutocompletePortal, AutocompletePositioner } from "@/registry/default/ui/autocomplete"
import { Combobox, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxPopup, ComboboxPortal, ComboboxPositioner, ComboboxTrigger, ComboboxValue } from "@/registry/default/ui/combobox"
import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput } from "@/registry/default/ui/number-field"
import { CheckboxGroup } from "@/registry/default/ui/checkbox-group"
import { OTPField } from "@/registry/default/ui/otp-field"
import { Calendar } from "@/registry/default/ui/calendar"
import { DatePicker } from "@/registry/default/ui/date-picker"
import { Frame, FrameContent, FrameHeader } from "@/registry/default/ui/frame"
import { ScrollArea } from "@/registry/default/ui/scroll-area"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/registry/default/ui/menu"
import { Sidebar, SidebarContent, SidebarHeader, SidebarItem } from "@/registry/default/ui/sidebar"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/registry/default/ui/sheet"
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/registry/default/ui/drawer"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/registry/default/ui/context-menu"
import { ToastClose, ToastContent, ToastDescription, ToastPortal, ToastProvider, ToastRoot, ToastTitle, ToastViewport, useToastManager } from "@/registry/default/ui/toast"
import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from "@/registry/default/ui/preview-card"
import { NavigationMenu, NavigationMenuLink } from "@/registry/default/ui/navigation-menu"
import { Toolbar, ToolbarSeparator } from "@/registry/default/ui/toolbar"
import { Menubar, MenubarItem } from "@/registry/default/ui/menubar"
import { FilterableMenu } from "@/registry/default/ui/filterable-menu"
import { Command } from "@/registry/default/ui/command"
import { ToggleGroup, ToggleGroupItem } from "@/registry/default/ui/toggle-group"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/registry/default/ui/pagination"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/registry/default/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/default/ui/popover"
import { LineChartWrapper } from "@/registry/default/ui/chart-line"
import { AreaChartWrapper } from "@/registry/default/ui/chart-area"
import { BarChartWrapper } from "@/registry/default/ui/chart-bar"
import { PieChartWrapper } from "@/registry/default/ui/chart-pie"
import { Sparkline } from "@/registry/default/ui/chart-sparkline"
import { KpiCard } from "@/registry/default/ui/kpi-card"
import { DataTable } from "@/registry/default/ui/data-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/default/ui/table"
import { FilterBar } from "@/registry/blocks/filter-bar/filter-bar"
import { Separator } from "@/registry/default/ui/separator"
import { Progress } from "@/registry/default/ui/progress"
import { Skeleton } from "@/registry/default/ui/skeleton"
import { Spinner } from "@/registry/default/ui/spinner"
import { kpiCards, mrrTrend, planMix, signupsByChannel, traffic, customers } from "@/lib/demo-data"
import type { Knobs } from "@/lib/model/model"
import { COMPONENT_NAMES } from "@/lib/model/components"
import type { Studio } from "@/lib/studio/use-studio"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

function ToastDemo() {
  const manager = useToastManager()
  return <Button variant="outline" onClick={() => manager.add({ title: "System saved", description: "Your changes are ready to export." })}>Show toast</Button>
}

function ToastList() {
  const { toasts } = useToastManager()
  return <>{toasts.map((toast) => <ToastRoot key={toast.id} toast={toast}><ToastContent><div className="min-w-0 flex-1"><ToastTitle /><ToastDescription /></div><ToastClose render={<Button size="sm" variant="ghost">Dismiss</Button>} /></ToastContent></ToastRoot>)}</>
}

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
        <RadioGroup aria-label="Notification frequency" defaultValue="a" className="flex gap-3">
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
    <section className={cx("rounded-xl border border-border/70 bg-card/80 p-4 shadow-sm/5", wide && "col-span-full", className)}>
      <h3 className="mb-3 font-[family-name:var(--font-sans)] text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </section>
  )
}

function Focus({ studio }: { studio: Studio }) {
  const component = studio.focusComponent ?? "button"
  const knobValues = studio.active.knobs[component as keyof Knobs] as Record<string, string> | undefined
  const axes = Object.keys(knobValues ?? {})
  const optionsFor = (axis: string) => {
    if (axis === "variant") return ["default", "secondary", "outline", "ghost", "destructive", "destructive-outline", "link"]
    if (axis === "size") return ["xs", "sm", "md", "default", "lg", "icon"]
    if (axis === "density") return ["comfortable", "compact"]
    if (axis === "shape") return ["circle", "rounded", "square"]
    if (axis === "legend" || axis === "grid" || axis === "zebra") return ["show", "hide", "on", "off"]
    if (axis === "radius") return ["sm", "md", "lg"]
    return [String(knobValues?.[axis] ?? "default")]
  }
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
            {optionsFor(axis).map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ))}
      </div>
      <FocusPreview component={component} />
    </div>
  )
}

export function FocusPreview({ component }: { component: string }) {
  if (component === "button") return <Button>Deploy dashboard</Button>
  if (component === "input") return <Input className="max-w-xs" placeholder="Search events…" />
  if (component === "textarea") return <Textarea className="max-w-md" placeholder="Leave a note for your team…" />
  if (component === "select") {
    return (
      <Select items={["Starter", "Growth", "Scale"].map((value) => ({ label: value, value }))}>
        <SelectTrigger className="w-48"><SelectValue placeholder="Choose a plan" /></SelectTrigger>
        <SelectContent>
          {["Starter", "Growth", "Scale"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
        </SelectContent>
      </Select>
    )
  }
  if (component === "checkbox") return <label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked><CheckboxIndicator /></Checkbox> Send weekly digest</label>
  if (component === "switch") return <div className="flex items-center gap-3 text-sm"><Switch defaultChecked /> Auto-save changes</div>
  if (component === "radio-group") return <RadioGroup aria-label="Billing frequency" defaultValue="monthly" className="flex gap-4 text-sm"><label className="flex items-center gap-2"><Radio value="monthly" /> Monthly</label><label className="flex items-center gap-2"><Radio value="yearly" /> Yearly</label></RadioGroup>
  if (component === "slider") return <div className="w-64"><Slider defaultValue={[64]} /></div>
  if (component === "field") return <Field className="w-72"><FieldLabel>Workspace name</FieldLabel><FieldControl placeholder="signalpath" /><FieldDescription>Lowercase letters and dashes.</FieldDescription></Field>
  if (component === "card") return <Card className="w-80"><CardTitle>Signalpath Analytics</CardTitle><CardDescription>MRR grew 8.2% month over month.</CardDescription></Card>
  if (component === "badge") return <div className="flex gap-2"><Badge>Active</Badge><Badge>Trial</Badge><Badge>Paused</Badge></div>
  if (component === "avatar") return <div className="flex items-center gap-3"><Avatar><AvatarFallback>PR</AvatarFallback></Avatar><span className="text-sm">Priya Raman</span></div>
  if (component === "tabs") return <Tabs defaultValue="overview"><TabsList><Tab value="overview">Overview</Tab><Tab value="billing">Billing</Tab><Tab value="usage">Usage</Tab></TabsList><TabPanel value="overview" /></Tabs>
  if (component === "segmented-control") return <SegmentedControl defaultValue="preview"><SegmentedControlItem value="preview">Preview</SegmentedControlItem><SegmentedControlItem value="code">Code</SegmentedControlItem><SegmentedControlItem value="install">Install</SegmentedControlItem></SegmentedControl>
  if (component === "tooltip") return <TooltipProvider><Tooltip><TooltipTrigger render={<Button variant="outline">Hover me</Button>} /><TooltipContent>MRR grew 8.2% month over month.</TooltipContent></Tooltip></TooltipProvider>
  if (component === "spinner") return <Spinner className="size-6 text-muted-foreground" />
  if (component === "separator") return <div className="flex h-12 w-64 items-center gap-3"><span className="text-xs text-muted-foreground">Before</span><Separator /><span className="text-xs text-muted-foreground">After</span></div>
  if (component === "progress") return <div className="w-72"><Progress value={64} /></div>
  if (component === "skeleton") return <div className="flex w-72 flex-col gap-3"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-24 w-full rounded-xl" /></div>
  if (component === "dialog") return <Dialog><DialogTrigger render={<Button variant="outline">Open dialog</Button>} /><DialogPopup><DialogTitle>Deploy dashboard?</DialogTitle><DialogDescription>Your latest changes will be published to the team workspace.</DialogDescription><div className="flex justify-end gap-2"><Button variant="ghost">Cancel</Button><Button>Deploy</Button></div></DialogPopup></Dialog>
  if (component === "alert-dialog") return <AlertDialog><AlertDialogTrigger render={<Button variant="destructive-outline">Delete workspace</Button>} /><AlertDialogPopup><AlertDialogTitle>Delete workspace?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. All workspace data will be removed.</AlertDialogDescription><div className="flex justify-end gap-2"><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Delete</AlertDialogAction></div></AlertDialogPopup></AlertDialog>
  if (component === "alert") return <Alert><div><AlertTitle>System saved</AlertTitle><AlertDescription>Your updated tokens are ready to export.</AlertDescription></div></Alert>
  if (component === "empty") return <Empty><EmptyTitle>No saved systems</EmptyTitle><EmptyDescription>Create a System to keep your tuned tokens and component defaults.</EmptyDescription><Button size="sm">Create System</Button></Empty>
  if (component === "toggle") return <Toggle defaultPressed>Preview mode</Toggle>
  if (component === "meter") return <div className="w-full max-w-sm space-y-2"><div className="flex justify-between text-sm"><span>Storage</span><span className="text-muted-foreground">72%</span></div><Meter value={72} /></div>
  if (component === "accordion") return <Accordion className="w-full max-w-md" defaultValue={["tokens"]}><AccordionItem value="tokens"><AccordionHeader><AccordionTrigger>Token settings</AccordionTrigger></AccordionHeader><AccordionPanel>Adjust ramps, semantic colors, radius, and typography from the rail.</AccordionPanel></AccordionItem><AccordionItem value="components"><AccordionHeader><AccordionTrigger>Component defaults</AccordionTrigger></AccordionHeader><AccordionPanel>Each System stores declared component knobs as CSS variables.</AccordionPanel></AccordionItem></Accordion>
  if (component === "collapsible") return <Collapsible className="w-full max-w-md" defaultOpen><CollapsibleTrigger>Show implementation notes</CollapsibleTrigger><CollapsiblePanel className="mt-3">Raya exports copy-source components and token Systems through a shadcn-compatible registry.</CollapsiblePanel></Collapsible>
  if (component === "breadcrumb") return <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="/#components">Systems</BreadcrumbLink><BreadcrumbSeparator /></BreadcrumbItem><BreadcrumbItem><BreadcrumbLink href="/studio-shell-proto?variant=D&component=card">Baseline</BreadcrumbLink><BreadcrumbSeparator /></BreadcrumbItem><BreadcrumbItem><BreadcrumbPage>Button</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
  if (component === "kbd") return <Group><span className="text-sm">Open command menu</span><Kbd>⌘</Kbd><Kbd>K</Kbd></Group>
  if (component === "group") return <Group><Button size="sm">Save</Button><Button size="sm" variant="outline">Export</Button></Group>
  if (component === "form") return <Form className="w-full max-w-sm"><Field><FieldLabel>Email</FieldLabel><FieldControl><Input placeholder="you@example.com" /></FieldControl></Field><FormActions><Button size="sm" variant="outline">Cancel</Button><Button size="sm">Save</Button></FormActions></Form>
  if (component === "fieldset") return <Fieldset className="w-full max-w-sm"><FieldsetLegend>Notification preferences</FieldsetLegend><label className="flex items-center gap-2 text-sm"><Checkbox /><span>Product updates</span></label><label className="flex items-center gap-2 text-sm"><Checkbox /><span>Weekly digest</span></label></Fieldset>
  if (component === "input-group") return <InputGroup className="max-w-sm"><InputGroupAddon>https://</InputGroupAddon><InputGroupInput placeholder="raya.alfrizk.dev" /><InputGroupAddon>.com</InputGroupAddon></InputGroup>
  if (component === "label") return <div className="flex w-full max-w-sm flex-col gap-2"><Label htmlFor="preview-label">Workspace name</Label><Input id="preview-label" placeholder="Raya" /></div>
  if (component === "autocomplete") return <Autocomplete items={["Baseline", "Terminal", "Editorial", "Contrast"]}><div className="w-full max-w-sm"><AutocompleteInput placeholder="Search Systems…" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30" /></div><AutocompletePortal><AutocompletePositioner sideOffset={4}><AutocompletePopup><AutocompleteEmpty className="p-3 text-sm text-muted-foreground">No Systems found.</AutocompleteEmpty><AutocompleteList>{(item: string) => <AutocompleteItem key={item} value={item} className="block cursor-default rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">{item}</AutocompleteItem>}</AutocompleteList></AutocompletePopup></AutocompletePositioner></AutocompletePortal></Autocomplete>
  if (component === "combobox") return <Combobox items={["Baseline", "Terminal", "Editorial"]}><div className="flex w-full max-w-sm gap-2"><ComboboxInput placeholder="Choose a System…" className="h-9 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30" /><ComboboxTrigger render={<Button variant="outline" size="sm">Browse</Button>} /></div><ComboboxPortal><ComboboxPositioner sideOffset={4}><ComboboxPopup><ComboboxEmpty className="p-3 text-sm text-muted-foreground">No Systems found.</ComboboxEmpty><ComboboxList>{(item: string) => <ComboboxItem key={item} value={item} className="block cursor-default rounded px-2 py-1.5 text-sm data-highlighted:bg-accent">{item}</ComboboxItem>}</ComboboxList></ComboboxPopup></ComboboxPositioner></ComboboxPortal><ComboboxValue /></Combobox>
  if (component === "number-field") return <NumberField defaultValue={8} min={0} max={24} className="flex w-40 flex-col gap-2"><label className="text-sm font-medium">Spacing scale</label><NumberFieldGroup className="flex h-9 overflow-hidden rounded-md border border-input bg-background"><NumberFieldDecrement>−</NumberFieldDecrement><NumberFieldInput className="min-w-0 flex-1 bg-transparent text-center text-sm outline-none" /><NumberFieldIncrement>+</NumberFieldIncrement></NumberFieldGroup></NumberField>
  if (component === "radio") return <label className="flex items-center gap-2 text-sm"><Radio value="baseline" /><span>Baseline System</span></label>
  if (component === "checkbox-group") return <CheckboxGroup aria-label="Token layers"><label className="flex items-center gap-2 text-sm"><Checkbox /><span>Primitive ramp</span></label><label className="flex items-center gap-2 text-sm"><Checkbox /><span>Semantic tokens</span></label></CheckboxGroup>
  if (component === "otp-field") return <OTPField />
  if (component === "calendar") return <Calendar />
  if (component === "date-picker") return <DatePicker />
  if (component === "table") return <Table className="max-w-md"><TableHeader><TableRow><TableHead>System</TableHead><TableHead>Status</TableHead><TableHead>Items</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Baseline</TableCell><TableCell>Ready</TableCell><TableCell>42</TableCell></TableRow><TableRow><TableCell>Terminal</TableCell><TableCell>Draft</TableCell><TableCell>18</TableCell></TableRow></TableBody></Table>
  if (component === "frame") return <Frame className="w-full max-w-md"><FrameHeader><span className="text-sm font-medium">System preview</span><Kbd>⌘K</Kbd></FrameHeader><FrameContent><p className="text-sm text-muted-foreground">A contained surface for docs, previews, and application content.</p></FrameContent></Frame>
  if (component === "scroll-area") return <ScrollArea className="h-32 w-full max-w-md rounded-md border border-border p-4"><div className="space-y-3 text-sm text-muted-foreground">{Array.from({ length: 8 }, (_, i) => <p key={i}>Scrollable content row {i + 1}</p>)}</div></ScrollArea>
  if (component === "menu") return <Menu><MenuTrigger render={<Button variant="outline">Open menu</Button>} /><MenuContent><MenuItem>Rename System</MenuItem><MenuItem>Duplicate System</MenuItem><MenuItem>Delete System</MenuItem></MenuContent></Menu>
  if (component === "sidebar") return <Sidebar className="min-h-56 rounded-lg border border-sidebar-border"><SidebarHeader><span className="text-sm font-semibold">Raya Studio</span></SidebarHeader><SidebarContent><SidebarItem active>Systems</SidebarItem><SidebarItem>Components</SidebarItem><SidebarItem>Export</SidebarItem></SidebarContent></Sidebar>
  if (component === "sheet") return <Sheet><SheetTrigger render={<Button variant="outline">Open sheet</Button>} /><SheetContent className="fixed inset-y-0 right-0 z-50 h-full w-[min(22rem,90vw)] translate-x-0 rounded-none border-l border-border bg-background p-6"><SheetTitle>System details</SheetTitle><SheetDescription className="mt-2">Tune this System from the control rail.</SheetDescription></SheetContent></Sheet>
  if (component === "drawer") return <Drawer><DrawerTrigger render={<Button variant="outline">Open drawer</Button>} /><DrawerContent className="fixed inset-x-0 bottom-0 z-50 rounded-t-xl border-t border-border bg-background p-6"><DrawerTitle>Quick actions</DrawerTitle><DrawerDescription className="mt-2">Export or duplicate this System.</DrawerDescription></DrawerContent></Drawer>
  if (component === "context-menu") return <ContextMenu><ContextMenuTrigger render={<div className="flex h-24 w-full max-w-sm items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">Right click preview</div>} /><ContextMenuContent><ContextMenuItem>Copy token</ContextMenuItem><ContextMenuItem>Inspect component</ContextMenuItem></ContextMenuContent></ContextMenu>
  if (component === "toast") return <ToastProvider><ToastDemo /><ToastPortal><ToastViewport><ToastList /></ToastViewport></ToastPortal></ToastProvider>
  if (component === "preview-card") return <PreviewCard><PreviewCardTrigger render={<a href="/studio-shell-proto?variant=D&component=card" className="text-sm font-medium underline underline-offset-4">Hover System link</a>} /><PreviewCardContent className="w-64 rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-lg"><p className="font-medium">Baseline System</p><p className="mt-1 text-sm text-muted-foreground">Quiet blue-violet tokens with comfortable component defaults.</p></PreviewCardContent></PreviewCard>
  if (component === "navigation-menu") return <NavigationMenu><NavigationMenuLink href="/#components" active>Systems</NavigationMenuLink><NavigationMenuLink href="/studio-shell-proto?variant=D&component=button">Components</NavigationMenuLink><NavigationMenuLink href="/docs">Docs</NavigationMenuLink></NavigationMenu>
  if (component === "toolbar") return <Toolbar><Button size="sm" variant="ghost">Bold</Button><Button size="sm" variant="ghost">Italic</Button><ToolbarSeparator /><Button size="sm" variant="ghost">Align</Button><Button size="sm" variant="ghost">More</Button></Toolbar>
  if (component === "menubar") return <Menubar><MenubarItem>File</MenubarItem><MenubarItem>Edit</MenubarItem><MenubarItem>View</MenubarItem><MenubarItem>Help</MenubarItem></Menubar>
  if (component === "filterable-menu") return <FilterableMenu items={["Rename System", "Duplicate System", "Export tokens", "Delete System"]} />
  if (component === "command") return <Command items={["Open Systems", "Browse components", "Export tokens", "Toggle theme"]} />
  if (component === "toggle-group") return <ToggleGroup defaultValue="day"><ToggleGroupItem value="day">Day</ToggleGroupItem><ToggleGroupItem value="week">Week</ToggleGroupItem><ToggleGroupItem value="month">Month</ToggleGroupItem></ToggleGroup>
  if (component === "pagination") return <Pagination><PaginationContent><PaginationItem><PaginationLink href="/studio-shell-proto?variant=D&component=button">Prev</PaginationLink></PaginationItem><PaginationItem><PaginationLink href="/studio-shell-proto?variant=D&component=pagination" isActive>1</PaginationLink></PaginationItem><PaginationItem><PaginationLink href="/studio-shell-proto?variant=D&component=table">2</PaginationLink></PaginationItem><PaginationItem><PaginationLink href="/studio-shell-proto?variant=D&component=table">Next</PaginationLink></PaginationItem></PaginationContent></Pagination>
  if (component === "dropdown-menu") return <DropdownMenu><DropdownMenuTrigger render={<Button variant="outline">Workspace actions</Button>} /><DropdownMenuContent><DropdownMenuItem>Rename workspace</DropdownMenuItem><DropdownMenuItem>Duplicate workspace</DropdownMenuItem><DropdownMenuItem>Export tokens</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
  if (component === "popover") return <Popover><PopoverTrigger render={<Button variant="outline">Show details</Button>} /><PopoverContent className="w-64"><p className="font-medium">Production workspace</p><p className="mt-1 text-muted-foreground">Last deployed 4 minutes ago.</p></PopoverContent></Popover>
  if (component === "data-table") return <div className="w-full max-w-3xl"><DataTable columns={columns as never} data={customers.slice(0, 4)} pageSize={4} /></div>
  if (component === "chart-line") return <div className="w-full max-w-2xl"><LineChartWrapper data={mrrTrend as unknown as Array<Record<string, unknown>>} xKey="month" series={[{ key: "mrr", label: "MRR" }]} /></div>
  if (component === "chart-area") return <div className="w-full max-w-2xl"><AreaChartWrapper data={traffic as unknown as Array<Record<string, unknown>>} xKey="month" series={[{ key: "organic", label: "Organic" }]} /></div>
  if (component === "chart-bar") return <div className="w-full max-w-2xl"><BarChartWrapper data={signupsByChannel as unknown as Array<Record<string, unknown>>} xKey="channel" series={[{ key: "signups", label: "Signups" }]} /></div>
  if (component === "chart-pie") return <PieChartWrapper data={planMix as unknown as Array<Record<string, unknown>>} nameKey="plan" valueKey="accounts" slices={planMix.map((p, i) => ({ key: p.plan, label: p.plan, colorVar: `--chart-${i + 1}` }))} height={220} />
  if (component === "chart-sparkline") return <Sparkline height={44} valueKey="v" data={kpiCards[0].sparkline.map((v, i) => ({ i, v }))} colorVar="--chart-1" />
  if (component === "kpi-card") return <KpiCard label={kpiCards[0].label} value={kpiCards[0].value} delta={kpiCards[0].delta} />
  if (component === "filter-bar") return <div className="w-full max-w-3xl"><FilterBar search="" onSearchChange={() => undefined} filters={[{ key: "plan", placeholder: "All plans", options: ["Starter", "Growth", "Scale"] }]} onReset={() => undefined} /></div>
  return <Button variant="outline">Preview {component}</Button>
}

export function Canvas({ studio }: { studio: Studio }) {
  const [filterSearch, setFilterSearch] = useState("")
  void filterSearch
  return (
    <main className="min-w-0 flex-1 overflow-y-auto bg-background/70 p-4 lg:p-6">
      <div className="coss-container mb-5 flex items-center gap-2 px-0">
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
            {COMPONENT_NAMES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        )}
      </div>
      {studio.view === "gallery" ? (
        <>
          <div className="coss-container mb-5 px-0">
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
