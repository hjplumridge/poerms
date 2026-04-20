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
  'please-god': { number:'06', title:'PLEASE GOD', description:'A litany of real social media posts beginning with \"please god\".', dataNote:'Source material: real public posts from Bluesky and Reddit.' },
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
      else { setPoem(data.poem); setContext(data.context); setGeneratedAt(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })) }
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
        <title>{poemMeta.title} — POERMS, VOL. 1</title>
        <meta name="description" content={poemMeta.description} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet" />
      </Head>
      <main style={s.main}>
        <div style={s.topStrip}>
          <Link href="/" style={s.back}>← POERMS, VOL. 1</Link>
          <span style={s.stripNum}>{poemMeta.number} / 06</span>
          <button onClick={generate} disabled={loading} style={s.regenBtn}>{loading ? '—' : 'REGENERATE'}</button>
        </div>
        <section style={s.header}>
          <p style={s.headerNum}>POERM {poemMeta.number}</p>
          <h1 style={s.title}>{poemMeta.title}</h1>
          <p style={s.desc}>{poemMeta.description}</p>
        </section>
        <div style={s.rule} />
        {(context || loading) && (
          <div style={s.contextBar}>
            <span style={s.contextText}>
              {loading ? 'Drawing from live data —' : `${poemMeta.dataNote}${context ? ` — ${context}` : ''}${generatedAt ? ` — generated ${generatedAt}` : ''}`}
            </span>
          </div>
        )}
        <section style={s.body}>
          {loading && (
            <div style={s.loading}>
              <span style={{...s.dot, animationDelay:'0s'}}>·</span>
              <span style={{...s.dot, animationDelay:'0.3s'}}>·</span>
              <span style={{...s.dot, animationDelay:'0.6s'}}>·</span>
            </div>
          )}
          {error && !loading && (
            <div>
              <p style={s.errorText}>{error}</p>
              <button onClick={generate} style={s.retryBtn}>Try again</button>
            </div>
          )}
          {poem && !loading && (
            <div style={s.poemText}>
              {poem.split('\n').map((line, i) => (
                <div key={i} style={getLineStyle(slug, line)}>{line || '\u00A0'}</div>
              ))}
            </div>
          )}
        </section>
        <div style={s.bottomNav}>
          <div style={s.bottomNavInner}>
            {prevSlug ? <Link href={`/poem/${prevSlug}`} style={s.navLink}>← {meta[prevSlug].title}</Link> : <span/>}
            {nextSlug ? <Link href={`/poem/${nextSlug}`} style={s.navLink}>{meta[nextSlug].title} →</Link> : <span/>}
          </div>
        </div>
      </main>
      <style jsx global>{`@keyframes fadeDot { 0%,80%,100%{opacity:0} 40%{opacity:1} }`}</style>
    </>
  )
}

function getLineStyle(slug, line) {
  const base = { fontFamily: "'EB Garamond', Georgia, serif", fontSize: 'clamp(17px, 2.2vw, 24px)', lineHeight: '1.75', color: '#1a1a1a', marginBottom: '1px' }
  if (slug === 'peace-by-piece') {
    if (line === 'piece by piece') return { ...base, fontFamily: 'Archivo, Helvetica Neue, sans-serif', fontSize: '11px', letterSpacing: '0.2em', color: '#aaa', fontWeight: '400', marginBottom: '6px', marginTop: '6px' }
    if (line === 'pieces, but no peace.') return { ...base, fontSize: 'clamp(15px, 1.8vw, 20px)', color: '#888', fontStyle: 'italic', marginTop: '16px', marginBottom: '40px' }
  }
  if (slug === 'please-god') {
    if (line === 'please god') return { ...base, fontSize: 'clamp(13px,1.6vw,18px)', fontFamily: 'Archivo, Helvetica Neue, sans-serif', letterSpacing: '0.15em', color: '#bbb', fontWeight: '300', marginBottom: '28px' }
    return { ...base, fontSize: 'clamp(16px, 2vw, 22px)', fontStyle: 'italic' }
  }
  if (slug === 'headlines') {
    return { ...base, fontSize: 'clamp(15px, 1.9vw, 22px)' }
  }
  return base
}

const s = {
  main: { minHeight: '100vh', background: '#f5f2ee', color: '#111', display: 'flex', flexDirection: 'column', fontFamily: 'Archivo, Helvetica Neue, Helvetica, Arial, sans-serif' },
  topStrip: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 32px', borderBottom: '1px solid #d8d4ce', fontSize: '10px', letterSpacing: '0.15em', position: 'sticky', top: 0, background: '#f5f2ee', zIndex: 100 },
  back: { textDecoration: 'none', color: '#111', fontSize: '10px', letterSpacing: '0.15em', fontWeight: '400', fontFamily: 'Archivo, Helvetica Neue, sans-serif' },
  stripNum: { color: '#bbb', fontSize: '10px', letterSpacing: '0.15em' },
  regenBtn: { background: 'none', border: 'none', fontSize: '10px', letterSpacing: '0.15em', color: '#888', cursor: 'pointer', padding: 0, fontFamily: 'Archivo, Helvetica Neue, sans-serif' },
  header: { padding: '64px 32px 48px', maxWidth: '640px' },
  headerNum: { fontSize: '10px', letterSpacing: '0.2em', color: '#bbb', marginBottom: '20px', fontWeight: '400' },
  title: { fontFamily: 'Archivo, Helvetica Neue, sans-serif', fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: '700', letterSpacing: '-0.01em', lineHeight: '1', marginBottom: '24px', color: '#111' },
  desc: { fontSize: '12px', fontWeight: '300', color: '#888', lineHeight: '1.7', letterSpacing: '0.01em', maxWidth: '400px' },
  rule: { height: '1px', background: '#d8d4ce' },
  contextBar: { padding: '10px 32px', borderBottom: '1px solid #e8e4df' },
  contextText: { fontSize: '10px', letterSpacing: '0.08em', color: '#aaa', fontWeight: '300' },
  body: { flex: 1, padding: '56px 32px 80px', maxWidth: '680px' },
  loading: { fontSize: '28px', color: '#ccc', letterSpacing: '8px', paddingTop: '8px' },
  dot: { display: 'inline-block', animation: 'fadeDot 1.2s infinite' },
  errorText: { fontSize: '12px', color: '#999', marginBottom: '16px', letterSpacing: '0.05em' },
  retryBtn: { background: 'none', border: '1px solid #d8d4ce', fontSize: '10px', letterSpacing: '0.15em', color: '#888', padding: '8px 16px', cursor: 'pointer', fontFamily: 'Archivo, Helvetica Neue, sans-serif' },
  poemText: { maxWidth: '560px' },
  bottomNav: { padding: '20px 32px', borderTop: '1px solid #d8d4ce', marginTop: 'auto' },
  bottomNavInner: { display: 'flex', justifyContent: 'space-between' },
  navLink: { fontSize: '10px', letterSpacing: '0.15em', color: '#888', textDecoration: 'none', fontWeight: '400' },
}
