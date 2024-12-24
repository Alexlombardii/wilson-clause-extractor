import { DataAPIClient } from "@datastax/astra-db-ts";
import type { VectorizedClause } from './vectorizeService';

if (!process.env.ASTRA_DB_APPLICATION_TOKEN || !process.env.ASTRA_DB_API_ENDPOINT) {
  throw new Error('Astra DB credentials not found');
}

const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(process.env.ASTRA_DB_API_ENDPOINT);
const collection = db.collection(process.env.ASTRA_DB_COLLECTION!);

interface AstraError {
  message: string;
  stack?: string;
  details?: unknown;
}

export async function storeClause(clause: VectorizedClause) {
  try {
    const document = {
      _id: `clause_${Date.now()}_${clause.number}`,
      text: `${clause.number}. ${clause.title}\n${clause.content}`,
      $vector: clause.embedding,
      metadata: {
        number: clause.number,
        title: clause.title,
        schedule: clause.schedule,
        timestamp: new Date().toISOString()
      }
    };
    
    console.log('Storing document structure:', {
      ...document,
      $vector: `[${document.$vector.length} dimensions]`
    });

    await collection.insertOne(document);
    return true;
  } catch (error: unknown) {
    const err = error as AstraError;
    console.error('Error storing clause:', err);
    throw err;
  }
}

export async function findSimilarClauses(embedding: number[], limit: number = 5) {
  try {
    const cursor = await collection.find(
      {},
      { 
        sort: {
          $vector: embedding,
        },
        limit,
        projection: {
          text: 1,
          metadata: 1,
          _id: 1
        }
      }
    );
    return cursor.toArray();
  } catch (error) {
    console.error('Error finding similar clauses:', error);
    throw error;
  }
} 