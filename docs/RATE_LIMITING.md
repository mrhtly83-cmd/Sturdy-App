# Rate Limiting Documentation

## Overview

Sturdy implements **rate limiting** on all OpenAI API routes to protect against:
- Cost overruns from bugs or abuse
- DDoS attacks on expensive AI endpoints
- Free tier abuse by malicious users
- Accidental runaway script generation

Rate limiting is implemented using **Upstash Redis** with tier-based limits.

---

## How It Works

### Architecture

```
User Request → Next.js API Route → Check Rate Limit (Upstash Redis) → Allow/Deny
                                          ↓
                                   Track usage per user + tier
```

### Implementation

Rate limiting is enforced using the `@upstash/ratelimit` library with a **sliding window** algorithm:

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export const rateLimitFree = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
  prefix: '@sturdy/ratelimit/free',
})
```

### Sliding Window Algorithm

Unlike fixed windows (which reset at specific times), sliding windows track requests over a rolling 1-hour period:

**Example:**
- User makes request at 2:00 PM (1/5 used)
- User makes request at 2:30 PM (2/5 used)
- User makes request at 3:05 PM (2/5 used, first request expired)

**Benefits:**
- Smoother rate limit enforcement
- No "burst" abuse at window boundaries
- More predictable user experience

---

## Tier Limits

| Tier | Limit | Window | Ideal For |
|------|-------|--------|-----------|
| **Free** | 5 requests | 1 hour | Testing the app, occasional use |
| **Pro** | 100 requests | 1 hour | Regular users, daily parenting support |
| **Family** | 1000 requests | 1 hour | Power users, multiple children |

### Why These Limits?

**Free Tier (5/hour):**
- Allows genuine testing without cost abuse
- ~1 script per crisis is typical usage
- Low enough to prevent bot attacks
- High enough for legitimate crises

**Pro Tier (100/hour):**
- Covers even the most intense parenting days
- Average user generates 3-10 scripts per week
- Provides generous buffer for edge cases

**Family Tier (1000/hour):**
- Essentially unlimited for real human use
- High enough to not be a blocker
- Low enough to prevent runaway bugs
- Protects against malicious automation

---

## Protected Routes

Rate limiting is enforced on these API routes:

### 1. `/api/generate-script` (SOS Scripts)
- Generates instant crisis scripts using OpenAI
- Most frequently used endpoint
- Cost: ~$0.0004 per request (GPT-4o-mini)

### 2. `/api/generate-plan` (What If Scripts)
- Generates proactive planning scripts
- Higher token usage than SOS scripts
- Cost: ~$0.0008 per request (GPT-4)

---

## Error Responses

When rate limit is exceeded, users receive a **429 Too Many Requests** response:

```json
{
  "error": "Rate limit exceeded",
  "message": "You've used all 5 scripts for this hour. Upgrade to Pro for more scripts.",
  "limit": 5,
  "remaining": 0,
  "reset": 1704729600,
  "tier": "free"
}
```

**Frontend should:**
1. Display clear message to user
2. Show time until reset (`reset` timestamp)
3. Suggest upgrade path (if on free tier)
4. Disable SOS button until reset

---

## Setup Instructions

### 1. Create Upstash Redis Database

1. Go to https://console.upstash.com/
2. Sign up or log in (free tier available)
3. Click "Create Database"
4. Choose:
   - **Name:** `sturdy-ratelimit` (or any name)
   - **Type:** Regional (faster) or Global (better availability)
   - **Region:** Choose closest to your users
   - **TLS:** Enabled (default)
5. Click "Create"

### 2. Get Credentials

1. Open your new database
2. Scroll to "REST API" section
3. Copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 3. Add to Environment Variables

**Local development (`.env.local`):**
```env
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

**Production (Vercel Dashboard):**
1. Go to Vercel project settings
2. Navigate to: Environment Variables
3. Add both variables
4. Redeploy app

### 4. Verify Setup

Test rate limiting:
```bash
# Make 6 requests in a row (should fail on 6th)
for i in {1..6}; do
  curl -X POST https://your-app.vercel.app/api/generate-script \
    -H "Content-Type: application/json" \
    -d '{"userId":"test-user-id","childId":"...","childName":"Emma","childAge":"5","neurotype":"Neurotypical","struggle":"Won'\''t do homework","tone":"gentle"}'
  echo "\n"
done
```

Expected:
- Requests 1-5: Return scripts (200 OK)
- Request 6: Return rate limit error (429)

---

## Testing Rate Limiting

### Manual Testing

**Test Free Tier Limit:**
1. Create test user (free tier)
2. Generate 5 scripts
3. Attempt 6th script
4. Expected: 429 error with upgrade message

**Test Pro Tier Limit:**
1. Update test user to 'pro' tier in database
2. Generate 101 scripts (automate with script)
3. Expected: 101st request returns 429

### Automated Testing

```typescript
// test/rate-limit.test.ts
import { checkRateLimit } from '@/lib/rate-limit'

test('Free tier allows 5 requests', async () => {
  const userId = 'test-user-free'
  
  // First 5 should succeed
  for (let i = 0; i < 5; i++) {
    const result = await checkRateLimit(userId, 'free')
    expect(result.success).toBe(true)
  }
  
  // 6th should fail
  const result = await checkRateLimit(userId, 'free')
  expect(result.success).toBe(false)
  expect(result.remaining).toBe(0)
})
```

