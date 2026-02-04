import { NextRequest, NextResponse } from 'next/server';
import { performSemanticSearch } from '@/utilities/semanticSearch';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Upstash Redis and Ratelimit
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit',
});

export async function GET(req: NextRequest) {
  // Use IP address for rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous';
  
  // Rate limit check
  const isLocal = process.env.NODE_ENV === 'development';
  
  if (!isLocal && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { success, limit, reset, remaining } = await ratelimit.limit(ip);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again in a minute.' },
          { 
            status: 429,
            headers: {
              'X-Ratelimit-Limit': limit.toString(),
              'X-Ratelimit-Remaining': remaining.toString(),
              'X-Ratelimit-Reset': reset.toString(),
            }
          }
        );
      }
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Fallback: allow the request if rate limiting fails to ensure availability
    }
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter "q"' }, { status: 400 });
  }

  if (query.length > 200) {
    return NextResponse.json({ error: 'Query too long. Maximum 200 characters.' }, { status: 400 });
  }

  const VECTOR_DATABASE_URL = process.env.VECTOR_DATABASE_URL;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!VECTOR_DATABASE_URL || !OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Server configuration missing' }, { status: 500 });
  }

  try {
    const searchResponse = await performSemanticSearch(query);

    return NextResponse.json(searchResponse);
  } catch (error) {
    console.error('Semantic search error:', error);
    
    // Check if it's the missing pg_trgm extension error
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('function similarity(text, text) does not exist')) {
      return NextResponse.json({ 
        error: 'Database extension "pg_trgm" is not enabled. Please run "CREATE EXTENSION IF NOT EXISTS pg_trgm;" in your PostgreSQL database.' 
      }, { status: 500 });
    }

    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
