import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sturdy - Parenting Scripts',
  description: 'Just-in-time parenting scripts when you need them most',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* HEADER */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link 
                href="/dashboard" 
                className="text-2xl font-bold text-teal-600 hover:text-teal-700 transition-colors"
              >
                🏠 Sturdy
              </Link>
            </div>
          </header>

          {children}

          {/* FOOTER */}
          <footer className="bg-gray-100 py-8 mt-16 border-t border-gray-300">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-center gap-8 text-sm">
                <a href="/privacy" className="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </a>
                <span className="text-gray-300">•</span>
                <a href="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms of Service
                </a>
                <span className="text-gray-300">•</span>
                <a href="/disclaimers" className="text-gray-600 hover:text-gray-900">
                  Disclaimers
                </a>
                <span className="text-gray-300">•</span>
                <a href="mailto:legal@sturdy-app.com" className="text-gray-600 hover:text-gray-900">
                  Contact Legal
                </a>
              </div>
              
              <div className="text-center mt-6 text-xs text-gray-500">
                <p>© 2026 Sturdy. All rights reserved.</p>
              </div>
            </div>
          </footer>

        </AuthProvider>
      </body>
    </html>
  )
}
