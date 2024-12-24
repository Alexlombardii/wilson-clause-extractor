export interface Clause {
  number: string;
  title: string;
  content: string;
  schedule?: string;
}

export function extractClauses(text: string): Clause[] {
  const clauses: Clause[] = [];
  const lines = text.split('\n');
  let currentClause: Clause | null = null;
  let currentContent: string[] = [];
  let currentSchedule: string | null = null;
  let currentPageSize = 0;
  const PAGE_SIZE_LIMIT = 3000; // Roughly one page worth of characters

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check page size and create new chunk if needed
    if (currentPageSize > PAGE_SIZE_LIMIT) {
      if (currentClause) {
        // Save current chunk
        currentClause.content = currentContent.join('\n');
        clauses.push(currentClause);
        
        // Start new chunk with same clause info
        currentContent = [];
        currentClause = {
          number: currentClause.number,
          title: currentClause.title,
          content: '',
          schedule: currentClause.schedule
        };
        currentPageSize = 0;
      }
    }

    // Add to current page size
    currentPageSize += line.length;
    
    // Check for page breaks and create new chunk
    if (line.includes('Page') || line.includes('*** End of Page ***')) {
      if (currentClause) {
        // Save current chunk
        currentClause.content = currentContent.join('\n');
        clauses.push(currentClause);
        
        // Start new chunk with same clause info but empty content
        currentContent = [];
        currentClause = {
          number: currentClause.number,
          title: currentClause.title,
          content: '',
          schedule: currentClause.schedule
        };
      }
      continue;
    }

    // Check for schedule headers
    const scheduleMatch = line.match(/^# SCHEDULE (\d+)/);
    if (scheduleMatch) {
      currentSchedule = `S${scheduleMatch[1]}`;
      console.log('Entering schedule:', currentSchedule);
      continue;
    }

    // Strictly match: # + number + . + space
    const clauseMatch = line.match(/^#\s+(\d+)\. (.+)/);
    
    if (clauseMatch) {
      // If we were building a previous clause, save it
      if (currentClause) {
        currentClause.content = currentContent.join('\n');  // Remove trim()
        console.log(`Clause ${currentClause.number} content:`, currentContent);
        clauses.push(currentClause);
      }
      
      // Start a new clause
      const clauseNumber = currentSchedule 
        ? `${currentSchedule}.${clauseMatch[1]}` 
        : clauseMatch[1];

      currentClause = {
        number: clauseNumber,
        title: clauseMatch[2],
        content: '',
        schedule: currentSchedule || undefined
      };
      currentContent = [];
      
      console.log('Found new clause:', clauseNumber, clauseMatch[2]);
    } else if (currentClause) {  // Removed line.trim() check to keep all lines
      currentContent.push(line);
      console.log(`Adding line to clause ${currentClause.number}:`, line);
    }
  }

  // Don't forget to add the last clause
  if (currentClause) {
    currentClause.content = currentContent.join('\n');  // Remove trim()
    console.log(`Final clause ${currentClause.number} content:`, currentContent);
    clauses.push(currentClause);
  }

  return clauses;
}

// Usage example:
const parsedText = "your PDF text here";
const clauses = extractClauses(parsedText);
console.log(clauses); // To see what we found 

clauses.forEach(clause => {
  console.log(`Clause ${clause.number}: ${clause.title}`);
}); 