import fs from "node:fs"

const sitemap = fs.readFileSync("public/sitemap.xml", "utf8")
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
if (!urls.length) throw new Error("No URLs found in public/sitemap.xml")

const results = await Promise.all(urls.map(async (url) => {
  const response = await fetch(url, { redirect: "follow" })
  return { url, status: response.status, finalUrl: response.url }
}))
const failures = results.filter(({ status }) => status < 200 || status >= 400)
console.log(`Website smoke check: ${results.length} sitemap URLs checked`)
console.log(`  failures: ${failures.length ? failures.map(({ url, status }) => `${status} ${url}`).join(", ") : "none"}`)
if (failures.length) process.exit(1)
