import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import {
  SYSTEM_PROMPT,
  generateSOSPrompt,
  generateWhatIfPrompt,
} from './smart-prompts'
import { checkRateLimit } from '@/lib/rate-limit'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📥 Received payload:', JSON.stringify(body, null, 2))

    const {
      childId,
      childName,
      childAge,
      neurotype,
      struggle,
      tone,
      situation,
      frequency,
      context,
      userId,
      mode = 'sos',
    } = body

    // Validate required fields
    if (!childId || !childName || !childAge || !struggle || !tone || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user's subscription tier from database
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single()

    const subscriptionTier = profile?.subscription_tier || 'free'

    // Check rate limit
    const rateLimit = await checkRateLimit(userId, subscriptionTier)

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `You've used all ${rateLimit.limit} scripts for this hour. ${
            subscriptionTier === 'free'
              ? 'Upgrade to Pro for more scripts.'
              : 'Please wait until rate limit resets.'
          }`,
          limit: rateLimit.limit,
          remaining: rateLimit.remaining,
          reset: rateLimit.reset,
          tier: subscriptionTier,
        },
        { status: 429 }
      )
    }

    console.log(`✅ Rate limit check passed (${rateLimit.remaining}/${rateLimit.limit} remaining). Generating ${mode} script...`)

    // SELECT PROMPT BASED ON MODE
    const userPrompt =
      mode === 'what-if'
        ? generateWhatIfPrompt({
            childName,
            childAge,
            neurotype,
            struggle,
            tone,
            frequency: frequency || '',
            context: context || '',
            mode,
          })
        : generateSOSPrompt({
            childName,
            childAge,
            neurotype,
            struggle,
            tone,
            situation: situation || '',
            mode,
          })

    console.log('📝 Using evidence-based smart prompt system (Good Inside, How to Talk, Whole-Brain Child)')

    // CALL OPENAI WITH EVIDENCE-BASED PROMPTS
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.75,
      max_tokens: mode === 'what-if' ? 1000 : 450,
      top_p: 0.95,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    })

    const script = response.choices[0]?.message?.content || 'Failed to generate script'
    console.log('✅ Script generated from OpenAI with evidence-based frameworks')

    // SAVE TO DATABASE
    if (mode === 'what-if') {
      const { error: saveError } = await supabase
        .from('what_if_scripts')
        .insert([
          {
            parent_id: userId,
            child_id: childId,
            struggle: struggle,
            context: context || '',
            frequency: frequency || '',
            tone: tone,
            script: script,
          },
        ])

      if (saveError) {
        console.error('Save to what_if_scripts error:', saveError)
      }
    }

    // RETURN SCRIPT
    return NextResponse.json({
      script: script,
      mode: mode,
      childName: childName,
      struggle: struggle,
      timestamp: new Date().toISOString(),
      frameworks: 'Good Inside, How to Talk, Whole-Brain Child, Cribsheet',
    })
  } catch (error) {
    console.error('❌ Script generation error:', error)

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to generate script. Please try again.'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}