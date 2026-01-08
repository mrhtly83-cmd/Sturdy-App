import { createClient } from '@supabase/supabase-js'

/**
 * Get user's subscription tier from the database
 * Defaults to 'free' if user not found or tier not set
 */
export async function getUserSubscriptionTier(
  userId: string
): Promise<'free' | 'pro' | 'family'> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', userId)
    .single() as { data: { subscription_tier: string } | null }

  if (profile && profile.subscription_tier) {
    const tier = profile.subscription_tier
    if (tier === 'free' || tier === 'pro' || tier === 'family') {
      return tier
    }
  }

  return 'free'
}
