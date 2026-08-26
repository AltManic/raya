import { copyFileSync, mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { emitConfig, emitStylesheet } from "../src/lib/model/export"
import { baseline, terminal } from "../src/lib/systems"

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, "..")
const outDir = join(root, "src", "styles", "raya")
const registrySystemsDir = join(root, "registry", "default", "systems")
const coreSrc = join(root, "registry", "default", "styles", "core.css")

mkdirSync(join(outDir, "systems"), { recursive: true })
mkdirSync(registrySystemsDir, { recursive: true })
copyFileSync(coreSrc, join(outDir, "core.css"))

const systems = [baseline, terminal]
for (const sys of systems) {
  const css = emitStylesheet(sys)
  writeFileSync(join(outDir, "systems", `${sys.slug}.css`), css)
  writeFileSync(join(registrySystemsDir, `${sys.slug}.css`), css)
  const config = emitConfig(sys)
  writeFileSync(join(registrySystemsDir, `${sys.slug}.json`), JSON.stringify(config, null, 2) + "\n")
  console.log(`emitted ${sys.slug} (stylesheet + config)`)
}
console.log("copied src/styles/raya/core.css")
