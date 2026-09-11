/*
 * PROTOTYPE (#25) — port of coss ui's `registry/default/ui/spinner.tsx` @ e937bec (MIT surface).
 * One change from coss: lucide-react's `Loader2Icon` is authored through raya's
 * `IconPlaceholder`, so the shadcn CLI swaps it for the consumer's HugeIcons at install:
 *
 *   <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} aria-label="Loading" className="animate-spin" role="status" />
 */
import type React from "react";
import { cn } from "@/registry/default/lib/utils";
import { IconPlaceholder } from "@/registry/internal/icon-placeholder";

export function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof IconPlaceholder>): React.ReactElement {
  return (
    <IconPlaceholder
      aria-label="Loading"
      className={cn("animate-spin", className)}
      hugeicons="Loading03Icon"
      role="status"
      {...props}
    />
  );
}
