import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store for rate limiting
const rateLimit = new Map<string, { count: number; timestamp: number }>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // limit each IP to 100 requests per windowMs

export function rateLimiter(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const currentLimit = rateLimit.get(ip);

  if (!currentLimit) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return NextResponse.next();
  }

  if (currentLimit.timestamp < windowStart) {
    // Reset if outside window
    rateLimit.set(ip, { count: 1, timestamp: now });
    return NextResponse.next();
  }

  if (currentLimit.count >= MAX_REQUESTS) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': `${WINDOW_MS / 1000}`,
      },
    });
  }

  currentLimit.count++;
  rateLimit.set(ip, currentLimit);
  return NextResponse.next();
}
