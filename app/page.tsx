import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-12">PDF Clause Extractor</h1>
      
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/upload"
          className="p-6 border rounded-lg hover:border-blue-500 transition-colors text-center group"
        >
          <h2 className="text-xl font-semibold mb-3 group-hover:text-blue-500">Upload PDFs</h2>
          <p className="text-gray-600">
            Upload your PDF documents to extract and analyze legal clauses
          </p>
        </Link>

        <Link 
          href="/summary"
          className="p-6 border rounded-lg hover:border-blue-500 transition-colors text-center group"
        >
          <h2 className="text-xl font-semibold mb-3 group-hover:text-blue-500">View Summaries</h2>
          <p className="text-gray-600">
            Review and analyze extracted clauses from your documents
          </p>
        </Link>
      </div>
    </main>
  )
}
