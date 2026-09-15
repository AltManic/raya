import type { HTMLAttributes } from "react"

export function Separator({ orientation = "horizontal", className, ...props }: HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      data-slot="separator"
      className={[
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    />
  )
}
