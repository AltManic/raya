const MONTHS_24 = [
  "Sep 24", "Oct 24", "Nov 24", "Dec 24",
  "Jan 25", "Feb 25", "Mar 25", "Apr 25", "May 25", "Jun 25", "Jul 25", "Aug 25",
  "Sep 25", "Oct 25", "Nov 25", "Dec 25",
  "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26", "Jul 26", "Aug 26",
] as const

export interface MonthlyPoint {
  month: string
  mrr: number
  newMrr: number
}

export const mrrTrend: MonthlyPoint[] = MONTHS_24.map((month, i) => {
  const base = 38200 + i * 1450
  const seasonal = [0.9, 0.95, 1.02, 1.05, 1.0, 0.98][i % 6]
  return {
    month,
    mrr: Math.round((base * seasonal) / 10) * 10,
    newMrr: Math.round((1800 + (i % 5) * 260 + seasonal * 400) / 10) * 10,
  }
})

export interface TrafficPoint {
  month: string
  organic: number
  referral: number
  paid: number
}

export const traffic: TrafficPoint[] = [
  { month: "Sep 24", organic: 18400, referral: 4100, paid: 6200 },
  { month: "Oct 24", organic: 19200, referral: 4300, paid: 6800 },
  { month: "Nov 24", organic: 20100, referral: 4500, paid: 7400 },
  { month: "Dec 24", organic: 19800, referral: 4200, paid: 7900 },
  { month: "Jan 25", organic: 21400, referral: 4800, paid: 8600 },
  { month: "Feb 25", organic: 22600, referral: 5100, paid: 9200 },
  { month: "Mar 25", organic: 23900, referral: 5300, paid: 10100 },
  { month: "Apr 25", organic: 25200, referral: 5600, paid: 10800 },
  { month: "May 25", organic: 26400, referral: 5900, paid: 11500 },
  { month: "Jun 25", organic: 27100, referral: 6100, paid: 12300 },
  { month: "Jul 25", organic: 28300, referral: 6400, paid: 13100 },
  { month: "Aug 25", organic: 29600, referral: 6700, paid: 14000 },
  { month: "Sep 25", organic: 30800, referral: 7000, paid: 14700 },
  { month: "Oct 25", organic: 32100, referral: 7200, paid: 15400 },
  { month: "Nov 25", organic: 33400, referral: 7500, paid: 16200 },
  { month: "Dec 25", organic: 34200, referral: 7300, paid: 16900 },
  { month: "Jan 26", organic: 35900, referral: 7800, paid: 17800 },
  { month: "Feb 26", organic: 37200, referral: 8100, paid: 18600 },
  { month: "Mar 26", organic: 38800, referral: 8500, paid: 19500 },
  { month: "Apr 26", organic: 40100, referral: 8800, paid: 20300 },
  { month: "May 26", organic: 41600, referral: 9200, paid: 21200 },
  { month: "Jun 26", organic: 42900, referral: 9500, paid: 22000 },
  { month: "Jul 26", organic: 44300, referral: 9800, paid: 22900 },
  { month: "Aug 26", organic: 45700, referral: 10200, paid: 23800 },
]

export interface SignupPoint {
  channel: string
  signups: number
}

export const signupsByChannel: SignupPoint[] = [
  { channel: "Organic", signups: 486 },
  { channel: "Referral", signups: 342 },
  { channel: "Paid search", signups: 287 },
  { channel: "Social", signups: 198 },
  { channel: "Events", signups: 121 },
  { channel: "Partners", signups: 104 },
  { channel: "Email", signups: 96 },
  { channel: "Direct", signups: 71 },
]

export interface PlanMixSlice {
  plan: string
  accounts: number
}

export const planMix: PlanMixSlice[] = [
  { plan: "Starter", accounts: 148 },
  { plan: "Growth", accounts: 86 },
  { plan: "Scale", accounts: 41 },
  { plan: "Enterprise", accounts: 12 },
]
