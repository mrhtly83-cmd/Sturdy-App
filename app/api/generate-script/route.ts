import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANT: service role on server
)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { childId, childName, childAge, situation, userId } = await req.json()

    if (!childId || !situation || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert parenting coach...' },
        { role: 'user', content: `My ${childAge}-year-old child ${childName}... Situation: ${situation}` },
      ],
      temperature: 0.7,
      max_tokens: 800,
    })

    const script = completion.choices[0]?.message?.content ?? ''

    const { data, error } = await supabase
      .from('scripts')
      .insert({
        parent_id: userId,
        child_id: childId,      // UUID (FK)
        situation,
        script_text: script,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, script, scriptId: data.id })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 })
  }
}
