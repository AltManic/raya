import { createFileRoute } from "@tanstack/react-router"
import { COMPONENT_NAMES } from "@/lib/model/components"
import { ComponentPage, Rails, SidebarNav, SiteHeader } from "@/routes/studio-shell-proto"
import { useStudio } from "@/lib/studio/use-studio"

export const Route = createFileRoute("/ui/docs/components/$component")({
  head: ({ params }) => ({
    meta: [
      { title: `Raya UI — ${params.component}` },
      { name: "description", content: `The ${params.component} component in Raya's COSS-aligned registry.` },
    ],
  }),
  component: ComponentDetail,
})

function ComponentDetail() {
  const studio = useStudio()
  const { component } = Route.useParams()
  if (!COMPONENT_NAMES.includes(component as never)) {
    return <main className="coss-container px-4 py-16 sm:px-6"><a className="underline" href="/ui">Browse all components</a></main>
  }
  return (
    <div className={"coss-theme relative isolate flex min-h-svh flex-col overflow-clip bg-sidebar font-sans text-foreground" + (studio.dark ? " dark" : "")}>
      <Rails />
      <SiteHeader studio={studio} />
      <main id="components" className="coss-container flex w-full flex-1 flex-col px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid items-start lg:grid-cols-[240px_minmax(0,1fr)]">
          <SidebarNav selected={component} onSelect={(name) => { window.location.href = `/ui/docs/components/${name}` }} className="hidden lg:block" />
          <div className="mx-auto w-full max-w-3xl lg:px-8">
            <ComponentPage studio={studio} selected={component} />
          </div>
        </div>
      </main>
      <footer className="border-t border-border/64 bg-sidebar/60 px-4 py-8 text-xs text-muted-foreground sm:px-6">
        <div className="coss-container flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>Raya is a COSS-aligned studio for tuning and owning your components.</p>
          <nav aria-label="Footer" className="flex items-center gap-3">
            <a href="/ui" className="hover:text-foreground">Components</a>
            <a href="/r/registry.json" className="hover:text-foreground">Registry</a>
            <a href="/" className="hover:text-foreground">Studio</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
