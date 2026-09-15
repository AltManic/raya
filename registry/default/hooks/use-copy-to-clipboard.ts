"use client"

import * as React from "react"

export function useCopyToClipboard({ timeout = 2000, onCopy }: { timeout?: number; onCopy?: () => void } = {}) {
  const [isCopied, setIsCopied] = React.useState(false)
  const timeoutIdRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const copyToClipboard = (value: string) => {
    if (typeof window === "undefined" || !navigator.clipboard?.writeText || !value) return
    navigator.clipboard.writeText(value).then(() => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)
      setIsCopied(true)
      onCopy?.()
      if (timeout !== 0) {
        timeoutIdRef.current = setTimeout(() => {
          setIsCopied(false)
          timeoutIdRef.current = null
        }, timeout)
      }
    }).catch(() => undefined)
  }

  React.useEffect(() => () => {
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)
  }, [])

  return { copyToClipboard, isCopied }
}
