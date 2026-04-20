import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

const meta = {
  'she-and-i': { number:'01', title:'SHE&I', description:'A dramatic monologue of a man discussing his ex. Toxicity calibrated daily to the FTSE 100.', dataNote:'Toxicity level sourced from FTSE 100 daily performance.' },
  'peace-by-piece': { number:'02', title:'PEACE BY PIECE', description:'An anti-war poem that grows one syllable for every real bomb detonated around the world.', dataNote:'Syllable count sourced from global conflict data.' },
  'still-water': { number:'03', title:'STILL WATER', description:'A modernist epic composed from unfavourable reviews of supermarket own-brand bottled water.', dataNote:'Source material: real customer reviews, 3 stars and below.' },
  'trumpd': { number:'04', title:"TRUMP'D", description:"The ballad of Donald J. Trump, told through the ever-evolving edits to his Wikipedia page.", dataNote:"Source material: today's edits to Donald Trump's Wikipedia page." },
  'headlines': { number:'05', title:'HEADLINES', description:"Today's news headlines paired with today's advertising headlines.", dataNote:'Source material: live RSS news feeds and real advertising headlines.' },
  'please-god': { number:'06', title:'PLEASE GOD', description:'A litany of real social media posts beginning with "please god".', dataNote:'Source material: real public posts from Bluesky and Reddit.' },
}

const allSlugs = ['she-and-i','peace-by-piece','still-water','trumpd','headlines','please-god']

export default function PoemPage() {
  const router = useRouter()
  const { slug } = router.query
  const [poem, setPoem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [context, setContext] = useState(null)
  const [generatedAt, setGeneratedAt] = useState(null)
  const poemMeta = meta[slug]

  const generate = useCallback(async () => {
    if (!slug) return
    setLoading(true); setError(null); setPoem(null)
    try {
      const res = await fetch(`/api/poem/${slug}`)
      const data = await res.json()
      if (data.error) setError(data.error)
      else {
        setPoem(data.poem)
        setContext(data.context)
        setGeneratedAt(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))
      }
    } catch(e) { setError('Failed to generate. Please try again.') }
    finally { setLoading(false) }
  }, [slug])

  useEffect(() => { if (slug) generate() }, [slug, generate])
  if (!poemMeta) return null

  const currentIndex = allSlugs.indexOf(slug)
  const prevSlug = currentIndex > 0 ? allSlugs[currentIndex - 1] : null
  const nextSlug = currentIndex < allSlugs.length - 1 ? allSlugs[currentIndex + 1] : null

  return (
    <>
      <Head>
        <title>{poemMeta.title} * POERMS</title>
        <meta name="description" content={poemMeta.description} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;1,200;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet" />
      </Head>
      <main style={s.main}>
        <div style={s.spine}>
          <span style={s.spineText}>{poemMeta.title} * POERMS VOL. 1</span>
        </div>
        <div style={s.content}>
          <div style={s.topBar}>
            <Link href="/" style={s.back}>← POERMS *</Link>
            <span style={s.stripNum}>{poemMeta.number} / 06</span>
            <button onClick={generate} disabled={loading} style={s.regenBtn}>{loading ? '—' : 'REGENERATE *'}</button>
          </div>
          <section style={s.header}>
            <p style={s.headerNum}>POERM {poemMeta.number} *</p>
            <h1 style={s.title}>{poemMeta.title}</h1>
            <p style={s.desc}>{poemMeta.description}</p>
          </section>
          <div style={s.rule} />
          <div style={s.dataBar}>
            <span style={s.dataText}>
              {loading ? 'Drawing from live data —' : `${poemMeta.dataNote}${context ? ` — ${context}` : ''}${generatedAt ? ` — ${generatedAt}` : ''}`}
            </span>
          </div>
          <section style={s.body}>
            {loading && <div style={s.loadingWrap}><span style={s.loadingText}>generating</span></div>}
            {error && !loading && (
              <div>
                <p style={s.errorText}>{error}</p>
                <button onClick={generate} style={s.retryBtn}>retry *</button>
              </div>
            )}
            {poem && !loading && (
              <div style={s.poemWrap}>
                {poem.split('\n').map((line, i) => (
                  <div key={i} style={getLineStyle(slug, line)}>{line || '\u00A0'}</div>
                ))}
              </div>
            )}
          </section>
          <div style={s.bottomNav}>
            {prevSlug ? <Link href={`/poem/${prevSlug}`} style={s.navLink}>← {meta[prevSlug].title}</Link> : <span/>}
            {nextSlug ? <Link href={`/poem/${nextSlug}`} style={s.navLink}>{meta[nextSlug].title} →</Link> : <span/>}
          </div>
        </div>
      </main>
      <style jsx global>{`
        @keyframes blink { 0%,100%{opacity:0.2} 50%{opacity:1} }
      `}</style>
    </>
  )
}

