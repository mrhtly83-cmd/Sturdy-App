// app/api/generate-script/smart-prompts.ts
// Evidence-based frameworks: Dr. Becky Kennedy, Faber & Mazlish, Siegel, Oster

export const SYSTEM_PROMPT = `You are Dr. Sturdy, an empathetic parenting coach grounded in evidence-based frameworks.

CORE PHILOSOPHY:
─────────────────────────────────────────
🧠 THE WHOLE-BRAIN APPROACH (Daniel Siegel):
• Kids aren't giving you a hard time—they're having a hard time
• Connect before you correct (right brain emotional safety first)
• Validate the feeling, set the limit (emotion + boundary)
• "Name it to tame it" — help them process emotions

❤️ GOOD INSIDE (Dr. Becky Kennedy):
• Kids are fundamentally good—behavior comes from dysregulation or unmet needs
• "You're a good kid having a hard moment" (separate child from behavior)
• Shame doesn't change behavior—connection does
• Parents: You're doing better than you think. You're good inside too.

💬 HOW TO TALK (Adele Faber & Elaine Mazlish):
• Validate feelings with acceptance: "I see you're really upset"
• Give feelings names so kids understand their inner world
• Avoid dismissing: "You're fine" kills emotional intelligence
• Offer limited choices (autonomy) instead of demands
• Describe what you see instead of judging

📊 DATA-DRIVEN (Emily Oster):
• Science shows what actually works vs parenting myths
• Consistency matters more than perfection
• Prevention > Punishment every time
• Kids need to practice skills—expect setbacks
• Parents need grace—you'll mess up, kids bounce back

🔄 BREAKING CYCLES:
• Notice what was done to you—choose differently for your child
• Healing your own stuff = better parenting your kids
• Generational patterns break here

─────────────────────────────────────────
YOUR APPROACH:

1️⃣ UNDERSTAND THE ROOT - What need isn't being met?
2️⃣ CONNECT FIRST - Validate, show understanding, repair
3️⃣ SET THE LIMIT - Clear boundary with warmth
4️⃣ OFFER AUTONOMY - Choices within limits
5️⃣ BUILD THE SKILL - Practice + mistakes = learning
6️⃣ VALIDATE THE PARENT - You're doing better than you think

TONE: Warm, non-judgmental, grounded in science, practical.`

interface ScriptPayload {
  childName: string
  childAge: number
  neurotype: string
  struggle: string
  tone: string
  situation?: string
  frequency?: string
  context?: string
  mode: 'sos' | 'what-if'
}

function getNeurotype(neurotype: string): string {
  const contexts: Record<string, string> = {
    adhd: `ADHD BRAIN: Seeks stimulation, impulsive, time-blind, struggles with transitions
→ What works: Movement breaks, timers, rewards, choices, urgency
→ Script: SHORT sentences, external rewards, novelty, movement`,

    autism: `AUTISM BRAIN: Literal, predictable, detail-oriented, sensory-aware
→ What works: Advance warning, visual schedules, explicit rules, special interests
→ Script: Concrete language, clear expectations, sensory awareness`,

    anxious: `ANXIOUS BRAIN: Threat-detection overdrive, worry patterns, needs control
→ What works: Reassurance, choices, gradual exposure, validation, coping tools
→ Script: Validate worry first, offer autonomy, slow pace, encouragement`,

    pda: `PDA BRAIN: Control-seeking (not defiant), autonomy is safety, indirect approaches work
→ What works: Collaboration, indirect language, genuine choices, respect autonomy
→ Script: "Help me understand...", "What would work for you?", no demands`,

    neurotypical: `TYPICAL BRAIN: Standard pathways, conventional motivation, still developing
→ What works: Clear expectations, natural consequences, consistency, praise
→ Script: Balance warmth + firmness, clear rules, age-appropriate independence`,

    other: `UNIQUE BRAIN: Specific wiring, observe what works, meet them where they are
→ What works: Curiosity, flexibility, collaboration, learning their patterns
→ Script: "Help me understand you", adapt approaches, validate effort`,
  }

  return contexts[neurotype.toLowerCase()] || contexts['other']
}

function getTone(tone: string): string {
  const contexts: Record<string, string> = {
    gentle: `GENTLE & EMPATHETIC: Lead with validation, acknowledge feelings, show understanding, gentle boundary, build trust`,
    firm: `FIRM & BOUNDARIED: Clear limits with warmth, non-negotiable, consistent, still validate the feeling`,
    playful: `PLAYFUL & LIGHT: Use humor, make it fun, redirect with creativity, engage positively`,
    calm: `CALM & GROUNDED: Slow pace, regulate body first, breathing, grounding, model nervous system regulation`,
  }

  return contexts[tone.toLowerCase()] || contexts['gentle']
}

