
async function getWikiEdits() {
  try {
    const r = await fetch('https://en.wikipedia.org/w/api.php?action=query&titles=Donald_Trump&prop=revisions&rvprop=ids|timestamp|comment&rvlimit=10&format=json&origin=*', {signal:AbortSignal.timeout(8000)})
    const d = await r.json()
    const pages = d.query.pages
    const revs = pages[Object.keys(pages)[0]].revisions || []
    if (revs.length < 2) return {additions:[], removals:[], fallback:true}

    const diffR = await fetch(`https://en.wikipedia.org/w/api.php?action=compare&fromrev=${revs[1].revid}&torev=${revs[0].revid}&prop=diff&format=json&origin=*`, {signal:AbortSignal.timeout(8000)})
    const diffD = await diffR.json()
    const html = diffD.compare?.['*'] || ''

    const additions = [], removals = []
    for (const m of html.matchAll(/<ins[^>]*>(.*?)<\/ins>/gs)) {
      const t = m[1].replace(/<[^>]+>/g,'').trim()
      if (t.length > 10 && t.length < 200 && !t.includes('{{')) additions.push(t)
    }
    for (const m of html.matchAll(/<del[^>]*>(.*?)<\/del>/gs)) {
      const t = m[1].replace(/<[^>]+>/g,'').trim()
      if (t.length > 10 && t.length < 200 && !t.includes('{{')) removals.push(t)
    }
    return {additions:additions.slice(0,6), removals:removals.slice(0,6), timestamp:revs[0].timestamp, fallback:false}
  } catch(e) { return {additions:[], removals:[], fallback:true} }
}

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({error:'API key not configured'})

  const wiki = await getWikiEdits()
  const adds = wiki.additions.length > 0 ? wiki.additions.map(a=>`[ADD]: ${a}`).join('\n') : '[ADD]: Donald Trump signed executive orders on his first day back in office\n[ADD]: Trump was inaugurated as the 47th President on January 20, 2025'
  const removes = wiki.removals.length > 0 ? wiki.removals.map(r=>`[REMOVE]: ${r}`).join('\n') : '[REMOVE]: convicted\n[REMOVE]: The word convicted was replaced with found guilty on disputed charges'

  const prompt = `You are generating TRUMP'D — a ballad of Donald J. Trump built from today's Wikipedia edits.

WIKIPEDIA EDITS TODAY:
ADDITIONS: ${adds}
REMOVALS: ${removes}

FORM: Strict ballad meter. 4-beat lines alternating with 3-beat lines. ABCB rhyme scheme (lines 2 and 4 rhyme). Pure rhyme preferred, clean half-rhymes permitted. Count stresses not syllables. Read aloud and tap the beat.

PERSONA: An impersonal ballad-singer. Ancient. Not satirical — earnest. The form carries the irony; the voice does not.

TRANSFORMATION: [ADD] edits = things affirmed, deeds, facts. [REMOVE] edits = things disputed, denied, erased — treat as elegy. Each stanza must include at least one ADD and one REMOVE. When Don won't scan use: Don the Con, Mango Mussolini, Agent Orange, Tangerine Toddler, Diaper Don, Cheeto-Benito, Trumplestiltskin, Orange Julius Caesar, Dictator-tot. Choose for meter first. Never wink at these names.

FIXED OPENING QUATRAIN (use exactly):
Donald was born a wealthy boy,
His family were blessed.
A business — hundreds it employed,
Young Donald did invest.

FIXED CLOSING QUATRAIN (use exactly):
And that's how Don made it to now,
the story that we know —
see, some say this and some say that,
and talk's what Don loves most.

Write 4-6 stanzas between these using today's edits. PROHIBITIONS: No satire language. No editorial cartoons register. No internet language. No winking. Source material must never be made vague to fit the form.

Write now. Opening quatrain, middle stanzas from edits, closing quatrain. No title, no attribution.`

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
      body: JSON.stringify({model:'claude-sonnet-4-5',max_tokens:1000,messages:[{role:'user',content:'Generate the ballad.'}],system:prompt})
    })
    const d = await r.json()
    const ctx = wiki.fallback ? 'Wikipedia API unavailable — using recent known edits' : `${wiki.additions.length} additions, ${wiki.removals.length} removals — ${new Date(wiki.timestamp).toDateString()}`
    return res.status(200).json({poem: d.content[0].text, context: ctx})
  } catch(e) {
    return res.status(500).json({error:'Failed to generate poem'})
  }
}
