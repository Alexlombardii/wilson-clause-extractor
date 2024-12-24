import { LlamaParseReader } from "llamaindex";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function parsePDF(pdfUrl: string) {
  try {
    console.log('Fetching PDF from URL:', pdfUrl);
    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    
    console.log('Converting PDF to buffer...');
    const pdfBuffer = await response.arrayBuffer();
    const tempPath = join(process.cwd(), 'temp.pdf');
    
    console.log('Writing PDF to temp file...');
    await writeFile(tempPath, Buffer.from(pdfBuffer));
    
    console.log('Initializing LlamaParse reader...');
    const reader = new LlamaParseReader({ 
      apiKey: process.env.LLAMAPARSE_API_KEY,
      resultType: "markdown" 
    });

    console.log('Processing PDF with LlamaParse...');
    const documents = await reader.loadData(tempPath);
    
    console.log('Number of documents:', documents.length);
    documents.forEach((doc, index) => {
      console.log(`Document ${index} length:`, doc.text.length);
    });

    const fullText = documents.map(doc => doc.text).join('\n\n');
    return fullText;
  } catch (error) {
    console.error('Detailed PDF parsing error:', error);
    throw new Error(`PDF parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 