/*
 * Component compatibility gallery for the COSS-aligned registry.
 * Route: /coss-proto.
 * The header controls System switching + dark mode exactly like the Studio.
 */
import { Add01Icon, ArrowRight01Icon, Loading03Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute } from "@tanstack/react-router"
import { Header } from "@/components/studio/header"
import { useStudio } from "@/lib/studio/use-studio"
import { Button } from "@/registry/default/ui/coss-button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardFrame,
  CardFrameAction,
  CardFrameDescription,
  CardFrameFooter,
  CardFrameHeader,
  CardFrameTitle,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/registry/default/ui/coss-card"
import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "@/registry/default/ui/coss-field"
import { Input } from "@/registry/default/ui/coss-input"

export const Route = createFileRoute("/coss-proto")({
  component: CossProtoPage,
})

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-4 font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

function CossProtoPage() {
  const studio = useStudio()
  return (
    <div className={`coss-theme flex h-dvh flex-col overflow-hidden bg-sidebar font-sans text-foreground ${studio.dark ? "dark" : ""}`} data-raya={studio.activeSlug}>
      <Header studio={studio} />
      <main className="flex-1 overflow-y-auto bg-background p-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <header className="flex flex-col gap-1">
            <h1 className="font-heading text-2xl font-semibold text-foreground">Coss components in raya</h1>
            <p className="text-sm text-muted-foreground">
              COSS-aligned Button, Input, Field, and Card implementations running on Raya Systems.
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              System: <span className="text-foreground">{studio.active.name}</span> ({studio.active.slug}) · Mode:{" "}
              <span className="text-foreground">{studio.dark ? "dark" : "light"}</span>
            </p>
          </header>

          <Section title="Button — variants">
            <div className="flex flex-wrap items-center gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="destructive-outline">Destructive outline</Button>
              <Button variant="link">Link</Button>
            </div>
          </Section>

          <Section title="Button — sizes, icons, loading">
            <div className="flex flex-wrap items-center gap-2">
              <Button size="xs">Extra small</Button>
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Add">
                <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
              </Button>
              <Button>
                Search
                <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
              </Button>
              <Button variant="outline">
                Continue
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button loading>Deploy dashboard</Button>
              <Button variant="secondary" loading>
                Syncing
              </Button>
            </div>
          </Section>

          <Section title="Icons — what the CLI emits (documentation only)">
            <p className="text-xs text-muted-foreground">
              Authored as <code className="font-mono">&lt;IconPlaceholder hugeicons="Loading03Icon" /&gt;</code>; the CLI installs{" "}
              <code className="font-mono">@hugeicons/react</code> + <code className="font-mono">core-free-icons</code> and rewrites it to the
              renders below. The loading Button above resolves to the same spinner in the studio and in installed registry output.
            </p>
            <div className="flex items-center gap-3 text-foreground">
              <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-4" />
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4" />
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
              <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
            </div>
          </Section>

          <Section title="Input + Field">
            <div className="flex max-w-md flex-col gap-5">
              <Input placeholder="Email address…" />
              <Field>
                <FieldLabel>Workspace name</FieldLabel>
                <FieldControl placeholder="signalpath" />
                <FieldDescription>Lowercase letters and dashes.</FieldDescription>
              </Field>
              <Field invalid>
                <FieldLabel>Workspace name</FieldLabel>
                <FieldControl defaultValue="Signal Path" />
                <FieldError>Lowercase letters and dashes only.</FieldError>
              </Field>
            </div>
          </Section>

          <Section title="Card">
            <Card>
              <CardHeader>
                <CardTitle>Signalpath Analytics</CardTitle>
                <CardDescription>Fictional dev-tool SaaS powering the demo dashboards.</CardDescription>
                <CardAction>
                  <Button size="xs" variant="outline">
                    Edit
                  </Button>
                </CardAction>
              </CardHeader>
              <CardPanel className="text-sm text-muted-foreground">
                MRR grew 8.2% month over month; net revenue retention is 112%.
              </CardPanel>
              <CardFooter className="justify-end gap-2">
                <Button size="sm" variant="ghost">
                  Cancel
                </Button>
                <Button size="sm">Save</Button>
              </CardFooter>
            </Card>

            <CardFrame>
              <CardFrameHeader>
                <CardFrameTitle>Recent activity</CardFrameTitle>
                <CardFrameDescription>Frame + card clipping behaviour.</CardFrameDescription>
                <CardFrameAction>
                  <Button size="xs" variant="outline">
                    View all
                  </Button>
                </CardFrameAction>
              </CardFrameHeader>
              <Card>
                <CardPanel className="text-sm text-muted-foreground">A nested card inside the frame, clipped to its radius.</CardPanel>
              </Card>
              <CardFrameFooter className="text-xs text-muted-foreground">Updated 4 minutes ago</CardFrameFooter>
            </CardFrame>
          </Section>
        </div>
      </main>
    </div>
  )
}
