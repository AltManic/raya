import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Raya</h1>
      <p>Studio scaffold — tuner surface lands in the Studio UI ticket.</p>
    </main>
  )
}
