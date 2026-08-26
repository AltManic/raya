import { copyFileSync, mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { emitStylesheet } from "../src/lib/model/export"
import { baseline, terminal } from "../src/lib/systems"

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, "..")
const outDir = join(root, "src", "styles", "raya")
const coreSrc = join(root, "registry", "default", "styles", "core.css")

mkdirSync(join(outDir, "systems"), { recursive: true })
copyFileSync(coreSrc, join(outDir, "core.css"))

const systems = [baseline, terminal]
for (const sys of systems) {
  writeFileSync(join(outDir, "systems", `${sys.slug}.css`), emitStylesheet(sys))
  console.log(`emitted src/styles/raya/systems/${sys.slug}.css`)
}
console.log("copied src/styles/raya/core.css")
