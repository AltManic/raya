import fs from "node:fs"

async function officialFiles(directory) {
  const response = await fetch(`https://api.github.com/repos/cosscom/coss/contents/apps/ui/registry/default/${directory}`)
  if (!response.ok) throw new Error(`COSS ${directory} request failed: ${response.status}`)
  return (await response.json())
  .filter((entry) => entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))
  .map((entry) => entry.name.replace(/\.(tsx|ts)$/, ""))
}

const official = await officialFiles("ui")
const officialHooks = await officialFiles("hooks")

const registry = JSON.parse(fs.readFileSync("registry.json", "utf8")).items.map((item) => item.name)
const missingSource = official.filter((name) => !fs.existsSync(`registry/default/ui/${name}.tsx`))
const missingHookSource = officialHooks.filter((name) => !fs.existsSync(`registry/default/hooks/${name}.ts`))
const missingRegistry = [...official, ...officialHooks].filter((name) => !registry.includes(name))
const missingPublic = [...official, ...officialHooks].filter((name) => !fs.existsSync(`public/r/${name}.json`))

console.log(`COSS parity: ${official.length} components + ${officialHooks.length} hooks checked`)
for (const [label, values] of [["component source", missingSource], ["hook source", missingHookSource], ["registry", missingRegistry], ["public", missingPublic]]) {
  console.log(`  missing ${label}: ${values.length ? values.join(", ") : "none"}`)
}
if (missingSource.length || missingHookSource.length || missingRegistry.length || missingPublic.length) process.exit(1)
