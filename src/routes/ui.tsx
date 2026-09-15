import { createFileRoute, redirect } from "@tanstack/react-router"
import { COMPONENT_NAMES } from "@/lib/model/components"
import { CatalogPage, Rails, SiteHeader } from "@/routes/studio-shell-proto"
import { useStudio } from "@/lib/studio/use-studio"

export const Route = createFileRoute("/ui")({
  head: () => ({
    meta: [
      { title: "Raya UI — COSS-aligned components" },
      { name: "description", content: "Accessible, composable Raya UI components built on Base UI." },
    ],
  }),
  beforeLoad: ({ search, location }) => {
    if (location.pathname !== "/ui") return
    const requested = typeof (search as { component?: unknown }).component === "string"
      ? (search as { component: string }).component
      : undefined
    const component = requested && COMPONENT_NAMES.includes(requested as never) ? requested : undefined
    if (component) throw redirect({ to: "/ui/docs/components/$component", params: { component } })
  },
  component: UiCatalog,
})

function UiCatalog() {
  const studio = useStudio()
  return (
    <div className={"coss-theme relative isolate flex min-h-svh flex-col overflow-clip bg-sidebar font-sans text-foreground" + (studio.dark ? " dark" : "")}>
      <Rails />
      <SiteHeader studio={studio} />
      <CatalogPage />
      <footer className="border-t border-border/64 bg-sidebar/60 px-4 py-8 text-xs text-muted-foreground sm:px-6">
        <div className="coss-container flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>Raya is a COSS-aligned studio for tuning and owning your components.</p>
          <nav aria-label="Footer" className="flex items-center gap-3">
            <a href="/docs" className="hover:text-foreground">Docs</a>
            <a href="/r/registry.json" className="hover:text-foreground">Registry</a>
            <a href="/" className="hover:text-foreground">Studio</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
