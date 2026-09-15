import { createFileRoute } from "@tanstack/react-router"
import { DocsArticle } from "@/routes/ui/docs/roadmap"
import { useStudio } from "@/lib/studio/use-studio"

export const Route = createFileRoute("/ui/docs/radix-shadcn-migration")({
  head: () => ({ meta: [{ title: "Raya UI — Migration" }, { name: "description", content: "Move an existing shadcn or Radix project to Raya UI." }] }),
  component: Migration,
})

function Migration() {
  const studio = useStudio()
  return <DocsArticle studio={studio} title="Migrate with intent." intro="Raya keeps the shadcn copy-and-own workflow while adopting Base UI primitives and a token-driven System." sections={[
    ["Keep your imports local", "Install a Raya registry item into your existing components/ui directory, then update aliases only where your project differs."],
    ["Map primitives gradually", "Replace one component at a time. The registry items are standalone and preserve native React attributes and composable render props."],
    ["Bring your tokens", "Start with Raya Core, then layer a System stylesheet. Map your existing semantic variables instead of rewriting every screen."],
  ]} />
}
