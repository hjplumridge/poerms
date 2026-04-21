import { useEffect, useRef } from 'react'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>POERMS, VOL. 1</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap" rel="stylesheet" />
      </Head>
      <TerminalApp />
    </>
  )
}

const POEMS = [
  { slug:'she-and-i', number:'01', title:'SHE&I', description:'A dramatic monologue of a man discussing his ex.\nToxicity calibrated daily to the FTSE 100.', dataNote:'Toxicity level sourced from FTSE 100 daily performance.' },
  { slug:'peace-by-piece', number:'02', title:'PEACE BY PIECE', description:'An anti-war poem that grows one syllable\nfor every real bomb detonated around the world.', dataNote:'Syllable count sourced from global conflict data.' },
  { slug:'still-water', number:'03', title:'STILL WATER', description:'A modernist epic composed from unfavourable\nreviews of supermarket own-brand bottled water.', dataNote:'Source material: real customer reviews, 3 stars and below.' },
  { slug:'trumpd', number:'04', title:"TRUMP'D", description:"The ballad of Donald J. Trump, told through\nthe ever-evolving edits to his Wikipedia page.", dataNote:"Source material: today's edits to Donald Trump's Wikipedia page." },
  { slug:'headlines', number:'05', title:'HEADLINES', description:"Today's news headlines paired with\ntoday's advertising headlines. Forever.", dataNote:'Source material: live RSS news feeds and real advertising headlines.' },
  { slug:'please-god', number:'06', title:'PLEASE GOD', description:'A litany of real social media posts\nbeginning with "please god", from across the world.', dataNote:'Source material: real public posts from Bluesky and Reddit.' },
]

const T = {
  SPEED: 26,
  VAR: 10,
  PAUSE_TITLE: 700,
  PAUSE_LINE: 280,
  PAUSE_PROMPT: 900,
  TRANSITION: 450,
}

