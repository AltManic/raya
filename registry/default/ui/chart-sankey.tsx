import { VariantChart } from "./chart-variants"

export function SankeyChart(props: { className?: string }) {
  return <VariantChart variant="chart-sankey" {...props} />
}
