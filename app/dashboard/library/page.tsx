'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Script {
  id: string
  child_id: string
  situation: string
  script_text: string
  created_at: string
}

interface Child {
  id: string
  name: string
}

export default function LibraryPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [scripts, setScripts] = useState<Script[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [scriptsLoading, setScriptsLoading] = useState(false)
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)
  const [error, setError] = useState('')
  const [filterChildId, setFilterChildId] = useState<string>('all')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      setScriptsLoading(true)

      // Fetch children
      const { data: childrenData, error: childrenError } = await supabase
        .from('children')
        .select('id, name')
        .eq('parent_id', user?.id)

      if (childrenError) throw childrenError
      setChildren(childrenData || [])

      // Fetch scripts
      const { data: scriptsData, error: scriptsError } = await supabase
        .from('scripts')
        .select('*')
        .eq('parent_id', user?.id)
        .order('created_at', { ascending: false })

      if (scriptsError) throw scriptsError
      setScripts(scriptsData || [])
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Failed to load library')
    } finally {
      setScriptsLoading(false)
    }
  }

  const getChildName = (childId: string) => {
    return children.find((c) => c.id === childId)?.name || 'Unknown Child'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const deleteScript = async (scriptId: string) => {
    if (!confirm('Delete this script?')) return

    try {
      const { error } = await supabase
        .from('scripts')
        .delete()
        .eq('id', scriptId)

      if (error) throw error

      setScripts(scripts.filter((s) => s.id !== scriptId))
      setSelectedScript(null)
    } catch (err: any) {
      setError(err.message || 'Failed to delete script')
    }
  }

  const filteredScripts =
    filterChildId === 'all'
      ? scripts
      : scripts.filter((s) => s.child_id === filterChildId)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="page-center bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header with Back Button */}
      <nav className="w-full bg-white shadow-2xl border-b-4 border-teal-500 sticky top-0 z-40">
        <div className="page-center__inner py-6">
          <div className="center-block flex justify-between items-center">
            <Link
              href="/dashboard"
              className="text-teal-600 hover:text-teal-700 font-bold text-xl flex items-center gap-2"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-black text-teal-600">📚 Script Library</h1>
            <div className="w-32" /> {/* Spacer for alignment */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="page-center__inner">
        {error && (
          <div className="center-block p-6 bg-red-50 border-2 border-red-200 rounded-xl">
            <p className="text-red-800 font-semibold text-lg">{error}</p>
            <button
              onClick={() => setError('')}
              className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filter Section */}
        <div className="center-block bg-white rounded-2xl shadow-xl p-10 border-t-4 border-teal-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 center-text">Filter by Child</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setFilterChildId('all')}
              className={`px-6 py-3 rounded-lg font-bold transition ${
                filterChildId === 'all'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              All Children ({scripts.length})
            </button>
            {children.map((child) => {
              const count = scripts.filter((s) => s.child_id === child.id).length
              return (
                <button
                  key={child.id}
                  onClick={() => setFilterChildId(child.id)}
                  className={`px-6 py-3 rounded-lg font-bold transition ${
                    filterChildId === child.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {child.name} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Scripts Grid */}
        <div className="center-block">
          {scriptsLoading ? (
            <p className="text-gray-600 center-text py-12 text-lg">Loading scripts...</p>
          ) : filteredScripts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 border-t-4 border-teal-500 center-text">
              <p className="text-gray-600 text-xl font-semibold mb-4">
                No scripts yet. Generate your first one!
              </p>
              <Link
                href="/dashboard"
                className="inline-block px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold text-lg"
              >
                🆘 Go to SOS Button
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredScripts.map((script) => (
                <button
                  key={script.id}
                  onClick={() => setSelectedScript(script)}
                  className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 hover:border-teal-500 hover:shadow-xl transition text-left"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <p className="text-sm font-bold text-teal-600 uppercase">
                        {getChildName(script.child_id)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(script.created_at)}
                      </p>
                    </div>
                    <span className="text-2xl">💬</span>
                  </div>
                  <p className="text-gray-700 font-semibold line-clamp-3">
                    {script.situation}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {script.script_text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Script Detail Modal */}
      {selectedScript && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-blue-600 p-10 flex justify-between items-start rounded-t-3xl">
              <div>
                <p className="text-sm font-bold text-teal-100 uppercase">
                  {getChildName(selectedScript.child_id)}
                </p>
                <h2 className="text-3xl font-black text-white mt-2">
                  {selectedScript.situation}
                </h2>
                <p className="text-teal-100 text-sm mt-2">
                  {formatDate(selectedScript.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedScript(null)}
                className="text-white hover:bg-teal-700 rounded-full w-12 h-12 flex items-center justify-center text-3xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-12">
              <div className="bg-blue-50 border-3 border-blue-300 rounded-2xl p-8 mb-8">
                <p className="text-sm font-bold text-blue-800 uppercase mb-4">
                  Your Script
                </p>
                <div className="bg-white rounded-xl p-6 border-2 border-blue-200 whitespace-pre-wrap text-gray-800 text-lg leading-relaxed font-semibold">
                  {selectedScript.script_text}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedScript.script_text)
                    alert('✅ Copied to clipboard!')
                  }}
                  className="w-full px-6 py-5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-bold text-lg"
                >
                  📋 Copy Script
                </button>
                <button
                  onClick={() => {
                    deleteScript(selectedScript.id)
                  }}
                  className="w-full px-6 py-5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold text-lg"
                >
                  🗑️ Delete Script
                </button>
                <button
                  onClick={() => setSelectedScript(null)}
                  className="w-full px-6 py-5 bg-gray-700 text-white rounded-xl hover:bg-gray-800 font-bold text-lg"
                >
                  ✓ Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