function TerminalApp() {
  const stateRef = useRef({
    screen: 'entry',
    currentPoem: null,
    generating: false,
    abort: false,
  })
  const containerRef = useRef(null)

  useEffect(() => {
    const s = stateRef.current

    function wait(ms) { return new Promise(r => setTimeout(r, ms)) }

    function makeCursor() {
      const c = document.createElement('span')
      c.style.cssText = `display:inline-block;width:0.55em;height:1.1em;background:#e8e8e8;vertical-align:text-bottom;margin-left:2px;animation:blink 1.1s step-end infinite;`
      return c
    }

    function typeInto(el, text, speed = T.SPEED, cursor = true) {
      return new Promise(resolve => {
        el.textContent = ''
        const cur = cursor ? makeCursor() : null
        if (cur) el.appendChild(cur)
        let i = 0
        function next() {
          if (s.abort) { resolve(); return }
          if (i < text.length) {
            const ch = document.createTextNode(text[i++])
            cur ? el.insertBefore(ch, cur) : el.appendChild(ch)
            setTimeout(next, Math.max(8, speed + (Math.random()*T.VAR*2-T.VAR)))
          } else {
            if (cur) cur.remove()
            resolve()
          }
        }
        next()
      })
    }

    async function transition(toId) {
      const ov = document.getElementById('t-overlay')
      ov.style.opacity = '1'
      await wait(T.TRANSITION)
      document.querySelectorAll('.t-screen').forEach(sc => sc.style.display = 'none')
      const target = document.getElementById(toId)
      target.style.display = 'flex'
      target.scrollTop = 0
      s.screen = toId
      setTimeout(() => { ov.style.opacity = '0' }, 50)
    }

    async function runEntry() {
      s.abort = false
      const titleEl = document.getElementById('t-title')
      const lines = ['t-l1','t-l2','t-l3'].map(id => document.getElementById(id))
      const prompt = document.getElementById('t-prompt')

      await typeInto(titleEl, 'POERMS, VOL. 1', T.SPEED - 4)
      await wait(T.PAUSE_TITLE)
      await typeInto(lines[0], 'This is a collection of never-ending, self-generating poems.')
      await wait(T.PAUSE_LINE)
      await typeInto(lines[1], 'Each generates itself using AI trained on source material and writing guidance.')
      await wait(T.PAUSE_LINE)
      await typeInto(lines[2], 'While the themes remain constant, each viewing will produce a different version of each poem.')
      await wait(T.PAUSE_PROMPT)
      prompt.style.visibility = 'visible'
    }

    function buildIndex() {
      const list = document.getElementById('t-list')
      list.innerHTML = ''
      POEMS.forEach((poem, i) => {
        const row = document.createElement('div')
        row.style.cssText = `margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid rgba(232,232,232,0.15);cursor:pointer;opacity:0;transition:opacity 0.4s ease;`
        row.innerHTML = `
          <div style="display:flex;align-items:baseline;gap:16px;margin-bottom:6px;">
            <span style="font-size:11px;letter-spacing:0.18em;color:rgba(232,232,232,0.25);width:24px;flex-shrink:0;">${poem.number}</span>
            <span class="t-poem-title" style="font-size:clamp(15px,2vw,19px);font-weight:400;letter-spacing:0.06em;transition:color 0.2s;">${poem.title}</span>
            <span style="margin-left:auto;color:rgba(232,232,232,0.35);opacity:0;transition:opacity 0.2s;" class="t-arrow">→</span>
          </div>
          <div style="font-size:clamp(11px,1.2vw,13px);font-weight:300;color:rgba(232,232,232,0.4);line-height:1.7;padding-left:40px;letter-spacing:0.03em;">${poem.description.replace(/\n/g,'<br>')}</div>
        `
        row.addEventListener('mouseenter', () => {
          row.querySelector('.t-poem-title').style.color = '#fff'
          row.querySelector('.t-arrow').style.opacity = '1'
        })
        row.addEventListener('mouseleave', () => {
          row.querySelector('.t-poem-title').style.color = '#e8e8e8'
          row.querySelector('.t-arrow').style.opacity = '0'
        })
        row.addEventListener('click', () => openPoem(poem))
        list.appendChild(row)
        setTimeout(() => { row.style.opacity = '1' }, i * 100)
      })
    }

    async function goIndex() {
      buildIndex()
      await transition('t-index')
    }

    async function openPoem(poem) {
      s.currentPoem = poem
      s.abort = false

      document.getElementById('t-pnum').textContent = `POERM ${poem.number} *`
      document.getElementById('t-ptitle').textContent = poem.title
      document.getElementById('t-pdesc').innerHTML = poem.description.replace(/\n/g,'<br>')
      document.getElementById('t-pdata').textContent = ''
      document.getElementById('t-pbody').innerHTML = ''
      document.getElementById('t-pcounter').textContent = `${poem.number} / 06`
      document.getElementById('t-pstatus').textContent = ''

      const idx = POEMS.findIndex(p => p.slug === poem.slug)
      const prevEl = document.getElementById('t-prev')
      const nextEl = document.getElementById('t-next')
      const prev = POEMS[idx-1], next = POEMS[idx+1]
      if (prev) { prevEl.textContent = `← ${prev.title}`; prevEl.style.visibility='visible'; prevEl.onclick = () => openPoem(prev) }
      else { prevEl.style.visibility='hidden' }
      if (next) { nextEl.textContent = `${next.title} →`; nextEl.style.visibility='visible'; nextEl.onclick = () => openPoem(next) }
      else { nextEl.style.visibility='hidden' }

      await transition('t-poem')
      await fetchAndType(poem)
    }

    async function fetchAndType(poem) {
      if (s.generating) return
      s.generating = true
      s.abort = false

      const statusEl = document.getElementById('t-pstatus')
      const bodyEl   = document.getElementById('t-pbody')
      const dataEl   = document.getElementById('t-pdata')
      const regen    = document.getElementById('t-regen')
      regen.disabled = true
      bodyEl.innerHTML = ''
      dataEl.textContent = ''

      await typeInto(statusEl, 'generating', T.SPEED - 6, true)
      const sc = makeCursor(); statusEl.appendChild(sc)

      try {
        const res = await fetch(`/api/poem/${poem.slug}`)
        const data = await res.json()
        if (data.error) throw new Error(data.error)

        statusEl.innerHTML = ''
        if (data.context) dataEl.textContent = data.context

        const lines = data.poem.split('\n')
        for (let i = 0; i < lines.length; i++) {
          if (s.abort) break
          const line = lines[i]
          const el = document.createElement('span')
          el.style.cssText = 'display:block;font-family:"IBM Plex Mono",monospace;font-size:clamp(14px,1.9vw,20px);line-height:1.95;font-weight:300;font-style:italic;color:#e8e8e8;letter-spacing:0.02em;'

          if (line === 'piece by piece') {
            el.style.cssText = 'display:block;font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:0.28em;color:rgba(232,232,232,0.28);font-weight:400;font-style:normal;margin:4px 0;'
          } else if (line === 'pieces, but no peace.') {
            el.style.cssText = 'display:block;font-family:"IBM Plex Mono",monospace;font-size:clamp(13px,1.5vw,16px);font-style:italic;color:rgba(232,232,232,0.45);margin-top:12px;margin-bottom:40px;'
          } else if (line === 'please god' && poem.slug === 'please-god') {
            el.style.cssText = 'display:block;font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:0.3em;color:rgba(232,232,232,0.28);font-weight:300;font-style:normal;margin-bottom:28px;'
          } else if (!line) {
            el.innerHTML = '&nbsp;'
            el.style.cssText = 'display:block;min-height:0.8em;'
            bodyEl.appendChild(el)
            continue
          }

          bodyEl.appendChild(el)
          if (line) await typeInto(el, line, T.SPEED, i < lines.length-1)
          await wait(35)
        }
      } catch(err) {
        statusEl.innerHTML = ''
        statusEl.textContent = `error: ${err.message || 'could not generate poem'}`
      } finally {
        s.generating = false
        regen.disabled = false
      }
    }

    // Events
    document.getElementById('t-prompt').addEventListener('click', goIndex)
    document.getElementById('t-back').addEventListener('click', () => { s.abort=true; goIndex() })
    document.getElementById('t-regen').addEventListener('click', () => {
      if (!s.generating && s.currentPoem) {
        document.getElementById('t-pbody').innerHTML=''
        document.getElementById('t-pdata').textContent=''
        fetchAndType(s.currentPoem)
      }
    })
    document.addEventListener('keydown', e => {
      if (e.key==='Enter' && (s.screen==='t-entry' || s.screen==='entry')) goIndex()
      if ((e.key==='Escape'||e.key==='Backspace') && s.screen==='t-poem') { s.abort=true; goIndex() }
    })

    runEntry()
  }, [])

  const base = {
    position:'fixed', inset:0,
    fontFamily:"'IBM Plex Mono','Courier New',monospace",
    background:'#0a0a0a', color:'#e8e8e8',
    padding:'clamp(28px,5vw,64px) clamp(20px,6vw,72px)',
    flexDirection:'column',
    overflowY:'auto', overflowX:'hidden',
    display:'none',
  }

  return (
    <div ref={containerRef} style={{position:'fixed',inset:0,background:'#0a0a0a'}}>
      {/* Overlay */}
      <div id="t-overlay" style={{position:'fixed',inset:0,background:'#0a0a0a',opacity:0,transition:'opacity 0.45s ease',zIndex:999,pointerEvents:'none'}} />

      {/* ENTRY */}
      <div id="t-entry" className="t-screen" style={{...base,display:'flex',justifyContent:'center',alignItems:'center'}}>
        <div style={{maxWidth:'680px',width:'100%'}}>
          <div id="t-title" style={{fontSize:'clamp(18px,3vw,28px)',fontWeight:500,letterSpacing:'0.12em',marginBottom:'clamp(24px,4vw,48px)',lineHeight:1.2}} />
          <div style={{color:'rgba(232,232,232,0.45)',fontWeight:300,marginBottom:'clamp(28px,5vw,52px)',lineHeight:2}}>
            <span id="t-l1" style={{display:'block',minHeight:'1.85em'}} />
            <span id="t-l2" style={{display:'block',minHeight:'1.85em'}} />
            <span id="t-l3" style={{display:'block',minHeight:'1.85em'}} />
          </div>
          <div id="t-prompt" style={{visibility:'hidden',fontSize:'clamp(12px,1.4vw,14px)',letterSpacing:'0.1em',cursor:'pointer',userSelect:'none',animation:'pulse 2.4s ease-in-out infinite'}}>
            [ PRESS ENTER TO BEGIN ]
          </div>
        </div>
      </div>

      {/* INDEX */}
      <div id="t-index" className="t-screen" style={{...base}}>
        <div style={{marginBottom:'clamp(28px,4vw,48px)',paddingBottom:'20px',borderBottom:'1px solid rgba(232,232,232,0.15)'}}>
          <div style={{fontSize:'clamp(14px,1.8vw,18px)',fontWeight:500,letterSpacing:'0.12em',marginBottom:'8px'}}>POERMS, VOL. 1</div>
          <div style={{color:'rgba(232,232,232,0.35)',fontWeight:300,fontSize:'clamp(11px,1.2vw,13px)',letterSpacing:'0.08em'}}>Henry Plumridge</div>
        </div>
        <div id="t-list" />
      </div>

      {/* POEM */}
      <div id="t-poem" className="t-screen" style={{...base}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'clamp(28px,4vw,48px)',paddingBottom:'16px',borderBottom:'1px solid rgba(232,232,232,0.12)',fontSize:'clamp(10px,1.1vw,12px)',letterSpacing:'0.14em',color:'rgba(232,232,232,0.38)'}}>
          <span id="t-back" style={{cursor:'pointer',fontWeight:300,transition:'color 0.2s'}} onMouseEnter={e=>e.target.style.color='#e8e8e8'} onMouseLeave={e=>e.target.style.color='rgba(232,232,232,0.38)'}>← BACK</span>
          <div style={{display:'flex',gap:'24px',alignItems:'center'}}>
            <button id="t-regen" style={{background:'none',border:'none',fontFamily:"'IBM Plex Mono',monospace",fontSize:'clamp(10px,1.1vw,12px)',letterSpacing:'0.14em',color:'rgba(232,232,232,0.38)',cursor:'pointer',padding:0,transition:'color 0.2s'}} onMouseEnter={e=>e.target.style.color='#e8e8e8'} onMouseLeave={e=>e.target.style.color='rgba(232,232,232,0.38)'}>REGENERATE</button>
            <span id="t-pcounter" style={{color:'rgba(232,232,232,0.2)'}} />
          </div>
        </div>
        <div style={{marginBottom:'clamp(24px,4vw,40px)'}}>
          <div id="t-pnum" style={{fontSize:'clamp(10px,1.1vw,12px)',letterSpacing:'0.22em',color:'rgba(232,232,232,0.25)',marginBottom:'12px',fontWeight:300}} />
          <div id="t-ptitle" style={{fontSize:'clamp(22px,4vw,44px)',fontWeight:500,letterSpacing:'0.1em',marginBottom:'16px',lineHeight:1.1}} />
          <div id="t-pdesc" style={{color:'rgba(232,232,232,0.4)',fontWeight:300,fontSize:'clamp(11px,1.2vw,13px)',letterSpacing:'0.04em',maxWidth:'480px',lineHeight:1.75}} />
        </div>
        <div id="t-pdata" style={{color:'rgba(232,232,232,0.22)',fontSize:'clamp(10px,1.1vw,11px)',letterSpacing:'0.08em',marginBottom:'clamp(28px,4vw,44px)',paddingTop:'14px',borderTop:'1px solid rgba(232,232,232,0.1)',fontWeight:300}} />
        <div id="t-pstatus" style={{fontSize:'clamp(11px,1.2vw,13px)',color:'rgba(232,232,232,0.25)',letterSpacing:'0.15em',fontWeight:300,marginBottom:'20px'}} />
        <div id="t-pbody" style={{maxWidth:'620px'}} />
        <div style={{display:'flex',justifyContent:'space-between',paddingTop:'40px',marginTop:'40px',borderTop:'1px solid rgba(232,232,232,0.1)',marginBottom:'60px',fontSize:'clamp(10px,1.1vw,12px)',letterSpacing:'0.13em',color:'rgba(232,232,232,0.35)'}}>
          <span id="t-prev" style={{cursor:'pointer',fontWeight:300,visibility:'hidden',transition:'color 0.2s'}} onMouseEnter={e=>e.target.style.color='#e8e8e8'} onMouseLeave={e=>e.target.style.color='rgba(232,232,232,0.35)'} />
          <span id="t-next" style={{cursor:'pointer',fontWeight:300,visibility:'hidden',transition:'color 0.2s'}} onMouseEnter={e=>e.target.style.color='#e8e8e8'} onMouseLeave={e=>e.target.style.color='rgba(232,232,232,0.35)'} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        .t-screen { box-sizing: border-box; }
        *::-webkit-scrollbar { width: 2px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: rgba(232,232,232,0.15); }
      `}</style>
    </div>
  )
}