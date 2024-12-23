'use client'

import { useState, useCallback } from 'react'
import Navigation from '../../src/components/Navigation'

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [parsedContent, setParsedContent] = useState<any>(null) // We'll type this properly later

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.type === 'application/pdf') {
        setFile(file)
      } else {
        alert('Please upload a PDF file')
      }
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setFile(files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      // Upload phase
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }

      const { url } = await uploadResponse.json()
      console.log('File uploaded successfully:', url)

      // Parsing phase
      setIsParsing(true)
      const parseResponse = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdfUrl: url }),
      })

      if (!parseResponse.ok) {
        throw new Error('Parsing failed')
      }

      const { content, clauses } = await parseResponse.json()
      setParsedContent({ fullText: content, clauses: clauses })
      console.log('Parsed content:', content)
      alert('File uploaded and parsed successfully!')
      setFile(null)
      
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to process file')
    } finally {
      setIsUploading(false)
      setIsParsing(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <Navigation />
      
      <h1 className="text-2xl font-bold mb-8 text-center">Upload New PDF</h1>
      
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="space-y-4">
              <p className="text-green-600">✓ {file.name}</p>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-red-500 text-sm hover:text-red-600"
              >
                Remove file
              </button>
            </div>
          ) : (
            <>
              <p className="mb-2">Drag and drop your PDF here, or</p>
              <label className="cursor-pointer text-blue-500 hover:text-blue-600">
                browse
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>

        {file && (
          <button 
            type="submit"
            disabled={isUploading || isParsing}
            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {isUploading ? 'Uploading...' : isParsing ? 'Parsing...' : 'Upload PDF'}
          </button>
        )}

        {(isUploading || isParsing) && (
          <div className="mt-4 space-y-2">
            <div className="h-1 bg-gray-200 rounded">
              <div 
                className="h-1 bg-blue-500 rounded transition-all duration-500"
                style={{ 
                  width: isUploading ? '50%' : isParsing ? '100%' : '0%'
                }}
              />
            </div>
            <p className="text-sm text-center text-gray-600">
              {isUploading ? 'Uploading PDF...' : 'Parsing content...'}
            </p>
          </div>
        )}
      </form>

      {parsedContent && (
        <div className="mt-8 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Found Clauses</h2>
          <div className="mb-8 space-y-6">
            {parsedContent.clauses.map((clause: any, index: number) => (
              <div 
                key={`${clause.number}-${clause.title}-${index}`} 
                className="border rounded-lg p-4 shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {clause.number}: {clause.title}
                </h3>
                <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded text-sm">
                  {clause.content}
                </pre>
              </div>
            ))}
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Full Parsed Content</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
            {JSON.stringify(parsedContent.fullText, null, 2)}
          </pre>
        </div>
      )}
    </main>
  )
} 