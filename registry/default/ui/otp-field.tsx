"use client"

import { useRef, useState } from "react"
import type { KeyboardEvent } from "react"
import { cn } from "@/registry/default/lib/utils"

export function OTPField({ length = 6, className, onComplete }: { length?: number; className?: string; onComplete?: (value: string) => void }) {
  const [value, setValue] = useState<string[]>(() => Array.from({ length }, () => ""))
  const refs = useRef<Array<HTMLInputElement | null>>([])
  const update = (index: number, next: string) => { const digit = next.replace(/\D/g, "").slice(-1); const nextValue = [...value]; nextValue[index] = digit; setValue(nextValue); if (digit && index < length - 1) refs.current[index + 1]?.focus(); if (nextValue.every(Boolean)) onComplete?.(nextValue.join("")) }
  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => { if (event.key === "Backspace" && !value[index] && index > 0) refs.current[index - 1]?.focus() }
  return <div role="group" aria-label="One-time password" className={cn("flex items-center gap-2", className)}>{value.map((digit, index) => <input key={index} ref={(element) => { refs.current[index] = element }} value={digit} onChange={(event) => update(index, event.target.value)} onKeyDown={(event) => handleKeyDown(index, event)} inputMode="numeric" maxLength={1} aria-label={`Digit ${index + 1} of ${length}`} className="size-10 rounded-md border border-input bg-background text-center text-lg font-medium outline-none focus:ring-2 focus:ring-ring/30" />)}</div>
}
