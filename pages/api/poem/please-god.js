
async function getBluesky() {
  try {
    const r = await fetch('https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=%22please+god%22&limit=30&sort=latest', {signal:AbortSignal.timeout(8000)})
    const d = await r.json()
    return (d.posts||[]).map(p=>p.record?.text||'').filter(t=>{
      const l=t.toLowerCase()
      return l.startsWith('please god') && !t.includes('!') && !t.includes('@') && !t.includes('#') && t.length<120 && t.length>15
    }).map(t=>t.replace(/^[Pp]lease [Gg]od\s*/i,'').trim()).filter(t=>t.length>5).slice(0,12)
  } catch(e) { return [] }
}

const FALLBACK = ["let me have an invite to taylor and travis' wedding","make the new GTA fire","give me the strength to speak up","show me i am loved","don't say i'm allergic to sugar","bring me a pony","make me filthy rich soon","help me get jacob elordi out of my head","may this war end","may everybody in the middle east find peace one day","let me find a parking spot in london today","protect gaza","make curly-wurly's bigger again (why so small?!)","i sacrifice myself for you","protect my little sister","may harry kane perform at the world cup this summer","don't let it be what i think it is","let the scan come back clear","let her be okay","not today"]

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({error:'API key not configured'})

  const live = await getBluesky()
  const pool = live.length >= 12 ? live : [...live, ...FALLBACK.slice(0, 16-live.length)]

  const prompt = `You are generating PLEASE GOD — a litany poem of social media posts beginning with "please god".

SOURCE MATERIAL (content after "please god"):
${pool.slice(0,16).map(p=>`- ${p}`).join('\n')}

FORM: Pure unbroken litany. Opens with a single line: "please god" — alone. Then the litany runs. Every line begins "please god" (always lowercase — no exceptions). Never ends — simply stops when material runs out.

EXAMPLE (match this exactly):
please god

please god get me an invite to taylor and travis' wedding
please god make the new GTA fire
please god give me the strength to speak up
please god show me i am loved
please god don't say i'm allergic to sugar
please god bring me a pony
please god make me filthy rich soon
please god help me get jacob elordi out of my head
please god may this war end
please god may everybody in the middle east find peace one day
please god let me find a parking spot in london today
please god protect gaza
please god make curly-wurly's bigger again (why so small?!)
please god i sacrifice myself for you
please god protect my little sister
please god may harry kane perform at the world cup this summer

RULES: Do not cluster by register. Do not sequence for comedy. The most devastating entries must arrive suddenly in the middle of the mundane. That suddenness is the poem's most important effect. Always lowercase. Human want must be preserved — never sanitised.

PROHIBITIONS: No irony signals. No exclamation marks. No usernames or platform references. The poem never acknowledges it is made of social media posts.

Output the poem now. "please god" alone on first line, then the litany. 16-20 entries. Nothing else.`

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
      body: JSON.stringify({model:'claude-sonnet-4-5',max_tokens:800,messages:[{role:'user',content:'Generate the poem.'}],system:prompt})
    })
    const d = await r.json()
    return res.status(200).json({poem: d.content[0].text, context: `${live.length} live posts sourced from Bluesky — ${new Date().toDateString()}`})
  } catch(e) {
    return res.status(500).json({error:'Failed to generate poem'})
  }
}
