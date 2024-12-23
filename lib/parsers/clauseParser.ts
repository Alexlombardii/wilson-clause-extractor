interface Clause {
  number: string;
  title: string;
  content: string;
  subClauses?: Clause[];
}

export function extractClauses(text: string): Clause[] {
  // Pattern to match main clauses: \n\n{number}. {Title}\n\n
  const mainClausePattern = /\n\n(\d+)\. ([^\n]+)\n\n/g;
  const clauses: Clause[] = [];
  let lastIndex = 0;
  let match;

  // Find all main clauses
  while ((match = mainClausePattern.exec(text)) !== null) {
    const [fullMatch, number, title] = match;
    const startIndex = match.index + fullMatch.length;
    
    // If this isn't the first match, save the previous clause's content
    if (clauses.length > 0) {
      const previousClause = clauses[clauses.length - 1];
      previousClause.content = text.slice(lastIndex, match.index).trim();
    }

    clauses.push({
      number,
      title,
      content: '',
      subClauses: []
    });

    lastIndex = startIndex;
  }

  // Get content for the last clause
  if (clauses.length > 0) {
    const lastClause = clauses[clauses.length - 1];
    lastClause.content = text.slice(lastIndex).trim();
  }

  return clauses;
} 