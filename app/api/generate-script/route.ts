import { NextRequest, NextResponse } from 'next/server'
import { generateParentingScript } from '@/lib/openai'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { childName, situation, childAge, userId } = await request.json()

    if (!childName || !situation || !childAge || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate script from OpenAI
    const script = await generateParentingScript(childName, situation, childAge)

    // Save to database
    const { data, error } = await supabase
      .from('scripts')
      .insert([
        {
          parent_id: userId,
          situation: situation,
          generated_script: script,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save script' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      script: script,
      scriptId: data[0]?.id,
    })
  } catch (error) {
    console.error('Script generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    )
  }
}