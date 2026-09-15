import type { HTMLAttributes } from "react"

export function Progress({ value, max = 100, className, ...props }: HTMLAttributes<HTMLDivElement> & { value?: number; max?: number }) {
  const percentage = value === undefined ? undefined : Math.min(100, Math.max(0, (value / Math.max(1, max)) * 100))
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={value === undefined ? "Loading" : undefined}
      data-state={value === undefined ? "indeterminate" : "determinate"}
      data-slot="progress"
      className={["h-2 w-full overflow-hidden rounded-full bg-muted", className].filter(Boolean).join(" ")}
      {...props}
    >
      <div className={"h-full rounded-full bg-primary transition-[width] duration-300 " + (percentage === undefined ? "w-1/2 animate-[progress-indeterminate_1.4s_ease-in-out_infinite]" : "")} style={percentage === undefined ? undefined : { width: `${percentage}%` }} />
    </div>
  )
}
