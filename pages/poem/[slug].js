import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

const meta = {
  'she-and-i': { number:'01', title:'SHE&I', description:'A dramatic monologue of a man discussing his ex. Toxicity calibrated daily to the FTSE 100.', dataNote:'Toxicity level sourced from FTSE 100 daily performance.' },
  'peace-by-piece': { number:'02', title:'PEACE BY PIECE', description:'An anti-war poem that grows one syllable for every real bomb detonated around the world.', dataNote:'Syllable count sourced from ACLED/GDELT global conflict data.' },
  'still-water': { number:'03', title:'STILL WATER', description:'A modernist epic composed from unfavourable reviews of supermarket own-brand bottled water.', dataNote:'Source material: real customer reviews, 3 stars and below.' },
  'trumpd': { number:'04', title:"TRUMP\'D", description:"The ballad of Donald J. Trump, told through the ever-evolving edits to his Wikipedia page.", dataNote:"Source material: today\'s edits to Donald Trump\'s Wikipedia page." },
  'headlines': { number:'05', title:'HEADLINES', description:"Today\'s news headlines paired with today\'s advertising headlines.", dataNote:'Source material: live RSS news feeds and real advertising headlines.' },
  'please-god': { number:'06', title:'PLEASE GOD', description:'A litany of real social media posts beginning with "please god".', dataNote:'Source material: real public posts from Bluesky and Reddit.' },
}

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
    setLoading(true); setError(null)
    try {
      const res = await fetch(`/api/poem/${slug}`)
      const data = await res.json()
      if (data.error) { setError(data.error) }
      else { setPoem(data.poem); setContext(data.context); setGeneratedAt(new Date().toUTCString()) }
    } catch(e) { setError('Failed to generate poem. Please try again.') }
    finally { setLoading(false) }
  }, [slug])

  useEffect(() => { if (slug) generate() }, [slug, generate])
  if (!poemMeta) return null

  return (
    <>
      <Head><title>{poemMeta.title} — POERMS</title></Head>
      <main style={{minHeight:'100vh',background:'#000',color:'#fff',display:'flex',flexDirection:'column'}}>
        <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',borderBottom:'1px solid #1a1a1a',position:'sticky',top:0,background:'#000',zIndex:100}}>
          <Link href="/" style={{fontSize:'11px',letterSpacing:'0.1em',color:'#fff',textDecoration:'none',fontFamily:'Helvetica Neue,sans-serif'}}>← POERMS</Link>
          <span style={{fontSize:'11px',letterSpacing:'0.1em',color:'#444',fontFamily:'Helvetica Neue,sans-serif'}}>{poemMeta.number} / 06</span>
          <button onClick={generate} disabled={loading} style={{fontSize:'11px',letterSpacing:'0.1em',color:'#888',background:'none',border:'1px solid #333',padding:'8px 16px',cursor:'pointer',fontFamily:'Helvetica Neue,sans-serif'}}>
            {loading ? 'GENERATING...' : 'REGENERATE'}
          </button>
        </header>
        <section style={{padding:'80px 40px 60px',maxWidth:'900px'}}>
          <p style={{fontSize:'11px',letterSpacing:'0.2em',color:'#444',marginBottom:'16px',fontFamily:'Helvetica Neue,sans-serif'}}>POERM #{poemMeta.number}</p>
          <h1 style={{fontFamily:'EB Garamond,Georgia,serif',fontSize:'clamp(48px,8vw,120px)',fontWeight:'400',letterSpacing:'-0.03em',lineHeight:'0.9',marginBottom:'32px',fontStyle:'italic'}}>{poemMeta.title}</h1>
          <p style={{fontSize:'12px',letterSpacing:'0.08em',color:'#555',textTransform:'uppercase',lineHeight:'1.8',maxWidth:'600px',fontFamily:'Helvetica Neue,sans-serif'}}>{poemMeta.description}</p>
        </section>
        <div style={{height:'1px',background:'#111',margin:'0 40px'}}/>
        {context && (
          <div style={{padding:'16px 40px',borderBottom:'1px solid #0a0a0a',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:'8px'}}>
            <span style={{fontSize:'10px',letterSpacing:'0.1em',color:'#444',textTransform:'uppercase',fontFamily:'Helvetica Neue,sans-serif'}}>{poemMeta.dataNote} — {context}</span>
            {generatedAt && <span style={{fontSize:'10px',letterSpacing:'0.1em',color:'#2a2a2a',fontFamily:'Helvetica Neue,sans-serif'}}>Generated {generatedAt}</span>}
          </div>
        )}
        <section style={{flex:1,padding:'80px 40px 120px',maxWidth:'900px'}}>
          {loading && (
            <div>
              <div style={{height:'1px',background:'#111',width:'400px',marginBottom:'40px',overflow:'hidden'}}>
                <div style={{height:'100%',background:'#fff',width:'60%',animation:'pulse 2s ease-in-out infinite'}}/>
              </div>
              <p style={{fontSize:'11px',letterSpacing:'0.15em',color:'#333',lineHeight:'2',fontFamily:'Helvetica Neue,sans-serif'}}>DRAWING FROM LIVE DATA —<br/>GENERATING POEM</p>
            </div>
          )}
          {error && !loading && (
            <div>
              <p style={{fontSize:'12px',letterSpacing:'0.1em',color:'#666',marginBottom:'24px',fontFamily:'Helvetica Neue,sans-serif'}}>{error}</p>
              <button onClick={generate} style={{fontSize:'11px',letterSpacing:'0.1em',color:'#888',background:'none',border:'1px solid #333',padding:'8px 16px',cursor:'pointer',fontFamily:'Helvetica Neue,sans-serif'}}>TRY AGAIN</button>
            </div>
          )}
          {poem && !loading && (
            <div style={{maxWidth:'720px'}}>
              {poem.split('\n').map((line, i) => (
                <div key={i} style={{fontFamily:'EB Garamond,Georgia,serif',fontSize:'clamp(18px,2.5vw,28px)',lineHeight:'1.7',color:'#e8e4dc',marginBottom:'2px'}}>
                  {line || '\u00A0'}
                </div>
              ))}
            </div>
          )}
        </section>
        <footer style={{padding:'24px 40px',borderTop:'1px solid #111'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:'10px',letterSpacing:'0.15em',color:'#333',fontFamily:'Helvetica Neue,sans-serif'}}>HENRY PLUMRIDGE — POERMS</span>
            <div style={{display:'flex',gap:'16px'}}>
              {Object.entries(meta).map(([s,p]) => (
                <Link key={s} href={`/poem/${s}`} style={{fontSize:'11px',letterSpacing:'0.1em',color:s===slug?'#fff':'#333',textDecoration:'none',fontFamily:'Helvetica Neue,sans-serif'}}>{p.number}</Link>
              ))}
            </div>
          </div>
        </footer>
      </main>
      <style jsx global>{`@keyframes pulse { 0%{width:0%} 50%{width:70%} 100%{width:100%} }`}</style>
    </>
  )
}