---

## Monitoring Usage

### Upstash Dashboard

1. Go to https://console.upstash.com/
2. Open your Redis database
3. View metrics:
   - Total requests
   - Rate limit hits (429 responses)
   - Peak usage times

### Upstash Analytics

Rate limiting includes built-in analytics:

```typescript
export const rateLimitFree = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true, // ← Tracks usage patterns
  prefix: '@sturdy/ratelimit/free',
})
```

**Analytics provide:**
- Which users hit rate limits
- Time of day patterns
- Potential abuse detection

---

## Cost Analysis

### Upstash Redis Costs

**Free Tier:**
- 10,000 commands/day
- Good for: Testing, low-traffic apps
- Cost: $0

**Pay-as-you-go:**
- $0.2 per 100,000 requests
- Good for: Production apps
- Example: 1M requests/month = $2/month

### Cost Protection

Without rate limiting:
- 1 malicious user = 10,000 OpenAI requests/hour
- Cost: $4/hour × 24 hours = **$96/day**
- Total potential loss: **$2,880/month**

With rate limiting:
- Max free tier abuse: 5 requests/hour
- Max cost per user: $0.002/hour
- Even 1000 abusive users: $2/hour = **$48/day max**

**ROI:** Rate limiting pays for itself 60× over in worst-case scenarios.

---

## Upgrade Prompts

When users hit rate limits, show clear upgrade path:

### Free → Pro
```
⚠️ You've used all 5 scripts for this hour

Upgrade to Pro for:
✓ 100 scripts per hour
✓ Full journal history
✓ Tone customization
✓ Script feedback

[Upgrade to Pro - $9.99/month]
```

### Pro User (Rare)
```
⚠️ You've used all 100 scripts for this hour

This is very unusual. If you need more capacity, contact support.

Rate limit resets in: 23 minutes

[Contact Support]
```

---

## Best Practices

### 1. Cache Results Client-Side
Don't regenerate the same script multiple times:
```typescript
// Store generated script in React state
const [lastScript, setLastScript] = useState(null)

// Show cached script instead of regenerating
if (lastScript && lastScript.situation === currentSituation) {
  return lastScript
}
```

### 2. Debounce Requests
Prevent accidental double-clicks:
```typescript
const [isGenerating, setIsGenerating] = useState(false)

async function generateScript() {
  if (isGenerating) return // Prevent duplicate requests
  setIsGenerating(true)
  
  try {
    const result = await fetch('/api/generate-script', ...)
    // handle result
  } finally {
    setIsGenerating(false)
  }
}
```

### 3. Show Remaining Count
Display rate limit status to users:
```typescript
// Return remaining count in successful responses
return NextResponse.json({
  script: generatedScript,
  rateLimit: {
    remaining: rateLimit.remaining,
    limit: rateLimit.limit,
    resetAt: new Date(rateLimit.reset * 1000),
  }
})
```

### 4. Graceful Degradation
When rate limited, offer alternatives:
- Show previously generated scripts
- Suggest manual parenting strategies
- Provide general tips while waiting

---

## Troubleshooting

### "Cannot connect to Redis"
- **Cause:** Missing or incorrect Upstash credentials
- **Solution:** Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in environment variables

### "Rate limit not enforcing"
- **Cause:** Service role key bypassing rate limits
- **Solution:** Ensure rate limit check runs before database queries

### "Users hitting limits too quickly"
- **Cause:** Possible bot activity or accidental retry loops
- **Solution:** Review logs, add CAPTCHA for signup, investigate user behavior

### "429 errors but user hasn't used app"
- **Cause:** Multiple users sharing same userId (bug)
- **Solution:** Verify userId is unique per authenticated user

---

## Future Improvements

### Phase 2
- [ ] Per-endpoint rate limits (different limits for SOS vs What If)
- [ ] Burst allowance (allow 10 requests in 1 minute, then throttle)
- [ ] Dynamic limits based on usage patterns

### Phase 3
- [ ] Rate limit dashboard for users (show usage graphs)
- [ ] Weekly rate limit (in addition to hourly)
- [ ] Whitelist for trusted users (beta testers, support staff)

---

## Security Considerations

### 1. User ID Validation
Always validate that userId matches authenticated user:
```typescript
// Get userId from session, not request body
const session = await getSession(request)
const userId = session.user.id // ✓ Trusted source
// const userId = body.userId   // ✗ User can fake this
```

### 2. Redis Key Isolation
Use prefixes to prevent key collisions:
```typescript
prefix: '@sturdy/ratelimit/free' // ✓ App-specific namespace
```

### 3. Service Role Bypass
Rate limits don't protect against service role abuse:
```typescript
// Server-side admin operations still need manual checks
if (isAdminOperation) {
  // Check rate limit even with service role
  const limit = await checkRateLimit(userId, 'admin')
}
```

---

## Contact

For rate limiting issues:
- Check Upstash status: https://status.upstash.com/
- Review this documentation: `/docs/RATE_LIMITING.md`
- Check environment variables: `/docs/ENVIRONMENT_SETUP.md`

---

**Last Updated:** January 2026  
**Library:** @upstash/ratelimit v1.0.0  
**Algorithm:** Sliding Window  
**Storage:** Upstash Redis
