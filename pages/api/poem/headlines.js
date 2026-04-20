
async function getNews() {
  try {
    const r = await fetch('https://feeds.bbci.co.uk/news/world/rss.xml', {signal:AbortSignal.timeout(6000)})
    const text = await r.text()
    const headlines = []
    for (const m of text.matchAll(/<title><![CDATA[(.*?)]]><\/title>|<title>(.*?)<\/title>/gs)) {
      const t = (m[1]||m[2]||'').trim()
      if (t && !t.includes('BBC') && t.length > 15 && t.length < 120) headlines.push(t)
      if (headlines.length >= 10) break
    }
    return headlines
  } catch(e) { return [] }
}

const ADS = ["Escape into Summer with Jet2","When I run in my HOKAs, I change my world","Bring on the boom","Let's Go Places — Toyota","Bank on Lloyds — trusted enabler of ambition","Save Money. Live Better.","Just Do It","Think Different","Because You're Worth It","Open Happiness","Finger Lickin' Good","Every Little Helps","Good Food, Good Life","Expect More. Pay Less.","America Runs on Dunkin","Taste the Rainbow","I'm Lovin' It","A Diamond is Forever","Got Milk?","Think Small"]

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({error:'API key not configured'})

  const news = await getNews()
  const finalNews = news.length > 0 ? news : ["Iran closes Strait of Hormuz as peace talks stall","Global temperatures reach record highs for third consecutive month","Tech layoffs continue as AI adoption accelerates","Ceasefire negotiations collapse in third day of talks","Floods displace thousands across southern Europe","World leaders gather for emergency climate summit","Healthcare system under pressure as winter approaches","Scientists warn of accelerating biodiversity loss"]
  const ads = [...ADS].sort(()=>Math.random()-0.5).slice(0,10)

  const prompt = `You are generating HEADLINES — a poem of news headlines paired with advertising headlines.

FORM: Couplets. News headline on line 1, advertising headline on line 2. Repeat. 8-12 couplets. Never-ending — no arc, no closing gesture.

TODAY'S NEWS HEADLINES:
${finalNews.map((h,i)=>`${i+1}. ${h}`).join('\n')}

TODAY'S ADVERTISING HEADLINES:
${ads.map((h,i)=>`${i+1}. ${h}`).join('\n')}

PAIRING RULE: Each pair must be from either side of the same coin — conceptually related, same subject seen from irreconcilable positions. Not merely tonal contrast. The more precisely they share a subject while diverging in every other way, the stronger the couplet.

EXAMPLE PAIRINGS:
Iran closes Strait of Hormuz
Escape into Summer with Jet2

Tornadoes leave path of damage and destruction across Midwest
Bring on the boom

Emperor penguin declared endangered as climate change threatens Antarctica
Let's Go Places — Toyota

EDITING RULES: Do not alter semantic content. May drop articles or change verb tense for rhythm only. Do not add words.
PROHIBITIONS: No commentary. No explanatory text. The poem never acknowledges its construction.

Output only the paired couplets. Nothing else.`

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
      body: JSON.stringify({model:'claude-sonnet-4-5',max_tokens:800,messages:[{role:'user',content:'Generate the poem.'}],system:prompt})
    })
    const d = await r.json()
    return res.status(200).json({poem: d.content[0].text, context: `${finalNews.length} news headlines sourced — ${ads.length} advertising headlines — ${new Date().toDateString()}`})
  } catch(e) {
    return res.status(500).json({error:'Failed to generate poem'})
  }
}
