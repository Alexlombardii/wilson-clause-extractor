import { NextResponse } from 'next/server';
import { parsePDF } from '@/lib/parsers/pdfParser';
import { extractClauses } from '@/lib/parsers/clauseParser';
import { vectorizeClauses } from '@/lib/services/vectorizeService';
import { storeClause } from '@/lib/services/astraService';

export async function POST(request: Request) {
  try {
    const { pdfUrl } = await request.json();
    
    if (!pdfUrl) {
      return NextResponse.json(
        { error: 'No PDF URL provided' },
        { status: 400 }
      );
    }

    console.log('Starting PDF parsing...');
    const parsedContent = await parsePDF(pdfUrl);
    console.log('PDF parsed successfully');

    console.log('Extracting clauses...');
    const clauses = extractClauses(parsedContent);
    console.log(`Found ${clauses.length} clauses`);

    console.log('Vectorizing clauses...');
    const vectorizedClauses = await vectorizeClauses(clauses);
    console.log('Clauses vectorized');

    console.log('Storing in AstraDB...');
    for (const clause of vectorizedClauses) {
      await storeClause(clause);
    }
    console.log('Stored in AstraDB');

    return NextResponse.json({ 
      content: parsedContent,
      clauses: vectorizedClauses
    });
    
  } catch (error) {
    console.error('Detailed parse error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to parse PDF' },
      { status: 500 }
    );
  }
} 