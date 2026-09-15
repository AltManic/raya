import { createFileRoute } from "@tanstack/react-router"
import { lazy, Suspense, useState } from "react"
import { Header } from "@/components/studio/header"
import { Rail } from "@/components/studio/rail"
import { Canvas } from "@/components/studio/canvas"
const ExportSlideOver = lazy(() => import("@/components/studio/export-panel").then((module) => ({ default: module.ExportSlideOver })))
import { useStudio } from "@/lib/studio/use-studio"

export const Route = createFileRoute("/")({
  component: StudioPage,
})

function StudioPage() {
  const studio = useStudio()
  const [railOpen, setRailOpen] = useState(false)
  return (
    <div
      className={`coss-theme flex h-dvh flex-col overflow-hidden bg-sidebar font-sans text-foreground ${studio.dark ? "dark" : ""}`}
      data-raya={studio.activeSlug}
    >
      <Header studio={studio} onToggleRail={() => setRailOpen(true)} />
      <div className="coss-container flex min-h-0 flex-1">
        <Rail studio={studio} open={railOpen} onClose={() => setRailOpen(false)} />
        <Canvas studio={studio} />
      </div>
      {studio.exportOpen && <Suspense fallback={null}><ExportSlideOver studio={studio} /></Suspense>}
    </div>
  )
}
