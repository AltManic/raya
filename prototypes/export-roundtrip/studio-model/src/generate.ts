import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { emitConfig, emitStylesheet } from "./export.js";
import type { System } from "./model.js";
import { baseline, terminal } from "./systems.js";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "..", "registry", "public", "r");

const coreCss = readFileSync(join(here, "..", "registry-src", "core.css"), "utf8");

function registryItem(name: string, item: Record<string, unknown>) {
  return JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name,
      ...item,
    },
    null,
    2,
  ) + "\n";
}

function systemItem(sys: System) {
  const css = emitStylesheet(sys);
  const config = emitConfig(sys);
  return registryItem(sys.slug, {
    type: "registry:theme",
    title: `Raya System: ${sys.name}`,
    description: sys.description,
    meta: { raya: "system", slug: sys.slug },
    files: [
      {
        path: `systems/${sys.slug}.css`,
        content: css,
        type: "registry:file",
        target: `src/styles/raya/systems/${sys.slug}.css`,
      },
      {
        path: `systems/${sys.slug}.json`,
        content: JSON.stringify(config, null, 2),
        type: "registry:file",
        target: `src/raya/systems/${sys.slug}.json`,
      },
    ],
    docs: `Add to src/styles.css:\n\n@import "./styles/raya/core.css";\n@import "./styles/raya/systems/${sys.slug}.css";\n\nThe default System also fills :root/.dark; other Systems activate via <html data-raya="${sys.slug}">.`,
  });
}

const coreItem = registryItem("core", {
  type: "registry:item",
  title: "Raya Core",
  description: "Token-to-Tailwind bridge and component classes shared by every System.",
  meta: { raya: "core" },
  files: [
    {
      path: "core.css",
      content: coreCss,
      type: "registry:file",
      target: "src/styles/raya/core.css",
    },
  ],
  docs: `Add to src/styles.css:\n\n@import "./styles/raya/core.css";`,
});

const catalog = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "@raya",
  homepage: "http://localhost:4173",
  items: [
    { name: "core", type: "registry:item", title: "Raya Core" },
    { name: baseline.slug, type: "registry:theme", title: `Raya System: ${baseline.name}` },
    { name: terminal.slug, type: "registry:theme", title: `Raya System: ${terminal.name}` },
  ],
};

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "registry.json"), JSON.stringify(catalog, null, 2) + "\n");
writeFileSync(join(outDir, "core.json"), coreItem);
writeFileSync(join(outDir, `${baseline.slug}.json`), systemItem(baseline));
writeFileSync(join(outDir, `${terminal.slug}.json`), systemItem(terminal));

console.log(`Wrote ${outDir}:`);
for (const f of ["registry.json", "core.json", `${baseline.slug}.json`, `${terminal.slug}.json`]) {
  console.log(`  - ${f}`);
}
