import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import type { ComponentProps } from "react"

const cx = (...parts: unknown[]) => parts.filter((p): p is string => typeof p === "string").join(" ")

export const Slider = ({ className, children, ...props }: Omit<ComponentProps<typeof SliderPrimitive.Root>, "className"> & { className?: string }) => (
  <SliderPrimitive.Root data-slot="slider" className={cx("raya-slider-root", className)} {...props}>
    <SliderPrimitive.Control data-slot="slider-control" className="raya-slider-control flex-1">
      <SliderPrimitive.Track data-slot="slider-track" className="raya-slider-track">
        <SliderPrimitive.Indicator data-slot="slider-indicator" className="raya-slider-range" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb data-slot="slider-thumb" className="raya-slider-thumb" />
    </SliderPrimitive.Control>
    {children}
  </SliderPrimitive.Root>
)
