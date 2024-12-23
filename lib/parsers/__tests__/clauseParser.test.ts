import { extractClauses } from '../clauseParser';

const testText = `
1. Definitions

1.1 In this Agreement, except to the extent expressly provided otherwise:
"Account" means an account enabling a person to access and use the Hosted Services;

2. Credit

2.1 This document was created using a template.
2.2 You must retain the above credit.

3. Term

3.1 This Agreement shall come into force upon the Effective Date.
`;

describe('clauseParser', () => {
  it('should extract main clauses correctly', () => {
    const clauses = extractClauses(testText);
    
    interface Clause {
      title: string;
      content?: string;
    }
    
    expect(Array.isArray(clauses)).toBe(true);
    expect(clauses).toHaveLength(3);
    expect(clauses[0].title).toBe('Definitions');
    expect(clauses[1].title).toBe('Credit');
    expect(clauses[2].title).toBe('Term');
  });
}); 
