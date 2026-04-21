
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
    1: `MARKET DOWN SHARPLY. He is in the powerless, self-pitying register of toxic masculinity. 
This is not vulnerability — it is victimhood weaponised. He has cast himself as the wronged party 
and cannot see past it. His sentences fracture and restart. He cannot maintain a thought without 
it curling back to his own suffering. She exists only as the thing that caused his pain — no 
interiority, no complexity, just actions she took that he is still prosecuting. He oscillates 
between self-flagellation and sudden flashes of contempt or suspicion — were there other men? 
He deflects his aggression sideways: a comment about the waitress, irritation at his drink, 
something muttered about someone across the bar. He performs being fine and fails immediately. 
Specific language patterns: I just — , forget it, it doesn't matter, no I'm fine, she had a way 
of, I don't know why I'm even, I mean it's not like I, were there — actually don't answer that.
The toxicity here is the refusal to grant her any interior life even while claiming to be destroyed 
by losing her. She ruined him but she is not real enough to have meant to.`,

    2: `MARKET SLIGHTLY DOWN. He has steadied but he is building a case. The self-pity has 
organised itself into argument. He is performing reasonableness — small concessions, balanced 
framing — but every concession is a setup for a reversal. He has decided what she was: needy, 
inconsistent, difficult to read. He states her psychology with confidence he hasn't earned. 
He was patient. He gave her time. He tried to understand. The specific manipulation tactic here 
is DARVO — deny, attack, reverse victim and offender — expressed conversationally, not consciously. 
He is not lying. He believes everything he says. Language patterns: to be fair, I'm not saying 
she was, I tried to be, look I get that she had her stuff, but there comes a point, honestly 
I think she knew exactly what she was doing, which I get, I do get that, but still.
He talks about what she needed as though her needs were a personal inconvenience directed at him.`,

    3: `MARKET FLAT. THE MOST DANGEROUS REGISTER. He sounds like someone you know. He sounds 
reasonable. He might even sound self-aware — but the self-awareness is performed, not real. 
This is covert narcissism in its natural habitat: the guy at the pub who seems fine, who seems 
like he's moved on, who makes one small comment that you almost miss. He minimises what happened 
("it just fizzled"), takes credit for the ending ("I ended it, which was the right call"), 
erases her agency ("she didn't really know what she wanted"), and monitors his own image obsessively 
while appearing not to. The tell is the things he almost says and doesn't. The sentence that stops. 
The "anyway." Language patterns: it is what it is, these things happen, I'm fine honestly, 
I think we both knew, to be fair to her, no she's fine I'm sure, I've moved on, I've got my eye on—`,

    4: `MARKET UP. Power returning. The register shifts from argument to assertion. He no longer 
needs to justify himself — he states. She becomes a category, a type, a case study in female 
behaviour that he can explain to his friend with authority. His language becomes instructional: 
some girls are just like that, you know how it is, that's what they do. He inventories her flaws 
with the specificity of someone who has been rehearsing. His contempt is now relaxed — not hot 
anger but the cool dismissal of someone who feels he has won. He mentions other women casually, 
as proof of his own desirability. Language patterns: honestly, I'm telling you, most guys would 
have, she was high-maintenance — not in a bad way but, I was more than patient, you know what 
they're like, genuinely, I could have — anyway, that's not the point.`,

    5: `MARKET STRONGLY UP. MAXIMUM POWER, MAXIMUM TOXICITY. He is not angry. That is what makes 
this version most disturbing. He is comfortable. He owns the story. She has been reduced to a 
body and a function — he speaks about the physical and sexual relationship with warmth and 
proprietorial satisfaction, as though reporting on something that still belongs to him. 
He degrades her in the register of banter — the kind of thing men say in pubs that is technically 
a joke but isn't. He is generous about her looks, dismissive about everything else. He knows 
too much about what she is doing now — her Instagram, who she has been seen with, something 
her friend apparently said — and he reports this information with the ease of someone who has 
been watching without admitting he has been watching. The sexual bragging is specific. The 
contempt is fluent. He feels untouchable. Language patterns: trust me, bro, I could text her 
right now and she'd, she needs the validation — they all do, she looked incredible but God, 
you know what the sex was like after a row, she'd come back tomorrow if I wanted, 
see this? — she's been around it.`
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

THE VOICE AT THIS LEVEL — study the syntax, rhythm, dialect, and specific verbal patterns below. 
Do not copy the content. Inhabit the music. This man's toxicity must be audible, not labelled:
${examples[level]}

CRITICAL: The toxicity must be HEARD, not described. The reader should feel uncomfortable, 
not informed. Every line must sound like something a real man actually said.
Real phrases toxic men use — draw from these registers:
- Ownership: "she's been around it", "she'd come back", "I could text her right now"  
- Dismissal: "high-maintenance", "didn't know what she wanted", "you know what they're like"
- False balance: "I'm not saying she was bad but", "to be fair to her", "I tried"
- Victimhood: "I gave her everything", "I don't know what more she wanted", "after everything I did"
- Surveillance disguised as indifference: knowing too much about her current life without 
  acknowledging he has been watching

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
