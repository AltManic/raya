import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox, CheckboxIndicator } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, Radio } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, Tab, TabsList, TabPanel } from '@/components/ui/tabs'
import { KpiCard } from '@/components/ui/kpi-card'
import { Sparkline } from '@/components/ui/chart-sparkline'
import { LineChartWrapper } from '@/components/ui/chart-line'
import { DataTable } from '@/components/ui/data-table'

const spark = Array.from({ length: 12 }, (_, i) => ({ i, v: 10 + i * 2 }))
const rows = [
  { id: 'SHP-1', company: 'Northwind Labs', plan: 'Scale', status: 'active', mrr: 1240 },
  { id: 'SHP-2', company: 'Acme Foundry', plan: 'Growth', status: 'trialing', mrr: 420 },
]

function Inventory() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1rem' }}>
      <Button>Deploy</Button>
      <Input placeholder="Search…" />
      <Textarea placeholder="Message…" />
      <Select items={['A', 'B'].map((o) => ({ label: o, value: o }))}>
        <SelectTrigger><SelectValue placeholder="Pick" /></SelectTrigger>
        <SelectContent>
          {['A', 'B'].map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
        </SelectContent>
      </Select>
      <Checkbox defaultChecked><CheckboxIndicator /></Checkbox>
      <Switch defaultChecked />
      <RadioGroup defaultValue="a"><Radio value="a" /><Radio value="b" /></RadioGroup>
      <Slider defaultValue={[40]} />
      <Card><CardTitle>Card</CardTitle><CardDescription>Description</CardDescription></Card>
      <Badge>badge</Badge>
      <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
      <Tabs defaultValue="one">
        <TabsList><Tab value="one">One</Tab><Tab value="two">Two</Tab></TabsList>
        <TabPanel value="one" /><TabPanel value="two" />
      </Tabs>
      <KpiCard label="MRR" value="$74,210" delta={{ value: '8.2%', direction: 'up' }} sparkline={<Sparkline data={spark} valueKey="v" height={24} />} />
      <LineChartWrapper data={[{ m: 'Jan', v: 10 }, { m: 'Feb', v: 14 }]} xKey="m" series={[{ key: 'v', label: 'V' }]} height={120} />
      <DataTable columns={[{ accessorKey: 'company', header: 'Company' }, { accessorKey: 'mrr', header: 'MRR' }]} data={rows} pageSize={15} />
    </div>
  )
}

export default function App() {
  return (
    <>
      <section data-raya="baseline">
        <h2>Baseline</h2>
        <Inventory />
      </section>
      <section data-raya="terminal" className="dark">
        <h2>Terminal (dark)</h2>
        <Inventory />
      </section>
    </>
  )
}
