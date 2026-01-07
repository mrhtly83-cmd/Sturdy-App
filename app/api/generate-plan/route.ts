import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { childName, childAge, childNeurotype, struggle, frequency, triggers } = await req.json()

    const prompt = `You are an expert parenting coach. Create a 3-part proactive plan for this situation:

Child: ${childName}, age ${childAge}, neurotype: ${childNeurotype}
Struggle: ${struggle}
Frequency: This struggle happens ${frequency}
${triggers ? `Triggers: ${triggers}` : ''}

Generate a practical 3-part plan with specific, actionable strategies:

1. PREVENTION: How can the parent PREVENT this struggle from happening? (specific triggers to avoid, routines to establish, environmental changes, etc.)

2. INTERVENTION: What should the parent DO IN THE MOMENT when the struggle is happening? (specific language to use, techniques, what NOT to do, how to stay calm)

3. ESCALATION: What should the parent do if the behavior ESCALATES or gets worse? (when to pause, de-escalation techniques, when to seek professional help)

Be specific, evidence-based, developmental, and account for the child's neurotype. Focus on what the parent can CONTROL.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const content = response.choices[0].message.content || ''

    // Parse into 3 sections
    const preventionMatch = content.match(/1\.\s*PREVENTION:?\s*([\s\S]*?)(?=2\.\s*INTERVENTION|$)/)
    const interventionMatch = content.match(/2\.\s*INTERVENTION:?\s*([\s\S]*?)(?=3\.\s*ESCALATION|$)/)
    const escalationMatch = content.match(/3\.\s*ESCALATION:?\s*([\s\S]*?)$/)

    const prevention = preventionMatch?.[1]?.trim() || ''
    const intervention = interventionMatch?.[1]?.trim() || ''
    const escalation = escalationMatch?.[1]?.trim() || ''

    return NextResponse.json({
      prevention,
      intervention,
      escalation,
    })
  } catch (error) {
    console.error('Plan generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate plan' },
      { status: 500 }
    )
  }
}
