import { createFileRoute } from "@tanstack/react-router"
import { Rails, SiteFooter, SiteHeader } from "@/routes/studio-shell-proto"
import { useStudio } from "@/lib/studio/use-studio"

export const Route = createFileRoute("/ui/docs/roadmap")({
  head: () => ({ meta: [{ title: "Raya UI — Roadmap" }, { name: "description", content: "Raya UI implementation roadmap and compatibility notes." }] }),
  component: Roadmap,
})

function Roadmap() {
  const studio = useStudio()
  return <DocsArticle studio={studio} title="Roadmap." intro="The registry grows in public, with source ownership and Base UI compatibility kept first-class." sections={[
    ["Now", "COSS component parity, hook parity, canonical docs routes, and a shadcn-compatible registry are available today."],
    ["Next", "Expand particle patterns, add richer examples per component, and keep accessibility and keyboard behavior covered as the registry evolves."],
    ["Always", "Keep generated registry output, live docs, and the consumer round-trip fixture in sync."],
  ]} />
}

export function DocsArticle({ studio, title, intro, sections }: { studio: ReturnType<typeof useStudio>; title: string; intro: string; sections: string[][] }) {
  return <div className={"coss-theme relative isolate flex min-h-svh flex-col overflow-clip bg-sidebar font-sans text-foreground" + (studio.dark ? " dark" : "")}><Rails /><SiteHeader studio={studio} /><main className="coss-container flex w-full flex-1 flex-col px-4 py-12 sm:px-6 lg:py-16"><article className="mx-auto w-full max-w-3xl"><a href="/ui" className="text-sm text-muted-foreground underline underline-offset-4">← Raya UI</a><h1 className="mt-5 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1><p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">{intro}</p><div className="mt-12 flex flex-col gap-8">{sections.map(([heading, body]) => <section key={heading}><h2 className="mb-2 font-heading text-2xl font-semibold">{heading}</h2><p className="leading-7 text-muted-foreground">{body}</p></section>)}</div></article></main><SiteFooter /></div>
}
