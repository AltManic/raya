import * as React from "react"

export interface IconPlaceholderProps extends React.ComponentProps<"span"> {
  lucide?: string
  tabler?: string
  hugeicons?: string
  phosphor?: string
  remixicon?: string
}

/**
 * Authoring-time stand-in for an icon. The shadcn CLI replaces this element
 * with the consumer's configured iconLibrary imports at install time.
 */
export function IconPlaceholder(props: IconPlaceholderProps) {
  return <span aria-hidden="true" {...props} />
}
