'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

interface Child {
  id: string
  name: string
  birth_date: string | null
  neurotype: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [children, setChildren] = useState<Child[]>([])
  const [childrenLoading, setChildrenLoading] = useState(false)
  const [newChildName, setNewChildName] = useState('')
  const [newChildAge, setNewChildAge] = useState('')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [showSOSModal, setShowSOSModal] = useState(false)
  const [selectedChild, setSelectedChild] = useState<string>('')
  const [situation, setSituation] = useState('')
  const [generatedScript, setGeneratedScript] = useState('')
  const [scriptLoading, setScriptLoading] = useState(false)
  const [scriptError, setScriptError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      initializeUser()
    }
  }, [user])

  const initializeUser = async () => {
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (fetchError?.code === 'PGRST116') {
        await supabase
          .from('profiles')
          .insert([
            {
              id: user?.id,
              email: user?.email,
              subscription_tier: 'free',
            },
          ])
      }

      await fetchChildren()
    } catch (err) {
      console.error('Profile initialization error:', err)
      setError('Error initializing profile. Check console.')
    }
  }

  const fetchChildren = async () => {
    try {
      setChildrenLoading(true)
      const { data, error: fetchError } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', user?.id)
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Fetch children error:', fetchError)
        setError(`Fetch error: ${fetchError.message}`)
        return
      }

      setChildren(data || [])
    } catch (err) {
      console.error('Failed to fetch children:', err)
      setError('Failed to fetch children')
    } finally {
      setChildrenLoading(false)
    }
  }

  const addChild = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!newChildName.trim()) {
      setFormError('Child name is required')
      return
    }

    if (!newChildAge || parseInt(newChildAge) <= 0) {
      setFormError('Valid age is required')
      return
    }

    if (!user) {
      setFormError('Not authenticated')
      return
    }

    try {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - parseInt(newChildAge))

      const { error: insertError } = await supabase
        .from('children')
        .insert([
          {
            parent_id: user.id,
            name: newChildName.trim(),
            birth_date: birthDate.toISOString().split('T')[0],
            neurotype: null,
          },
        ])

      if (insertError) {
        console.error('Insert error:', insertError)
        setFormError(`Error: ${insertError.message}`)
        return
      }

      setNewChildName('')
      setNewChildAge('')
      await fetchChildren()
    } catch (err) {
      console.error('Failed to add child:', err)
      setFormError('Failed to add child')
    }
  }

  const generateScript = async (e: React.FormEvent) => {
    e.preventDefault()
    setScriptError('')
    setGeneratedScript('')

    if (!selectedChild) {
      setScriptError('Please select a child')
      return
    }

    if (!situation.trim()) {
      setScriptError('Please describe the situation')
      return
    }

    if (!user) {
      setScriptError('Not authenticated')
      return
    }

    try {
      setScriptLoading(true)

      const child = children.find((c) => c.id === selectedChild)
      if (!child) {
        setScriptError('Child not found')
        return
      }

      const childAge = child.birth_date
        ? Math.floor(
            (new Date().getTime() - new Date(child.birth_date).getTime()) /
              (365.25 * 24 * 60 * 60 * 1000)
          )
        : 5

      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: child.name,
          situation: situation.trim(),
          childAge: childAge,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate script')
      }

      const data = await response.json()
      setGeneratedScript(data.script)
    } catch (err) {
      console.error('Script generation error:', err)
      setScriptError(
        err instanceof Error ? err.message : 'Failed to generate script'
      )
    } finally {
      setScriptLoading(false)
    }
  }

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-2xl border-b-4 border-teal-500">
        <div className="w-full px-4 py-10">
          <div className="max-w-7xl mx-auto">
            {/* Top row: Title + Sign out */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-5xl font-bold text-teal-600">Sturdy</h1>
              <button
                onClick={signOut}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
              >
                Sign out
              </button>
            </div>

            {/* Center: SOS Button */}
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setShowSOSModal(true)}
                className="px-16 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-2xl font-bold text-2xl shadow-lg hover:from-red-700 hover:to-red-800 transition transform hover:scale-105"
              >
                🆘 SOS BUTTON - NEED HELP?
              </button>
            </div>

            {/* Subtitle */}
            <p className="text-center text-gray-600 text-sm">Click when you need a parenting script in the moment</p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">{error}</p>
            <button
              onClick={() => setError('')}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Add Child Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-teal-500">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Add Child</h2>
            <form onSubmit={addChild} className="space-y-6">
              {formError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Child's Name
                </label>
                <input
                  type="text"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                  placeholder="e.g., Emma"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Age
                </label>
                <input
                  type="number"
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                  placeholder="e.g., 5"
                  min="1"
                  max="18"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-bold text-lg shadow-md hover:shadow-lg transition"
              >
                + Add Child
              </button>
            </form>
          </div>

          {/* Children List */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-teal-500">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Children</h2>
            {childrenLoading ? (
              <p className="text-gray-600 text-center py-12">Loading children...</p>
            ) : children.length === 0 ? (
              <p className="text-gray-600 text-center py-12 text-lg">No children added yet.</p>
            ) : (
              <div className="space-y-4">
                {children.map((child) => (
                  <div key={child.id} className="p-5 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border-2 border-teal-200 hover:shadow-md transition">
                    <p className="font-bold text-xl text-gray-900">{child.name}</p>
                    <p className="text-base text-gray-600 mt-2">
                      Age: {child.birth_date 
                        ? Math.floor((new Date().getTime() - new Date(child.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                        : 'Not set'}
                    </p>
                    {child.neurotype && (
                      <p className="text-base text-gray-600">Neurotype: {child.neurotype}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-teal-500 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Next Steps</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-lg text-gray-700">
              <span className="text-3xl">✅</span> Add child profiles
            </li>
            <li className="flex items-center gap-3 text-lg text-gray-700">
              <span className="text-3xl">✅</span> Build SOS Button (script generation)
            </li>
            <li className="flex items-center gap-3 text-lg text-gray-700">
              <span className="text-3xl">⚡</span> Connect to OpenAI for script generation
            </li>
            <li className="flex items-center gap-3 text-lg text-gray-700">
              <span className="text-3xl">🔗</span> Invite co-parents to collaborate
            </li>
          </ul>
        </div>

        {/* Debug Info */}
        <div className="bg-gray-800 rounded-xl text-gray-300 p-6 text-sm space-y-2">
          <p><strong className="text-white">Logged in as:</strong> {user?.email}</p>
          <p><strong className="text-white">User ID:</strong> {user?.id}</p>
        </div>
      </main>

      {/* SOS Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 p-8 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-3xl font-bold text-white">🆘 SOS Button</h2>
              <button
                onClick={() => {
                  setShowSOSModal(false)
                  setGeneratedScript('')
                  setSituation('')
                  setSelectedChild('')
                  setScriptError('')
                }}
                className="text-white hover:bg-red-800 rounded-full w-10 h-10 flex items-center justify-center text-3xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              {!generatedScript ? (
                <form onSubmit={generateScript} className="space-y-6">
                  {scriptError && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-sm text-red-800 font-medium">
                      {scriptError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Child
                    </label>
                    <select
                      value={selectedChild}
                      onChange={(e) => setSelectedChild(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                    >
                      <option value="">Choose a child...</option>
                      {children.map((child) => (
                        <option key={child.id} value={child.id}>
                          {child.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      What's Happening Right Now?
                    </label>
                    <textarea
                      value={situation}
                      onChange={(e) => setSituation(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                      placeholder="Describe the situation you need help with..."
                      rows={6}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={scriptLoading}
                    className="w-full px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {scriptLoading ? '⏳ Generating script...' : '✨ Generate Script'}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
                    <p className="text-sm text-green-800 font-bold mb-3">✅ Script Generated</p>
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 text-base leading-relaxed bg-white rounded p-4 border border-green-200">
                      {generatedScript}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedScript)
                        alert('✅ Script copied to clipboard!')
                      }}
                      className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold shadow-md hover:shadow-lg transition"
                    >
                      📋 Copy Script
                    </button>
                    <button
                      onClick={() => {
                        setGeneratedScript('')
                        setSituation('')
                        setSelectedChild('')
                      }}
                      className="flex-1 px-4 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-semibold shadow-md hover:shadow-lg transition"
                    >
                      🔄 Try Again
                    </button>
                    <button
                      onClick={() => {
                        setShowSOSModal(false)
                        setGeneratedScript('')
                        setSituation('')
                        setSelectedChild('')
                      }}
                      className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 font-semibold shadow-md hover:shadow-lg transition"
                    >
                      ✓ Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}