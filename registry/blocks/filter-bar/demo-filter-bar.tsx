import { useMemo, useState } from "react"
import { FilterBar } from "./filter-bar"

const ROWS = [
  { id: "SHP-1042", customer: "Northwind Labs", plan: "Scale", status: "active", mrr: 1240 },
  { id: "SHP-1017", customer: "Acme Foundry", plan: "Growth", status: "trial", mrr: 420 },
  { id: "SHP-1088", customer: "Bluepeak Systems", plan: "Starter", status: "active", mrr: 99 },
  { id: "SHP-1103", customer: "Cobalt & Sons", plan: "Scale", status: "past_due", mrr: 1240 },
  { id: "SHP-1121", customer: "Driftwood AI", plan: "Growth", status: "active", mrr: 460 },
]

export function DemoFilterBar() {
  const [search, setSearch] = useState("")
  const [plan, setPlan] = useState<string | undefined>()
  const [status, setStatus] = useState<string | undefined>()

  const filtered = useMemo(
    () =>
      ROWS.filter(
        (r) =>
          r.customer.toLowerCase().includes(search.toLowerCase()) &&
          (!plan || r.plan === plan) &&
          (!status || r.status === status),
      ),
    [search, plan, status],
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontFamily: "var(--font-sans)" }}>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filters={[
          { key: "plan", placeholder: "Plan", options: ["Starter", "Growth", "Scale"], value: plan, onChange: setPlan },
          { key: "status", placeholder: "Status", options: ["active", "trial", "past_due"], value: status, onChange: setStatus },
        ]}
        onReset={() => {
          setSearch("")
          setPlan(undefined)
          setStatus(undefined)
        }}
      />
      <span className="text-xs text-muted-foreground">
        Showing {filtered.length} of {ROWS.length} demo rows — wire `filters` to your own table state in production.
      </span>
      <table className="raya-table">
        <thead>
          <tr>
            {["ID", "Customer", "Plan", "Status", "MRR"].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.customer}</td>
              <td>{r.plan}</td>
              <td>{r.status}</td>
              <td>${r.mrr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { FilterBar }
