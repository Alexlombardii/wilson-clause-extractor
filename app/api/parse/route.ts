import { NextResponse } from 'next/server';
import { parsePDF } from '@/lib/parsers/pdfParser';
import { extractClauses } from '@/lib/parsers/clauseParser';

export async function POST(request: Request) {
  try {
    const { pdfUrl } = await request.json();
    
    if (!pdfUrl) {
      return NextResponse.json(
        { error: 'No PDF URL provided' },
        { status: 400 }
      );
    }

    const parsedContent = await parsePDF(pdfUrl);
    const clauses = extractClauses(parsedContent);

    return NextResponse.json({ 
      content: parsedContent,
      clauses: clauses
    });
    
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { error: 'Failed to parse PDF' },
      { status: 500 }
    );
  }
} 