import { createFileRoute } from "@tanstack/react-router"
import { Header } from "@/components/studio/header"
import { Rail } from "@/components/studio/rail"
import { Canvas } from "@/components/studio/canvas"
import { ExportSlideOver } from "@/components/studio/export-panel"
import { useStudio } from "@/lib/studio/use-studio"

export const Route = createFileRoute("/")({
  component: StudioPage,
})

function StudioPage() {
  const studio = useStudio()
  return (
    <div
      className={`flex h-dvh flex-col overflow-hidden ${studio.dark ? "dark" : ""}`}
      data-raya={studio.activeSlug}
    >
      <Header studio={studio} />
      <div className="flex min-h-0 flex-1">
        <Rail studio={studio} />
        <Canvas studio={studio} />
      </div>
      <ExportSlideOver studio={studio} />
    </div>
  )
}
