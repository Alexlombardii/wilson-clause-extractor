import { OpenAIApi, Configuration } from 'openai';

// Initialize OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function createEmbedding(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text,
    });

    return response.data.data[0].embedding;
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw error;
  }
}

// Helper function to chunk text if needed
export function chunkText(text: string, maxChunkLength: number = 8000): string[] {
  // OpenAI has a token limit, so we might need to split long texts
  const chunks: string[] = [];
  let currentChunk = '';

  const sentences = text.split('. ');

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length < maxChunkLength) {
      currentChunk += (currentChunk ? '. ' : '') + sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = sentence;
    }
  }

  if (currentChunk) chunks.push(currentChunk);

  return chunks;
} 