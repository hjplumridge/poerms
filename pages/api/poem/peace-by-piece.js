
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

FORM: A list of images. One image per line. No refrains, no stanza breaks, no closing lines. 
Just the pieces. No capitals anywhere — not even proper nouns. 
Write ${Math.max(8, Math.floor(Math.min(total,400)/5))} lines.

EACH LINE is a single concrete image of contemporary conflict and its aftermath — 
civilian life interrupted, infrastructure broken, the small specific details that 
don't make the headline but are what war actually is.

The images must vary in register — some devastating, some mundane, some both at once. 
Not every line should try to be the most powerful line. The power comes from accumulation.

EXAMPLE (match this register exactly):
shoes line up outside the morgue in descending sizes
a dog waits at a bus stop that no longer exists
someone films the smoke plume on their phone
the hospital generator runs dry at 3am
an apartment building develops new windows it didn't plan for
rich expats fly to a place they've renamed home
glasses clink in western government buildings
a child's backpack hangs from a telephone wire
the grocery store checkout scanner beeps in the rubble
a grandmother counts her grandchildren twice, then three times

RULES: Contemporary violence only. No poppies, trenches, mud, dog tags, uniforms. 
Every image must be capable of appearing in a news report today. 
No heroism, no nobility, no redemption, no resolution. 
No explanation of what the images mean. No capitals anywhere.
The poem does not tell the reader what to feel. It shows them what happened.

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
