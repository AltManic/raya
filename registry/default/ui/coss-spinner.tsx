/*
 * COSS-aligned port of coss ui's `registry/default/ui/spinner.tsx` @ e937bec (MIT surface).
 * One change from coss: lucide-react's `Loader2Icon` is authored through raya's
 * multi-library `IconPlaceholder`, so the shadcn CLI swaps in the consumer's icon library
 * at install. Two porting rules fell out of the roundtrip fixture:
 *   1. never reference `typeof IconPlaceholder` in exported types — the CLI strips the import;
 *   2. `props` must be narrow (className only), because install spreads them onto an SVG
 *      component whose event-target variance a span-props type cannot satisfy.
 *
 * Installed (hugeicons) result:
 *   import { HugeiconsIcon } from "@hugeicons/react";
 *   import { Loading03Icon } from "@hugeicons/core-free-icons";
 *   <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} aria-label="Loading" className="animate-spin" role="status" />
 */
import type React from "react";
import { cn } from "@/registry/default/lib/utils";
import { IconPlaceholder } from "@/registry/internal/icon-placeholder";

export interface SpinnerProps {
  className?: string;
}

export function Spinner({ className, ...props }: SpinnerProps): React.ReactElement {
  return (
    <IconPlaceholder
      aria-label="Loading"
      className={cn("animate-spin", className)}
      hugeicons="Loading03Icon"
      lucide="Loader2Icon"
      phosphor="SpinnerGap"
      remixicon="RiLoader4Line"
      role="status"
      tabler="IconLoader2"
      {...props}
    />
  );
}
