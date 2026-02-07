// Rate limiter to prevent brute force attacks
interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const store: RateLimitStore = {};

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach(key => {
        if (store[key].resetTime < now) {
            delete store[key];
        }
    });
}, 5 * 60 * 1000);

export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    resetTime: number;
}

export function rateLimit(
    identifier: string,
    limit: number = 5,
    windowMs: number = 15 * 60 * 1000 // 15 minutes
): RateLimitResult {
    const now = Date.now();
    const key = `ratelimit:${identifier}`;

    // Initialize or get existing entry
    if (!store[key] || store[key].resetTime < now) {
        store[key] = {
            count: 0,
            resetTime: now + windowMs,
        };
    }

    // Increment count
    store[key].count++;

    const remaining = Math.max(0, limit - store[key].count);
    const success = store[key].count <= limit;

    return {
        success,
        limit,
        remaining,
        resetTime: store[key].resetTime,
    };
}

export function getRateLimitInfo(identifier: string): RateLimitResult | null {
    const key = `ratelimit:${identifier}`;
    const now = Date.now();

    if (!store[key] || store[key].resetTime < now) {
        return null;
    }

    return {
        success: true,
        limit: 5,
        remaining: Math.max(0, 5 - store[key].count),
        resetTime: store[key].resetTime,
    };
}

export function resetRateLimit(identifier: string): void {
    const key = `ratelimit:${identifier}`;
    delete store[key];
}
