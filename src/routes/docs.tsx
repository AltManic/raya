import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/docs")({
  beforeLoad: ({ search }) => {
    const component = typeof (search as { component?: unknown }).component === "string"
      ? (search as { component: string }).component
      : undefined
    throw redirect({ to: "/studio-shell-proto", search: { variant: "D", component, prototype: false, catalog: false } })
  },
})
