import { LlamaParseReader } from "llamaindex";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function parsePDF(pdfUrl: string) {
  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error('Failed to fetch PDF');
    
    const pdfBuffer = await response.arrayBuffer();
    const tempPath = join(process.cwd(), 'temp.pdf');
    
    await writeFile(tempPath, Buffer.from(pdfBuffer));
    
    const reader = new LlamaParseReader({ 
      apiKey: process.env.LLAMAPARSE_API_KEY,
      resultType: "markdown" 
    });

    const documents = await reader.loadData(tempPath);
    
    // Let's log the number of documents and their lengths
    console.log('Number of documents:', documents.length);
    documents.forEach((doc, index) => {
      console.log(`Document ${index} length:`, doc.text.length);
    });

    // If there are multiple documents, we should combine them
    const fullText = documents.map(doc => doc.text).join('\n\n');
    return fullText;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw error;
  }
} 