import OpenAI from 'openai';
import { findSimilarClauses } from './astraService';
import { createEmbedding } from './embeddingsService';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SIMILARITY_THRESHOLD = 0.8; // We can adjust this

const PROMPT_TEMPLATE = `
Answer the question based only on the following legal clauses:

{context}

Question: {question}

Provide a clear and concise answer based solely on the provided clauses.
`;

async function formatClauses(clauses: any[]) {
  return clauses
    .map(clause => `${clause.metadata.number}. ${clause.metadata.title}\n${clause.text}`)
    .join('\n\n');
}

export async function searchClauses(query: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const queryEmbedding = await createEmbedding(query);
      const similarClauses = await findSimilarClauses(queryEmbedding);
      
      // 3. Format clauses for context
      const context = await formatClauses(similarClauses);
      
      // 4. Get LLM response
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful legal assistant that answers questions based solely on the provided legal clauses."
          },
          {
            role: "user",
            content: PROMPT_TEMPLATE
              .replace('{context}', context)
              .replace('{question}', query)
          }
        ]
      });

      return {
        answer: completion.choices[0].message.content,
        relevantClauses: similarClauses
      };
    } catch (error) {
      if (i === retries - 1) throw error; // Only throw on last retry
      console.log(`Retry ${i + 1}/${retries}...`);
      await new Promise(r => setTimeout(r, 1000)); // Wait 1s between retries
    }
  }
} 