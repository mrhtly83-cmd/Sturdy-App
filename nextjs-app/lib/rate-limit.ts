import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create Redis client (uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars)
const redis = Redis.fromEnv()

// Rate limit: 5 requests per 1 hour for free tier
export const rateLimitFree = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
  prefix: '@sturdy/ratelimit/free',
})

// Rate limit: 100 requests per 1 hour for pro tier
export const rateLimitPro = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 h'),
  analytics: true,
  prefix: '@sturdy/ratelimit/pro',
})

// Rate limit: 1000 requests per 1 hour for family tier (high limit to prevent abuse)
export const rateLimitFamily = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, '1 h'),
  analytics: true,
  prefix: '@sturdy/ratelimit/family',
})

/**
 * Check rate limit based on user's subscription tier
 * 
 * @param userId - The authenticated user's ID
 * @param subscriptionTier - The user's subscription tier ('free', 'pro', or 'family')
 * @returns Object with rate limit status and metadata
 */
export async function checkRateLimit(
  userId: string,
  subscriptionTier: 'free' | 'pro' | 'family'
) {
  const ratelimit =
    subscriptionTier === 'family'
      ? rateLimitFamily
      : subscriptionTier === 'pro'
      ? rateLimitPro
      : rateLimitFree

  const { success, limit, reset, remaining } = await ratelimit.limit(userId)

  return {
    success,
    limit,
    reset,
    remaining,
    tier: subscriptionTier,
  }
}
