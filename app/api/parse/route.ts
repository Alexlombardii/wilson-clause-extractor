import { NextResponse } from 'next/server';
import { parsePDF } from '@/lib/parsers/pdfParser';

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
    return NextResponse.json({ content: parsedContent });
    
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { error: 'Failed to parse PDF' },
      { status: 500 }
    );
  }
} 