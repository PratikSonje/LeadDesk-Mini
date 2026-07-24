interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

// In-memory store mapping IPs/identifiers to token buckets.
// Warning: This state will reset on server restart and doesn't share across serverless edge nodes,
// but is an acceptable, lightweight approach per our single-instance deployment rules!
const buckets = new Map<string, TokenBucket>();

export function rateLimit(
  identifier: string,
  maxTokens: number = 5,
  refillIntervalMs: number = 15 * 60 * 1000 // default 15 mins
): boolean {
  const now = Date.now();
  const bucket = buckets.get(identifier);

  if (!bucket) {
    // First time we see this identifier, start them with full tokens minus 1 (for this request)
    buckets.set(identifier, { tokens: maxTokens - 1, lastRefill: now });
    return true; 
  }

  const timePassed = now - bucket.lastRefill;
  
  // If the interval has passed, completely refill their bucket
  if (timePassed >= refillIntervalMs) {
    bucket.tokens = maxTokens;
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return true; // Allowed
  }

  return false; // Rate limited (Blocked)
}
