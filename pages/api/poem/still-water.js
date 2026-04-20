
const REVIEWS = [
  {stars:1,text:"Absolutely vile. Smells like a swimming pool. Returned the whole lot."},
  {stars:2,text:"Tastes faintly of plastic. Not what I expected for the price. Won't be buying again."},
  {stars:2,text:"The bottles leaked in transit. Water everywhere. Disappointing from a brand I usually trust."},
  {stars:1,text:"Flat, lifeless, wrong somehow. I don't know how to describe it. Just wrong."},
  {stars:3,text:"Does what it says. No taste to speak of. The bottles are flimsy though."},
  {stars:2,text:"Slight chemical aftertaste. My children refused to drink it. Going back to tap."},
  {stars:1,text:"The plastic smells. I poured it down the sink. All of it. One star is generous."},
  {stars:3,text:"It's water. That's all you can say. The packaging is excessive for what it is."},
  {stars:2,text:"Not what I was expecting. There's a warmth to it even when chilled. Strange."},
  {stars:2,text:"The caps don't seal properly. Half arrived open. Environmental waste on top of everything."},
  {stars:1,text:"Tried it once. Never again. Something about it coats your mouth."},
  {stars:3,text:"Barely acceptable. Does the job but only just. I've had better from a garden hose."},
  {stars:2,text:"The plastic taste is real. I noticed it immediately. My husband says I'm imagining it. I'm not."},
  {stars:1,text:"Genuinely shocked this is sold as drinking water. Returned immediately."},
  {stars:2,text:"Fine for cooking. Wouldn't drink it. The smell when you open the bottle is off."},
  {stars:3,text:"Mediocre. Exactly mediocre. Not offensive, not good. Just there."},
  {stars:2,text:"The bottles are too thin. They collapse when you try to drink from them. Annoying design."},
  {stars:1,text:"This is not water. I don't know what this is but it is not water."},
  {stars:2,text:"Expected nothing and still somehow disappointed. Going back to the branded stuff."},
  {stars:3,text:"It's fine. That's the best I can say. It's fine."},
]

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({error:'API key not configured'})

  const shuffled = [...REVIEWS].sort(()=>Math.random()-0.5)
  const selected = [...shuffled.filter(r=>r.stars===1).slice(0,3), ...shuffled.filter(r=>r.stars===2).slice(0,7), ...shuffled.filter(r=>r.stars===3).slice(0,3)].sort(()=>Math.random()-0.5)
  const reviewText = selected.map(r=>`[${r.stars} STAR]: "${r.text}"`).join('\n')

  const prompt = `You are generating STILL WATER — a modernist epic poem composed from unfavourable reviews of supermarket own-brand bottled water.

SOURCE REVIEWS:
${reviewText}

FORM: Continuous, section-free free verse. No closing refrain. Ends when material ends. Target: approximately 90 lines. Long lines with internal rhythm through repetition and syntactic parallelism. Long lines must accommodate short declarative sentences — the abrupt verdict landing inside the expansive line.

SPEAKER: A single composite voice — one poet assembled from many reviewers. Register: modernist, grand, precise, completely earnest. Think Pound, think Eliot. The grandeur is never ironic. Whatever comedy or tragedy exists in the collision between register and subject is the reader's to find, never the poem's to signal.

TRANSFORMATION RULES: Work with the reviewers' own language — lift phrases, compress, recontextualise through lineation. Draw equally from reviews about taste AND reviews about everything else — packaging, delivery, environmental concern, value, smell. The non-taste material is half the poem. 1-star reviews are formal verdicts — use for the most declarative moments. No line may end on an emotion word.

EXAMPLE PASSAGES:
Oh! The faint taste
of plastic hits my lips.
Not what I'd expected
considering the price —
such anger! such disdain! —
thus never buying again.

The verdict is absolute:
Vile!
Smells like swimming pools
god has not rained on
for a while.
I returned the lot.

PROHIBITIONS: No ironic distance. No comedy signalled by the poem. No snigger. No elevated diction outside the modernist tradition or the source material. Speaker never editorialises outside the reviews.

Write the poem now. No title, no attribution.`

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
      body: JSON.stringify({model:'claude-sonnet-4-5',max_tokens:2000,messages:[{role:'user',content:'Generate the poem.'}],system:prompt})
    })
    const d = await r.json()
    return res.status(200).json({poem: d.content[0].text, context: `${selected.length} reviews sourced — ${selected.filter(r=>r.stars===1).length} one-star verdicts`})
  } catch(e) {
    return res.status(500).json({error:'Failed to generate poem'})
  }
}
