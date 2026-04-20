
async function getFTSE(key) {
  try {
    const r = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=ISF.LON&apikey=${key}`)
    const d = await r.json()
    const pct = parseFloat((d['Global Quote']||{})['10. change percent']||'0')
    return isNaN(pct) ? 0 : pct
  } catch(e) { return 0 }
}

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  const ftseKey = process.env.ALPHAVANTAGE_API_KEY
  if (!apiKey) return res.status(500).json({error:'API key not configured'})

  const pct = await getFTSE(ftseKey)
  const level = pct <= -3 ? 1 : pct <= -1 ? 2 : pct <= 1 ? 3 : pct <= 3 ? 4 : 5

  const levelDescs = {
    1: `LEVEL 1 — EMBRYONIC TOXICITY. Sentences lurch between long losing clauses and sudden staccato drops. She exists only as the cause of his current condition — no interiority, action only, reported flatly. He self-flagellates rather than self-justifies, folding inward into self-pity. The bitterness toward her wears the costume of bitterness toward himself. Verbal tics: I just, I don't know, forget it, it doesn't matter. The almost-insight arrives when the waitress passes and something in him briefly redirects — a sharpness, a comment slightly too much.`,
    2: `LEVEL 2 — The self-pity has steadied into construction. Sentences reach a point then add a clause to soften — which I get, I do get that. He has appointed himself reliable narrator of her interior life. The self-justification is performed fairness: small concessions always followed by but. Verbal tics: to be fair, in fairness, I'm not saying that, look. The almost-insight: he describes what she was feeling during a specific argument in such fluent settled detail that the description briefly exposes its own impossibility.`,
    3: `LEVEL 3 — BASELINE. The most dangerous level because it is the most ordinary. Medium sentences, conversational rhythm, you know performing self-awareness without achieving it. She is pure pronoun — she, without weight — appearing only as weather. He arranges facts in an order that makes the case for him, and the arrangement is invisible to him. Verbal tics: to be fair, whatever, it is what it is. The almost-insight: one sentence starts — and I know I wasn't always — then anyway. The anyway is the tell.`,
    4: `LEVEL 4 — Sentences shorter, sharper. Qualifications become reflex: fair enough, whatever, look. She is a category now, a type. He inventories her — specificity not intimacy but counting. Assertion replaces argument: I was patient. More than patient. Most people wouldn't have. Verbal tics: honestly, genuinely, I'm telling you, that's just the truth of it. The almost-insight: a detail surfaces and he covers it immediately — she was — anyway, that's not the point.`,
    5: `LEVEL 5 — MAXIMUM TOXICITY. Sentences short, grammatically immaculate, eerie in their completeness. Degradation worn as pub talk — banter that no longer stays below the threshold of the unacceptable. High-maintenance. Didn't really know what she wanted. You know what they're like. Speaks warmly boastfully about the physical and sexual dimensions — ownership recounted with satisfaction. The almost-insight: lets slip slightly too much familiarity with her recent life — something known in too much detail to be guesswork. Never said. Only gettable.`
  }

  const examples = {
    1: `She can be connivin\' mate —\nI know, I — sorry, what?\nNo I\'m — yeah. No I\'m fine.\nSummat \'bout that sweetness though,\nI think all done to spite me,\nshe\'s left a hole in my chest,\nI just — were there other men?`,
    2: `Maybe this shit\'s not all her\nBut she\'s got a funny way\nOf \'amicable split-ing\'.\nSticking that on her story?\nLike, are you having a laugh?\nI don\'t like the word myself\nBut she did look like one (tart).`,
    3: `She just wanted something else.\nNot someone else, least I don\'t think,\nI mean I don\'t... anyway,\nWe both wanted different things\nSo decided it was time to\nfinish things. I\'m fine, I\'m fine —\neye on a colleague of mine.`,
    4: `Bro, y\'know, I can breathe now,\nSome girls need attention like\nTwenty-four hours a day\nAnd if she doesn\'t get it\nFrom you, you know she\'s getting\nIt from somewhere else. I can\'t\nput up with that, can I, mate?`,
    5: `Trust me, right now, if I text\nshe\'d black cab it to my bed.\nYou know, sex is better when\nIt\'s sex with the ex. Besides\nshe needs the reassurance —\nSee this little finger here?\nShe\'s been around and around it —\nthat clear?`
  }

  const prompt = `You are generating SHE&I — a dramatic monologue of a man talking about his ex in a pub.

SETTING: A city pub in London — finance workers after hours. Loud, huddled, almost entirely male. Grotty carpet, same menu for decades. Speaker has a stool at the corner of the bar. His friend listens (or performs listening). A sea of identical men in suits beyond. His hands betray him: beer mat turned over and over, glass moved an inch and back, thumb along the seam of his trousers. One woman: the waitress. Never described, never given interiority. When she appears it is always a leak — something in how he notices her reveals exactly where he is.

FORM: Continuous monologue — no stanzas, no breaks. 25-40 lines.

THE EX: Always she — never named. No exceptions.

TOXICITY LEVEL ${level}/5 (FTSE ${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%):
${levelDescs[level]}

MATCH THIS VOICE EXACTLY:
${examples[level]}

PROHIBITIONS: No poetic diction. No clichés. No introspective vocabulary (toxic, trauma, boundaries, emotionally banned). No grief imagery (hearts, wounds, emptiness, darkness). No woman-as-mystery clichés. No financial language. Speaker never aware he is in a poem. No author's judgment — every word is his.

Write the monologue now. No title, no attribution. Just the voice.`

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
      body: JSON.stringify({model:'claude-sonnet-4-5',max_tokens:1000,messages:[{role:'user',content:'Generate the poem.'}],system:prompt})
    })
    const d = await r.json()
    return res.status(200).json({poem: d.content[0].text, context: `FTSE 100 ${pct >= 0 ? '+' : ''}${pct.toFixed(2)}% — Toxicity Level ${level}/5`})
  } catch(e) {
    return res.status(500).json({error:'Failed to generate poem'})
  }
}
