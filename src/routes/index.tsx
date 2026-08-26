import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main style={{ padding: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <h1 style={{ width: '100%', fontFamily: 'var(--font-serif)', fontSize: 32 }}>Raya</h1>
      <button className="raya-button" type="button">Default</button>
      <button className="raya-button" type="button" style={{ ['--raya-button-bg' as string]: 'transparent', ['--raya-button-fg' as string]: 'var(--foreground)', ['--raya-button-border' as string]: 'var(--border)' }}>
        Outline
      </button>
      <input className="raya-input" placeholder="Input" style={{ maxWidth: 220 }} />
      <span className="raya-badge">Badge</span>
      <div className="raya-card" style={{ width: 260 }}>
        <div className="raya-card-title">Card</div>
        <div className="raya-card-description">Token bridge smoke test — radius, fonts, and knob vars resolve from the Baseline System.</div>
      </div>
    </main>
  )
}
