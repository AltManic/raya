import { createFileRoute } from "@tanstack/react-router"
import { Rails, SiteFooter, SiteHeader } from "@/routes/studio-shell-proto"
import { useStudio } from "@/lib/studio/use-studio"

export const Route = createFileRoute("/ui/docs/get-started")({
  head: () => ({ meta: [{ title: "Raya UI — Get started" }, { name: "description", content: "Install Raya UI components and start building with the COSS-aligned registry." }] }),
  component: GetStarted,
})

function GetStarted() {
  const studio = useStudio()
  return (
    <div className={"coss-theme relative isolate flex min-h-svh flex-col overflow-clip bg-sidebar font-sans text-foreground" + (studio.dark ? " dark" : "")}>
      <Rails />
      <SiteHeader studio={studio} />
      <main className="coss-container flex w-full flex-1 flex-col px-4 py-12 sm:px-6 lg:py-16">
        <article className="mx-auto w-full max-w-3xl">
          <a href="/ui" className="text-sm text-muted-foreground underline underline-offset-4">← Raya UI</a>
          <h1 className="mt-5 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Get started.</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">Install only what you need, own the source, and tune the result through Raya Systems.</p>
          <div className="mt-12 flex flex-col gap-10">
            <section>
              <h2 className="mb-3 font-heading text-2xl font-semibold">1. Install a component</h2>
              <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs leading-relaxed">npx shadcn@latest add https://raya.alfrizk.dev/r/button.json</pre>
            </section>
            <section>
              <h2 className="mb-3 font-heading text-2xl font-semibold">2. Import and compose</h2>
              <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs leading-relaxed">{`import { Button } from "@/components/ui/button"\n\nexport function Example() {\n  return <Button>Save changes</Button>\n}`}</pre>
            </section>
            <section>
              <h2 className="mb-3 font-heading text-2xl font-semibold">3. Tune a System</h2>
              <p className="leading-7 text-muted-foreground">Open the <a className="underline underline-offset-4" href="/">Raya Studio</a> to adjust tokens, typography, radius, and component defaults, then export the System with your registry items.</p>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}
