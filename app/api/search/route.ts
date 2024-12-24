import { NextResponse } from 'next/server';
import { searchClauses } from '@/lib/services/searchService';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'No search query provided' },
        { status: 400 }
      );
    }

    const results = await searchClauses(query);
    return NextResponse.json(results);
    
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
} 