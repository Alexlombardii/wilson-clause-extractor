'use client'

import { useState } from 'react'
import Navigation from '../../src/components/Navigation'

interface SearchResult {
  answer: string;
  relevantClauses: {
    text: string;
    metadata: {
      number: string;
      title: string;
    }
  }[];
}

export default function Summary() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    try {
      setIsSearching(true)
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) throw new Error('Search failed')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Search error:', error)
      alert('Failed to search clauses')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <Navigation />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">Search Legal Clauses</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., What are the termination clauses?"
              className="flex-1 p-2 border rounded"
            />
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {result && (
          <div className="space-y-6">
            {/* AI Answer */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="font-semibold mb-2">Answer:</h2>
              <p className="whitespace-pre-wrap">{result.answer}</p>
            </div>

            {/* Relevant Clauses */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Relevant Clauses:</h2>
              <div className="space-y-4">
                {result.relevantClauses.map((clause, index) => (
                  <div 
                    key={index}
                    className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                  >
                    <h3 className="font-semibold mb-2">
                      {clause.metadata.number}. {clause.metadata.title}
                    </h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {clause.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 