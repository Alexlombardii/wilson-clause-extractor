import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="mb-8">
      <div className="max-w-4xl mx-auto flex justify-center space-x-4">
        <Link 
          href="/"
          className={`px-4 py-2 rounded-lg ${
            pathname === '/' ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-50'
          }`}
        >
          Home
        </Link>
        <Link 
          href="/upload"
          className={`px-4 py-2 rounded-lg ${
            pathname === '/upload' ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-50'
          }`}
        >
          Upload
        </Link>
        <Link 
          href="/summary"
          className={`px-4 py-2 rounded-lg ${
            pathname === '/summary' ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-50'
          }`}
        >
          Summaries
        </Link>
      </div>
    </nav>
  )
} 