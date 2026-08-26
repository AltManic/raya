import type { Customer } from "./customers"
import { customers } from "./customers"

export type { Customer }

export interface KpiCardData {
  id: string
  label: string
  value: string
  delta: { value: string; direction: "up" | "down" }
  sparkline: number[]
}

export const kpiCards: KpiCardData[] = [
  {
    id: "mrr",
    label: "Monthly recurring revenue",
    value: "$74,210",
    delta: { value: "8.2%", direction: "up" },
    sparkline: [
      58200, 58900, 58400, 59600, 60800, 61500, 61100, 62400, 63900, 64800,
      65400, 66100, 65700, 67100, 68400, 69200, 70100, 70800, 71400, 72000,
      71700, 72800, 73500, 74200, 73800, 74500, 75100, 74900, 75600, 74210,
    ],
  },
  {
    id: "active-accounts",
    label: "Active accounts",
    value: "274",
    delta: { value: "12 new", direction: "up" },
    sparkline: [
      228, 230, 229, 233, 236, 238, 237, 241, 245, 248,
      250, 252, 251, 255, 258, 260, 262, 261, 264, 267,
      269, 268, 271, 273, 272, 274, 276, 275, 278, 274,
    ],
  },
  {
    id: "trial-conversion",
    label: "Trial → paid conversion",
    value: "31.4%",
    delta: { value: "-1.8%", direction: "down" },
    sparkline: [
      33.5, 33.8, 34.1, 33.9, 34.4, 34.0, 33.6, 33.8, 34.2, 33.7,
      33.4, 33.1, 33.3, 32.9, 32.6, 32.8, 32.4, 32.1, 32.3, 31.9,
      31.7, 31.5, 31.8, 31.4, 31.2, 30.9, 31.1, 30.8, 31.3, 31.4,
    ],
  },
  {
    id: "net-revenue-retention",
    label: "Net revenue retention",
    value: "108%",
    delta: { value: "2 pts", direction: "up" },
    sparkline: [
      99.5, 100, 100.4, 100.2, 101, 101.5, 101.2, 102, 102.6, 103,
      103.4, 103.1, 103.8, 104.2, 104.6, 104.4, 105, 105.4, 105.1, 105.8,
      106.2, 106, 106.6, 107, 107.4, 107.2, 107.8, 108, 108.4, 108,
    ],
  },
]

export function customerToRow(c: Customer): Array<string | number> {
  return [c.id, c.company, c.plan, c.status, `$${c.mrr.toLocaleString("en-US")}`, c.owner]
}
