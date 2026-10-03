import { VariantChart } from "./chart-variants"

export function CandlestickChart(props: { className?: string }) {
  return <VariantChart variant="chart-candlestick" {...props} />
}
