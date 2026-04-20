import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'

const poems = [
  { number: '01', slug: 'she-and-i', title: 'SHE&I', description: 'A dramatic monologue of a man discussing his ex. Toxicity calibrated daily to the FTSE 100.' },
  { number: '02', slug: 'peace-by-piece', title: 'PEACE BY PIECE', description: 'An anti-war poem that grows one syllable for every real bomb detonated around the world.' },
  { number: '03', slug: 'still-water', title: 'STILL WATER', description: 'A modernist epic composed from unfavourable reviews of supermarket own-brand bottled water.' },
  { number: '04', slug: 'trumpd', title: "TRUMP'D", description: "The ballad of Donald J. Trump, told through the ever-evolving edits to his Wikipedia page." },
  { number: '05', slug: 'headlines', title: 'HEADLINES', description: "Today's news headlines paired with today's advertising headlines. Forever." },
  { number: '06', slug: 'please-god', title: 'PLEASE GOD', description: 'A litany of real social media posts beginning with \"please god\", from across the world.' },
]

export default function Home() {
  const [hoveredPoem, setHoveredPoem] = useState(null)
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head>
        <title>POERMS, VOL. 1</title>
        <meta name="description" content="A collection of never-ending, self-generating poems." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&display=swap" rel="stylesheet" />
      </Head>
      <main style={s.main}>
        <div style={s.topStrip}>
          <span style={s.stripLeft}>POERMS *</span>
          <span style={s.stripRight}>{time}</span>
        </div>
        <section style={s.hero}>
          <div style={s.heroInner}>
            <p style={s.vol}>VOL. 1</p>
            <p style={s.heroBody}>
              This is a collection of never-ending, self-generating poems.
              Each generates themselves using AI trained on source material
              and writing guidance. While the themes remain constant,
              each viewing will produce a different version of each poem.
            </p>
            <p style={s.credit}>Henry Plumridge</p>
          </div>
        </section>
        <div style={s.rule} />
        <section style={s.index}>
          {poems.map((poem, i) => (
            <Link
              key={poem.slug}
              href={`/poem/${poem.slug}`}
              style={{ ...s.row, ...(hoveredPoem === i ? s.rowHover : {}) }}
              onMouseEnter={() => setHoveredPoem(i)}
              onMouseLeave={() => setHoveredPoem(null)}
            >
              <span style={s.rowNum}>{poem.number}</span>
              <span style={s.rowTitle}>{poem.title}</span>
              <span style={s.rowDesc}>{poem.description}</span>
            </Link>
          ))}
        </section>
        <div style={s.bottomStrip}>
          <span style={s.bottomText}>Henry Plumridge &nbsp;*&nbsp; POERMS, Vol. 1 &nbsp;*&nbsp; All poems self-generating &nbsp;*&nbsp; All poems never-ending</span>
        </div>
      </main>
    </>
  )
}

const s = {
  main: { minHeight: '100vh', background: '#f5f2ee', color: '#111', display: 'flex', flexDirection: 'column', fontFamily: 'Archivo, Helvetica Neue, Helvetica, Arial, sans-serif' },
  topStrip: { display: 'flex', justifyContent: 'space-between', padding: '12px 32px', borderBottom: '1px solid #d8d4ce', fontSize: '10px', letterSpacing: '0.18em', fontWeight: '400', color: '#111' },
  stripLeft: {},
  stripRight: { color: '#999' },
  hero: { flex: '0 0 auto', padding: '80px 32px 72px' },
  heroInner: { maxWidth: '480px' },
  vol: { fontSize: '10px', letterSpacing: '0.2em', fontWeight: '400', color: '#999', marginBottom: '32px' },
  heroBody: { fontSize: '13px', fontWeight: '300', lineHeight: '1.9', color: '#444', letterSpacing: '0.01em', marginBottom: '40px' },
  credit: { fontSize: '10px', letterSpacing: '0.18em', fontWeight: '400', color: '#999' },
  rule: { height: '1px', background: '#d8d4ce' },
  index: { flex: 1 },
  row: { display: 'grid', gridTemplateColumns: '40px 200px 1fr', alignItems: 'baseline', gap: '32px', padding: '22px 32px', borderBottom: '1px solid #e8e4df', textDecoration: 'none', color: '#111', transition: 'background 0.1s', cursor: 'pointer' },
  rowHover: { background: '#eeebe6' },
  rowNum: { fontSize: '10px', letterSpacing: '0.1em', color: '#bbb', fontWeight: '400', paddingTop: '2px' },
  rowTitle: { fontSize: '13px', fontWeight: '500', letterSpacing: '0.08em', color: '#111' },
  rowDesc: { fontSize: '12px', fontWeight: '300', color: '#888', lineHeight: '1.5', letterSpacing: '0.01em' },
  bottomStrip: { padding: '12px 32px', borderTop: '1px solid #d8d4ce', marginTop: 'auto' },
  bottomText: { fontSize: '10px', letterSpacing: '0.1em', color: '#bbb', fontWeight: '300' },
}