function getLineStyle(slug, line) {
  const base = { fontFamily: "'EB Garamond', Georgia, serif", fontSize: 'clamp(18px, 2.4vw, 26px)', lineHeight: '1.8', color: '#1a1a1a', marginBottom: '2px', letterSpacing: '0.01em' }
  if (slug === 'peace-by-piece') {
    if (line === 'piece by piece') return { fontFamily: "'Jost', Helvetica, sans-serif", fontSize: '15px', letterSpacing: '0.3em', color: '#555', fontWeight: '300', marginBottom: '8px', marginTop: '8px' }
    if (line === 'pieces, but no peace.') return { ...base, fontSize: 'clamp(14px,1.8vw,18px)', color: '#666', fontStyle: 'italic', marginTop: '20px', marginBottom: '48px' }
  }
  if (slug === 'please-god') {
    if (line === 'please god') return { fontFamily: "'Jost', Helvetica, sans-serif", fontSize: '15px', letterSpacing: '0.35em', color: '#555', fontWeight: '200', marginBottom: '36px' }
    return { ...base, fontStyle: 'italic', fontSize: 'clamp(17px,2.2vw,24px)' }
  }
  if (slug === 'headlines') return { ...base, fontSize: 'clamp(16px,2vw,22px)', marginBottom: '20px' }
  if (slug === 'trumpd') return { ...base, lineHeight: '2.1' }
  return base
}

const s = {
  main: { minHeight: '100vh', background: '#f7f4f0', color: '#111', display: 'flex', fontFamily: "'Jost', 'Futura', 'Century Gothic', Helvetica, Arial, sans-serif" },
  spine: { width: '24px', minHeight: '100vh', borderRight: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' },
  spineText: { writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', fontSize: '14px', letterSpacing: '0.25em', fontWeight: '300', color: '#555', whiteSpace: 'nowrap' },
  content: { flex: 1, display: 'flex', flexDirection: 'column' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 48px 14px 32px', borderBottom: '1px solid #e0dbd4', fontSize: '15px', letterSpacing: '0.25em', fontWeight: '300', position: 'sticky', top: 0, background: '#f7f4f0', zIndex: 100 },
  back: { textDecoration: 'none', color: '#111', fontSize: '15px', letterSpacing: '0.25em', fontWeight: '400', fontFamily: "'Jost', Helvetica, sans-serif" },
  stripNum: { color: '#555', fontSize: '15px', letterSpacing: '0.2em' },
  regenBtn: { background: 'none', border: 'none', fontSize: '15px', letterSpacing: '0.25em', color: '#555', cursor: 'pointer', padding: 0, fontFamily: "'Jost', Helvetica, sans-serif", fontWeight: '300' },
  header: { padding: '64px 48px 48px 32px', maxWidth: '680px' },
  headerNum: { fontSize: '15px', letterSpacing: '0.3em', color: '#555', marginBottom: '16px', fontWeight: '300' },
  title: { fontFamily: "'Jost', 'Futura', Helvetica, sans-serif", fontSize: 'clamp(24px,4vw,48px)', fontWeight: '200', letterSpacing: '0.15em', lineHeight: '1.1', marginBottom: '24px', color: '#111', textTransform: 'uppercase' },
  desc: { fontSize: '14px', fontWeight: '200', color: '#555', lineHeight: '1.8', letterSpacing: '0.05em', maxWidth: '360px' },
  rule: { height: '1px', background: '#e0dbd4', margin: '0 32px' },
  dataBar: { padding: '10px 48px 10px 32px', borderBottom: '1px solid #ece8e2' },
  dataText: { fontSize: '15px', letterSpacing: '0.1em', color: '#555', fontWeight: '200' },
  body: { flex: 1, padding: '56px 48px 80px 32px', maxWidth: '720px' },
  loadingWrap: { paddingTop: '8px' },
  loadingText: { fontSize: '15px', letterSpacing: '0.3em', color: '#666', fontWeight: '200', animation: 'blink 2s infinite' },
  errorText: { fontSize: '14px', color: '#666', marginBottom: '16px', letterSpacing: '0.08em', fontWeight: '200' },
  retryBtn: { background: 'none', border: '1px solid #ddd', fontSize: '15px', letterSpacing: '0.2em', color: '#555', padding: '8px 20px', cursor: 'pointer', fontFamily: "'Jost', Helvetica, sans-serif", fontWeight: '300' },
  poemWrap: { maxWidth: '600px' },
  bottomNav: { padding: '20px 48px 20px 32px', borderTop: '1px solid #e0dbd4', marginTop: 'auto', display: 'flex', justifyContent: 'space-between' },
  navLink: { fontSize: '15px', letterSpacing: '0.2em', color: '#555', textDecoration: 'none', fontWeight: '300' },
}
