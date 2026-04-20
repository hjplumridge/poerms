import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'

const poems = [
  { number: '01', slug: 'she-and-i', title: 'SHE&I', description: 'A dramatic monologue of a man discussing his ex. Toxicity calibrated daily to the FTSE 100.' },
  { number: '02', slug: 'peace-by-piece', title: 'PEACE BY PIECE', description: 'An anti-war poem that grows one syllable for every real bomb detonated around the world.' },
  { number: '03', slug: 'still-water', title: 'STILL WATER', description: 'A modernist epic composed from unfavourable reviews of supermarket own-brand bottled water.' },
  { number: '04', slug: 'trumpd', title: "TRUMP'D", description: "The ballad of Donald J. Trump, told through the ever-evolving edits to his Wikipedia page." },
  { number: '05', slug: 'headlines', title: 'HEADLINES', description: "Today's news headlines paired with today's advertising headlines. Forever." },
  { number: '06', slug: 'please-god', title: 'PLEASE GOD', description: 'A litany of real social media posts beginning with "please god", from across the world.' },
]

export default function Home() {
  const [hoveredPoem, setHoveredPoem] = useState(null)
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toUTCString().split(' ').slice(0, 5).join(' '))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head>
        <title>POERMS, VOL. 1 — Henry Plumridge</title>
        <meta name="description" content="A collection of never-ending, self-generating poems." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap" rel="stylesheet" />
      </Head>

      <main style={styles.main}>
        <header style={styles.header}>
          <span style={styles.headerLeft}>+ POERMS</span>
          <span style={styles.headerCenter}>HENRY PLUMRIDGE</span>
          <span style={styles.headerRight}>{time}</span>
        </header>

        <section style={styles.hero}>
          <h1 style={styles.heroTitle}>POERMS, VOL. 1</h1>
          <p style={styles.heroDesc}>
            This is a collection of never-ending, self-generating poems. Each generates themselves using AI trained on source material and writing guidance. While the themes remain constant, each viewing will produce a different version of each poem.
          </p>
        </section>

        <div style={styles.divider} />

        <section style={styles.poemsList}>
          {poems.map((poem, i) => (
            <Link
              key={poem.slug}
              href={`/poem/${poem.slug}`}
              style={{
                ...styles.poemRow,
                ...(hoveredPoem === i ? styles.poemRowHovered : {}),
              }}
              onMouseEnter={() => setHoveredPoem(i)}
              onMouseLeave={() => setHoveredPoem(null)}
            >
              <span style={styles.poemNumber}>{poem.number}</span>
              <span style={styles.poemTitle}>{poem.title}</span>
              <span style={styles.poemDesc}>{poem.description}</span>
              <span style={styles.poemArrow}>→</span>
            </Link>
          ))}
        </section>

        <footer style={styles.footer}>
          <span style={styles.footerText}>
            © HENRY PLUMRIDGE — POERMS, VOL. 1 — ALL POEMS SELF-GENERATING — ALL POEMS NEVER-ENDING
          </span>
        </footer>
      </main>
    </>
  )
}

const styles = {
  main: {
    minHeight: '100vh',
    background: '#fff',
    color: '#000',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Archivo, Helvetica Neue, Helvetica, Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 40px',
    borderBottom: '1px solid #e0e0e0',
    fontSize: '11px',
    letterSpacing: '0.1em',
    position: 'sticky',
    top: 0,
    background: '#fff',
    zIndex: 100,
    fontFamily: 'Archivo, Helvetica Neue, Helvetica, Arial, sans-serif',
  },
  headerLeft: { color: '#000', fontWeight: '500' },
  headerCenter: { color: '#999' },
  headerRight: { color: '#ccc' },
  hero: {
    padding: '80px 40px 60px',
    maxWidth: '680px',
    margin: '0 auto',
    width: '100%',
    textAlign: 'center',
  },
  heroTitle: {
    fontFamily: 'Archivo, Helvetica Neue, Helvetica, Arial, sans-serif',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.15em',
    color: '#000',
    marginBottom: '24px',
    textTransform: 'uppercase',
  },
  heroDesc: {
    fontFamily: 'Archivo, Helvetica Neue, Helvetica, Arial, sans-serif',
    fontSize: '13px',
    fontWeight: '300',
    color: '#666',
    lineHeight: '1.8',
    letterSpacing: '0.01em',
  },
  divider: {
    height: '1px',
    background: '#e0e0e0',
  },
  poemsList: { flex: 1 },
  poemRow: {
    display: 'grid',
    gridTemplateColumns: '48px 1fr 2fr 32px',
    alignItems: 'center',
    gap: '40px',
    padding: '28px 40px',
    borderBottom: '1px solid #f0f0f0',
    textDecoration: 'none',
    color: '#000',
    transition: 'background 0.15s ease',
    cursor: 'pointer',
    fontFamily: 'Archivo, Helvetica Neue, Helvetica, Arial, sans-serif',
  },
  poemRowHovered: { background: '#fafafa' },
  poemNumber: { fontSize: '11px', letterSpacing: '0.1em', color: '#ccc', fontWeight: '400' },
  poemTitle: { fontSize: '15px', fontWeight: '500', letterSpacing: '0.05em', color: '#000' },
  poemDesc: { fontSize: '12px', color: '#999', lineHeight: '1.6', letterSpacing: '0.01em', fontWeight: '300' },
  poemArrow: { fontSize: '14px', color: '#ccc', textAlign: 'right' },
  footer: { padding: '20px 40px', borderTop: '1px solid #f0f0f0', marginTop: 'auto' },
  footerText: { fontSize: '10px', letterSpacing: '0.12em', color: '#ccc', fontFamily: 'Archivo, Helvetica Neue, Helvetica, Arial, sans-serif' },
}
