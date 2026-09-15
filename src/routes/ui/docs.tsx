import { createFileRoute } from "@tanstack/react-router"
import { Rails, SiteFooter, SiteHeader } from "@/routes/studio-shell-proto"
import { useStudio } from "@/lib/studio/use-studio"

export const Route = createFileRoute("/ui/docs")({
  head: () => ({ meta: [{ title: "Raya UI — Docs" }, { name: "description", content: "Documentation for Raya's COSS-aligned components, hooks, and Systems." }] }),
  component: DocsIndex,
})

function DocsIndex() {
  const studio = useStudio()
  const links = [
    ["Get started", "/ui/docs/get-started", "Install a component and tune your first System."],
    ["Components", "/ui", "Browse accessible, composable UI primitives."],
    ["Hooks", "/ui/docs/hooks/use-media-query", "Add responsive behavior with copyable hooks."],
    ["Particles", "/ui/particles", "Browse composed patterns for product surfaces."],
    ["Migration", "/ui/docs/radix-shadcn-migration", "Move an existing shadcn or Radix project."],
    ["Roadmap", "/ui/docs/roadmap", "See what is shipping and what stays in sync."],
  ]
  return <div className={"coss-theme relative isolate flex min-h-svh flex-col overflow-clip bg-sidebar font-sans text-foreground" + (studio.dark ? " dark" : "")}><Rails /><SiteHeader studio={studio} /><main className="coss-container flex w-full flex-1 flex-col px-4 py-12 sm:px-6 lg:py-16"><header className="max-w-2xl"><p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Raya UI</p><h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Documentation for owned UI.</h1><p className="mt-3 text-base leading-7 text-muted-foreground">Browse the registry, copy source into your app, and use Systems to keep the details coherent.</p></header><div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{links.map(([title, href, description]) => <a key={href} href={href} className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-ring/60 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="font-medium">{title}</span><span className="mt-1 block text-sm leading-5 text-muted-foreground">{description}</span><span className="mt-3 block text-xs text-muted-foreground">Read docs →</span></a>)}</div></main><SiteFooter /></div>
}
