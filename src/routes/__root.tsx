import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import styles from '../styles.css?url'
import { Button } from '@/registry/default/ui/coss-button'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Raya is a tunable COSS-aligned design-system studio with live previews and a shadcn-style registry.' },
      { title: 'Raya — COSS-aligned design-system studio' },
      { name: 'theme-color', content: '#171717' },
      { property: 'og:title', content: 'Raya — COSS-aligned design-system studio' },
      { property: 'og:description', content: 'Browse, tune, and install COSS-aligned components through Raya Systems.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [{ rel: 'stylesheet', href: styles }, { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  }),
  notFoundComponent: NotFound,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <main className="coss-theme flex min-h-svh items-center justify-center bg-sidebar px-6 font-sans text-foreground">
      <section className="w-full max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">404</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight">That page is not in the registry.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">The route may have moved, or the component name may not be part of this System yet.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Button render={<a href="/ui" />}>Browse components</Button>
          <Button variant="outline" render={<a href="/" />}>Open studio</Button>
        </div>
      </section>
    </main>
  )
}
