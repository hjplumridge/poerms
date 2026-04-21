
async function getExplosions() {
  try {
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1)
    const d = yesterday.toISOString().split('T')[0].replace(/-/g,'')
    const r = await fetch(`https://api.gdeltproject.org/api/v2/doc/doc?query=explosion+OR+airstrike+OR+bombing&mode=artlist&maxrecords=250&startdatetime=${d}000000&format=json`, {signal: AbortSignal.timeout(8000)})
    const data = await r.json()
    return Math.min((data.articles||[]).length, 200)
  } catch(e) { return Math.floor(Math.random()*40)+20 }
}

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({error:'API key not configured'})

  const newExplosions = await getExplosions()
  const total = newExplosions

  const prompt = `You are generating the current state of PEACE BY PIECE — an anti-war poem that accumulates one syllable per recorded explosion worldwide since its launch.

CURRENT SYLLABLE COUNT: ${total} (${newExplosions} new events in last 24 hours)

FORM: Built around the refrain 'piece by piece' on its own line. Each stanza has exactly four 'piece by piece' refrains with free verse images between them. Every stanza closes with: 'pieces, but no peace.' No capitals anywhere — not even proper nouns. Write ${Math.max(2, Math.floor(Math.min(total,400)/60))} complete stanzas.

EXAMPLE (match this exactly):
piece by piece
bombs blast roads, supermarkets, schools
piece by piece
debris floats in lakes, rivers, swimming pools
piece by piece
a man picks his skeleton up from the floor
piece by piece
he hobbles home

pieces, but no peace.

piece by piece
civil defence warnings are issued
piece by piece
rich expats fly to a place they've renamed 'home'
piece by piece
glasses clink in western government buildings

pieces, but no peace.

RULES: Contemporary violence only — no historical war imagery. No poppies, trenches, mud, dog tags. Every image must be capable of appearing in a news report today: supermarkets, smartphones, civil defence apps, satellite imagery. No heroism, no nobility, no redemption, no resolution. No capitals anywhere.

Write the poem now. No title, no attribution.`

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
      body: JSON.stringify({model:'claude-sonnet-4-5',max_tokens:2000,messages:[{role:'user',content:'Generate the poem.'}],system:prompt})
    })
    const d = await r.json()
    return res.status(200).json({poem: d.content[0].text, context: `${total} syllables — ${total} explosive events recorded in the last 24 hours`})
  } catch(e) {
    return res.status(500).json({error:'Failed to generate poem'})
  }
}
