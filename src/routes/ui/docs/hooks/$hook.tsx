import { createFileRoute } from "@tanstack/react-router"
import { HOOKS } from "@/lib/model/components"
import { Rails, SiteHeader } from "@/routes/studio-shell-proto"
import { useStudio } from "@/lib/studio/use-studio"

export const Route = createFileRoute("/ui/docs/hooks/$hook")({
  head: ({ params }) => ({
    meta: [
      { title: `Raya UI — ${params.hook}` },
      { name: "description", content: `The ${params.hook} hook in Raya's COSS-aligned registry.` },
    ],
  }),
  component: HookDetail,
})

function HookDetail() {
  const studio = useStudio()
  const { hook: name } = Route.useParams()
  const hook = HOOKS.find((item) => item.name === name)
  if (!hook) return <main className="coss-container px-4 py-16 sm:px-6"><a className="underline" href="/ui">Browse Raya UI</a></main>
  return (
    <div className={"coss-theme relative isolate flex min-h-svh flex-col overflow-clip bg-sidebar font-sans text-foreground" + (studio.dark ? " dark" : "")}>
      <Rails />
      <SiteHeader studio={studio} />
      <main className="coss-container flex w-full flex-1 flex-col px-4 py-8 sm:px-6 lg:py-12">
        <article className="mx-auto flex w-full max-w-3xl flex-col gap-8">
          <header>
            <a href="/ui" className="text-sm text-muted-foreground underline underline-offset-4">← Components and hooks</a>
            <h1 className="mt-5 font-heading text-3xl font-bold xl:text-4xl">{hook.title}</h1>
            <p className="mt-2 text-muted-foreground sm:text-lg">{hook.description}</p>
          </header>
          <section>
            <h2 className="mb-3 border-b border-border pb-2 font-heading text-xl font-semibold">Installation</h2>
            <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs leading-relaxed">{`npx shadcn@latest add https://raya.alfrizk.dev/r/${hook.name}.json`}</pre>
          </section>
          <section>
            <h2 className="mb-3 border-b border-border pb-2 font-heading text-xl font-semibold">Registry source</h2>
            <a className="text-sm underline underline-offset-4" href={`/r/${hook.name}.json`}>View ${hook.title} registry item</a>
          </section>
        </article>
      </main>
    </div>
  )
}
