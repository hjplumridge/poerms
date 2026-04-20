import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'

const poems = [
  { number: '01', slug: 'she-and-i', title: 'SHE&I', description: 'A dramatic monologue of a man discussing his ex. Toxicity calibrated daily to the FTSE 100.' },
  { number: '02', slug: 'peace-by-piece', title: 'PEACE BY PIECE', description: 'An anti-war poem that grows one syllable for every real bomb detonated around the world.' },
  { number: '03', slug: 'still-water', title: 'STILL WATER', description: 'A modernist epic composed from unfavourable reviews of supermarket own-brand bottled water.' },
  { number: '04', slug: 'trumpd', title: "TRUMP\'D", description: "The ballad of Donald J. Trump, told through the ever-evolving edits to his Wikipedia page." },
  { number: '05', slug: 'headlines', title: 'HEADLINES', description: "Today\'s news headlines paired with today\'s advertising headlines. Forever." },
  { number: '06', slug: 'please-god', title: 'PLEASE GOD', description: 'A litany of real social media posts beginning with "please god", from across the world.' },
]

export default function Home() {
  const [hovered, setHovered] = useState(null)
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => setTime(new Date().toUTCString().slice(0, 25))
    update()
    const i = setInterval(update, 1000)
    return () => clearInterval(i)
  }, [])
  return (
    <>
      <Head><title>POERMS — Henry Plumridge</title></Head>
      <main style={{minHeight:'100vh',background:'#000',color:'#fff',display:'flex',flexDirection:'column'}}>
        <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',borderBottom:'1px solid #1a1a1a',fontSize:'11px',letterSpacing:'0.1em',color:'#888',position:'sticky',top:0,background:'#000',zIndex:100}}>
          <span style={{color:'#fff',fontFamily:'Helvetica Neue,sans-serif'}}>+ POERMS</span>
          <span style={{fontFamily:'Helvetica Neue,sans-serif'}}>HENRY PLUMRIDGE</span>
          <span style={{color:'#555',fontFamily:'Helvetica Neue,sans-serif'}}>{time}</span>
        </header>
        <section style={{padding:'120px 40px 80px',maxWidth:'1200px'}}>
          <p style={{fontSize:'11px',letterSpacing:'0.2em',color:'#555',marginBottom:'24px',fontFamily:'Helvetica Neue,sans-serif'}}>THE WORLD\'S FIRST</p>
          <h1 style={{fontFamily:'EB Garamond,Georgia,serif',fontSize:'clamp(48px,7vw,96px)',fontWeight:'400',lineHeight:'1.05',letterSpacing:'-0.02em',color:'#fff',marginBottom:'40px',fontStyle:'italic'}}>
            Never-ending &<br/>self-generating<br/>poetry collection.
          </h1>
          <p style={{fontSize:'13px',letterSpacing:'0.05em',color:'#666',lineHeight:'2',textTransform:'uppercase',fontFamily:'Helvetica Neue,sans-serif'}}>
            Six poems. Each draws from live data.<br/>Each regenerates itself. None will ever stop.
          </p>
        </section>
        <div style={{height:'1px',background:'#1a1a1a',margin:'0 40px'}}/>
        <section style={{flex:1}}>
          {poems.map((poem, i) => (
            <Link key={poem.slug} href={`/poem/${poem.slug}`}
              style={{display:'grid',gridTemplateColumns:'60px 1fr 2fr 40px',alignItems:'center',gap:'40px',padding:'32px 40px',borderBottom:'1px solid #111',textDecoration:'none',color:'#fff',background:hovered===i?'#0a0a0a':'transparent',transition:'background 0.2s'}}
              onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}>
              <span style={{fontSize:'11px',letterSpacing:'0.1em',color:'#444',fontFamily:'Helvetica Neue,sans-serif'}}>{poem.number}</span>
              <span style={{fontFamily:'EB Garamond,Georgia,serif',fontSize:'32px',fontWeight:'400',fontStyle:'italic'}}>{poem.title}</span>
              <span style={{fontSize:'12px',letterSpacing:'0.05em',color:'#555',lineHeight:'1.8',textTransform:'uppercase',fontFamily:'Helvetica Neue,sans-serif'}}>{poem.description}</span>
              <span style={{fontSize:'18px',color:'#333',textAlign:'right'}}>→</span>
            </Link>
          ))}
        </section>
        <footer style={{padding:'24px 40px',borderTop:'1px solid #111'}}>
          <span style={{fontSize:'10px',letterSpacing:'0.15em',color:'#333',fontFamily:'Helvetica Neue,sans-serif'}}>© HENRY PLUMRIDGE — POERMS — ALL POEMS SELF-GENERATING — ALL POEMS NEVER-ENDING</span>
        </footer>
      </main>
    </>
  )
}
