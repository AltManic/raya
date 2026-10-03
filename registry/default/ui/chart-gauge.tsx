import { VariantChart } from "./chart-variants"

export function GaugeChart(props: { className?: string }) {
  return <VariantChart variant="chart-gauge" {...props} />
}
