
## Core Components

### Frontend (`app/` directory)
- `app/page.tsx`: Home page with navigation
- `app/upload/page.tsx`: PDF upload interface with drag-and-drop
- `app/summary/page.tsx`: Clause search and analysis interface

### API Routes
- `app/api/upload/route.ts`: Handles PDF uploads to Vercel Blob
- `app/api/parse/route.ts`: Manages PDF parsing and clause extraction
- `app/api/search/route.ts`: Handles semantic search queries

### Services (`lib/services/`)
- `astraService.ts`: Vector database operations
- `embeddingsService.ts`: OpenAI embeddings generation
- `vectorizeService.ts`: Converts clauses to vector embeddings
- `searchService.ts`: RAG implementation for clause retrieval

### Parsers (`lib/parsers/`)
- `pdfParser.ts`: PDF text extraction using LlamaParse
- `clauseParser.ts`: Extracts individual clauses from text

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Storage**: Vercel Blob Storage, AstraDB (Vector Database)
- **AI/ML**: OpenAI Embeddings, GPT-3.5-turbo, LlamaParse
- **Deployment**: Vercel

## Pipeline Flow

1. **Upload Flow**:
   - User uploads PDF
   - File stored in Vercel Blob
   - Returns public URL

2. **Processing Flow**:
   - LlamaParse extracts text from PDF
   - Custom parser identifies clauses
   - Clauses converted to embeddings
   - Stored in AstraDB vector database

3. **Search Flow**:
   - User queries for specific clause types
   - Query converted to embedding
   - Vector similarity search in AstraDB
   - GPT provides contextual response

## Environment Setup

Required environment variables:
   - API Keys:
   - OPENAI_API_KEY=
   - BLOB_READ_WRITE_TOKEN=
   - LLAMAPARSE_API_KEY=
   - Database:
   - ASTRA_DB_APPLICATION_TOKEN=
   - ASTRA_DB_API_ENDPOINT=
   - ASTRA_DB_KEYSPACE=
   - ASTRA_DB_COLLECTION=

## Key Features

- PDF upload with drag-and-drop
- Automatic clause extraction
- Vector similarity search
- AI-powered clause analysis
- Real-time processing feedback

## Future Improvements

1. Enriching metadata of clauses using context and chatgpt
2. A reranking check
3. UI/UX improvements
5. Deployment libraries

## Time allocation

1. Start: 9:35
2. Planning + initial setup: 9:35-9:45
3. Stage 1: Upload pdfs + parsing pdf: 10:00-10:20
4. Stage 2: Split Clauses based on structure: 10:20-11:30
5. Stage 3: Vectorise clause chunks and store in Vector db: 11:30-11:50
6. Stage 4: RAG of Clauses: 11:50-12:00
7. Attempted deployment: 12:00-12:15 (Worried about changing too much of the working code libraries)
8. Clean ReadME: 12:15-12:30
