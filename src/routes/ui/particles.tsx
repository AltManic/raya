import { createFileRoute } from "@tanstack/react-router"
import { Rails, SiteFooter, SiteHeader } from "@/routes/studio-shell-proto"
import { useStudio } from "@/lib/studio/use-studio"
import { Button } from "@/registry/default/ui/coss-button"
import { Card, CardDescription, CardPanel, CardTitle } from "@/registry/default/ui/coss-card"
import { Empty, EmptyDescription, EmptyTitle } from "@/registry/default/ui/empty"
import { KpiCard } from "@/registry/default/ui/kpi-card"

export const Route = createFileRoute("/ui/particles")({
  head: () => ({ meta: [{ title: "Raya UI — Particles" }, { name: "description", content: "Composable Raya UI patterns for dashboards and product surfaces." }] }),
  component: ParticlesPage,
})

function ParticlesPage() {
  const studio = useStudio()
  return (
    <div className={"coss-theme relative isolate flex min-h-svh flex-col overflow-clip bg-sidebar font-sans text-foreground" + (studio.dark ? " dark" : "")}>
      <Rails />
      <SiteHeader studio={studio} />
      <main className="coss-container flex w-full flex-1 flex-col px-4 py-12 sm:px-6 lg:py-16">
        <header className="max-w-2xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Raya UI</p>
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Browse particles.</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">Composable patterns for the moments around your components: metrics, empty states, and product surfaces.</p>
        </header>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <section className="space-y-3" aria-labelledby="particle-metrics">
            <h2 id="particle-metrics" className="font-heading text-xl font-semibold">Metrics</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <KpiCard label="Monthly revenue" value="$48.2k" delta={{ value: "+8.2%", direction: "up" }} />
              <KpiCard label="Activation" value="72.4%" delta={{ value: "+3.1%", direction: "up" }} />
            </div>
          </section>
          <section className="space-y-3" aria-labelledby="particle-empty">
            <h2 id="particle-empty" className="font-heading text-xl font-semibold">Empty state</h2>
            <Card><CardPanel><Empty><EmptyTitle>No saved Systems</EmptyTitle><EmptyDescription>Start with a System, then tune its components in the studio.</EmptyDescription><Button size="sm" render={<a href="/" />}>Open studio</Button></Empty></CardPanel></Card>
          </section>
          <section className="space-y-3" aria-labelledby="particle-context">
            <h2 id="particle-context" className="font-heading text-xl font-semibold">Context panel</h2>
            <Card><CardPanel><CardTitle>Baseline System</CardTitle><CardDescription className="mt-1">A calm starting point for product surfaces, with accessible defaults and exportable tokens.</CardDescription></CardPanel></Card>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
