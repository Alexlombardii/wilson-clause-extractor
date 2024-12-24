import { createEmbedding } from './embeddingsService';
import type { Clause } from '../parsers/clauseParser';

export interface VectorizedClause extends Clause {
  embedding: number[];
}

export async function vectorizeClauses(clauses: Clause[]): Promise<VectorizedClause[]> {
  const vectorizedClauses: VectorizedClause[] = [];

  for (const clause of clauses) {
    try {
      // Combine title and content for better context
      const textToEmbed = `${clause.number}. ${clause.title}\n${clause.content}`;
      const embedding = await createEmbedding(textToEmbed);

      vectorizedClauses.push({
        ...clause,
        embedding
      });
    } catch (error) {
      console.error(`Failed to vectorize clause ${clause.number}:`, error);
    }
  }

  return vectorizedClauses;
} 