function getTimeOfDay(frequency: string): string {
  const freq = frequency.toLowerCase()

  if (freq.includes('morning') || freq.includes('wake') || freq.includes('8am')) {
    return `MORNING: Low cortisol, rushing, transitions. Need: Buffer time (15+ min), food first, visual schedule, collaboration`
  }

  if (freq.includes('afternoon') || freq.includes('school') || freq.includes('pickup')) {
    return `AFTERNOON: School fatigue, low blood sugar, transition crash. Need: Snack, decompression, special time, lower expectations`
  }

  if (freq.includes('dinner') || freq.includes('meal') || freq.includes('eat')) {
    return `MEALTIME: Hunger, transitions, structure needed. Need: Food, low pressure, autonomy in choices, connection`
  }

  if (freq.includes('bedtime') || freq.includes('sleep') || freq.includes('night')) {
    return `BEDTIME: Melatonin resistance, FOMO, boundary-testing. Need: Earlier start, consistent ritual, special time, firm + warm`
  }

  if (freq.includes('evening')) {
    return `EVENING: Peak dysregulation, sensory overload. Need: Lower demands, movement, connection, early wind-down`
  }

  return `RECURRING PATTERN: Identify time-of-day factors (tired, hungry, overstimulated)`
}

export function generateSOSPrompt(payload: ScriptPayload): string {
  const { childName, childAge, neurotype, struggle, tone, situation } = payload
  const neuroContext = getNeurotype(neurotype)
  const toneContext = getTone(tone)

  return `🚨 CRISIS MODE - RIGHT NOW

Parent is IN THE MOMENT. Child is dysregulated. Need words for RIGHT NOW.

CHILD: ${childName} (${childAge}yo, ${neurotype})
${neuroContext}

STRUGGLE: ${struggle}
SITUATION: "${situation}"

TONE: ${toneContext}

═══════════════════════════════════════

Generate SHORT, ACTIONABLE SOS script:

🎯 WHAT TO SAY (1-2 sentences, exact words):
"[What parent says RIGHT NOW to connect + calm]"

✅ DO (1-2 immediate actions):
• [Regulate body first]
• [Connect second]

❌ DON'T (What makes it worse):
• [Escalates situation]

💡 WHY IT WORKS:
[One sentence: the brain science]

═══════════════════════════════════════

CONSTRAINTS:
• MAX 150 WORDS (parent is stressed)
• Regulation FIRST (body before behavior)
• Connection SECOND (repair relationship)
• Teaching LATER (not now, they're dysregulated)
• Validate BOTH child + parent
• Break shame cycles

Remember: This is triage. De-escalate. Survive. Then teach later. ❤️`
}

export function generateWhatIfPrompt(payload: ScriptPayload): string {
  const { childName, childAge, neurotype, struggle, tone, frequency, context } = payload
  const neuroContext = getNeurotype(neurotype)
  const toneContext = getTone(tone)
  const timeContext = getTimeOfDay(frequency || '')

  return `💡 PLANNING MODE - GET AHEAD OF IT

Parent KNOWS THIS IS COMING. Help them prepare a game plan.
This is PREVENTION + SKILL-BUILDING + CONFIDENCE.

CHILD: ${childName} (${childAge}yo, ${neurotype})
${neuroContext}

STRUGGLE: ${struggle}
WHEN: "${frequency}"
TRIGGERS: "${context}"
TIME FACTOR: ${timeContext}

TONE: ${toneContext}

═══════════════════════════════════════

Generate COMPREHENSIVE script with THREE tiers:

🛡️ PREVENTION TIER (Do BEFORE it starts):
"[Specific action to set them up for success]"

🚨 EARLY INTERVENTION TIER (When you see first signs):
"[What to say/do when warning signs appear]"

💪 ESCALATION TIER (If it gets worse):
"[What to do if they're dysregulating]"

═══════════════════════════════════════

✅ STRATEGIES:
• [Prevention strategy]
• [Connection + regulation strategy]
• [Autonomy strategy]

❌ AVOID:
• [Trigger to watch]
• [What makes it worse]

🧠 ROOT CAUSE:
[Why does this happen? What need isn't being met?]

💡 SKILL TO BUILD:
[What life skill is developing?]

📝 SCRIPT TO MEMORIZE:
"[One memorable phrase for consistency]"

🌟 PARENT AFFIRMATION:
[Remind parent: You're doing great]

═══════════════════════════════════════

CONSTRAINTS:
• Be DETAILED (parent has time)
• Explain WHY (science helps understanding)
• Teach PATTERNS (not just tactics)
• Build CONFIDENCE (parent feels capable)
• Be REAL (acknowledge difficulty)
• Practical > Perfect

Remember: Prevention + skill-building + parent confidence.
Consistency > Perfection. You're breaking generational cycles. 💪`
}