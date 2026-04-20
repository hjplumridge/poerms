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
    const u = () => setTime(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }))
    u(); const i = setInterval(u, 60000); return () => clearInterval(i)
  }, [])
  return (
    <>
      <Head>
        <title>POERMS *</title>
        <meta name="description" content="A collection of never-ending, self-generating poems." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;1,200;1,300&display=swap" rel="stylesheet" />
      </Head>
      <main style={s.main}>
        <div style={s.spine}><span style={s.spineText}>POERMS * HENRY PLUMRIDGE * VOL. 1</span></div>
        <div style={s.content}>
          <div style={s.topBar}>
            <span style={s.topLeft}>POERMS *</span>
            <span style={s.topRight}>{time}</span>
          </div>
          <section style={s.intro}>
            <div style={s.introBlock}>
              <p style={s.introLabel}>VOL. 1 *</p>
              <p style={s.introText}>
                This is a collection of never-ending,<br/>
                self-generating poems. Each generates<br/>
                themselves using AI trained on source<br/>
                material and writing guidance.<br/>
                While the themes remain constant,<br/>
                each viewing will produce a different<br/>
                version of each poem.
              </p>
              <p style={s.introCredit}>Henry Plumridge</p>
            </div>
          </section>
          <div style={s.rule} />
          <section style={s.indexSection}>
            <p style={s.indexLabel}>CONTENTS</p>
            {poems.map((poem, i) => (
              <Link key={poem.slug} href={`/poem/${poem.slug}`}
                style={{ ...s.row, ...(hoveredPoem === i ? s.rowHover : {}) }}
                onMouseEnter={() => setHoveredPoem(i)}
                onMouseLeave={() => setHoveredPoem(null)}>
                <span style={s.rowNum}>{poem.number}</span>
                <span style={s.rowTitle}>{poem.title}</span>
                <span style={s.rowDots} />
                <span style={s.rowDesc}>{poem.description}</span>
              </Link>
            ))}
          </section>
          <div style={s.footer}>
            <span style={s.footerText}>All poems self-generating. All poems never-ending. *</span>
          </div>
        </div>
      </main>
    </>
  )
}

const s = {
  main: { minHeight: '100vh', background: '#f7f4f0', color: '#111', display: 'flex', fontFamily: "'Jost', 'Futura', 'Century Gothic', Helvetica, Arial, sans-serif" },
  spine: { width: '24px', minHeight: '100vh', borderRight: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' },
  spineText: { writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', fontSize: '8px', letterSpacing: '0.25em', fontWeight: '300', color: '#bbb', whiteSpace: 'nowrap' },
  content: { flex: 1, display: 'flex', flexDirection: 'column' },
  topBar: { display: 'flex', justifyContent: 'space-between', padding: '14px 48px 14px 32px', borderBottom: '1px solid #e0dbd4', fontSize: '9px', letterSpacing: '0.25em', fontWeight: '300', color: '#999' },
  topLeft: { color: '#111', fontWeight: '400', letterSpacing: '0.3em' },
  topRight: {},
  intro: { padding: '80px 48px 80px 32px', minHeight: '340px', display: 'flex', alignItems: 'flex-end' },
  introBlock: { maxWidth: '320px' },
  introLabel: { fontSize: '9px', letterSpacing: '0.3em', fontWeight: '400', color: '#aaa', marginBottom: '24px' },
  introText: { fontSize: '11px', fontWeight: '200', lineHeight: '2', color: '#444', letterSpacing: '0.08em', marginBottom: '32px' },
  introCredit: { fontSize: '9px', letterSpacing: '0.3em', fontWeight: '300', color: '#aaa' },
  rule: { height: '1px', background: '#e0dbd4', margin: '0 32px' },
  indexSection: { flex: 1, padding: '40px 48px 40px 32px' },
  indexLabel: { fontSize: '9px', letterSpacing: '0.3em', fontWeight: '400', color: '#bbb', marginBottom: '24px' },
  row: { display: 'grid', gridTemplateColumns: '36px 1fr auto 1fr', alignItems: 'baseline', gap: '16px', padding: '14px 4px', borderBottom: '1px solid #ece8e2', textDecoration: 'none', color: '#111', transition: 'background 0.1s', cursor: 'pointer' },
  rowHover: { background: '#f0ede8' },
  rowNum: { fontSize: '9px', letterSpacing: '0.2em', color: '#ccc', fontWeight: '300' },
  rowTitle: { fontSize: '11px', fontWeight: '400', letterSpacing: '0.2em', color: '#111' },
  rowDots: { borderBottom: '1px dotted #ccc', height: '1px', alignSelf: 'center', minWidth: '40px' },
  rowDesc: { fontSize: '9px', fontWeight: '200', color: '#888', lineHeight: '1.6', letterSpacing: '0.05em', textAlign: 'right' },
  footer: { padding: '16px 48px 16px 32px', borderTop: '1px solid #e0dbd4', marginTop: 'auto' },
  footerText: { fontSize: '9px', letterSpacing: '0.2em', color: '#ccc', fontWeight: '200' },
}
