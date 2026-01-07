'use client'
import Link from 'next/link'
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

  console.log('🚀 Generate script clicked')
  console.log('selectedChild:', selectedChild)
  console.log('situation:', situation)
  console.log('user:', user?.id)

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
    console.log('Found child:', child)

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

    const payload = {
      childId: selectedChild,
      childName: child.name,
      situation: situation.trim(),
      childAge: childAge,
      userId: user.id,
    }

    console.log('📤 Sending payload:', JSON.stringify(payload, null, 2))

    const response = await fetch('/api/generate-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      const data = await response.json()
      console.error('API error response:', data)
      throw new Error(data.error || 'Failed to generate script')
    }

    const data = await response.json()
    console.log('✅ Script received:', data.script)
    setGeneratedScript(data.script)
  } catch (err) {
    console.error('❌ Script generation error:', err)
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
    <div className="page-center bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Sticky Header */}
      <nav className="w-full bg-white shadow-2xl border-b-4 border-teal-500 sticky top-0 z-40">
  <div className="page-center__inner py-6">
    <div className="center-block flex justify-between items-center">
      <h1 className="text-5xl font-black text-teal-600">Sturdy</h1>
      <div className="flex gap-4 items-center">
        <Link
          href="/dashboard/library"
          className="px-6 py-2 text-sm font-medium text-teal-600 bg-teal-50 border border-teal-300 rounded-lg hover:bg-teal-100 transition"
        >
          📚 Library
        </Link>
        <button
          onClick={signOut}
          className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
        >
          Sign out
        </button>
      </div>
    </div>
  </div>
</nav>


      {/* Main Content */}
      <main className="page-center__inner">
        {/* SOS Button - Main CTA */}
        <div className="center-block flex flex-col items-center gap-4">
          <button
            onClick={() => setShowSOSModal(true)}
            className="px-20 py-8 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-3xl hover:shadow-2xl font-black text-4xl shadow-lg hover:from-red-700 hover:to-red-800 transition transform hover:scale-110 active:scale-95"
          >
            🆘 SOS BUTTON
          </button>
          <p className="center-text text-gray-600 text-lg font-semibold">
            Click when you need a parenting script RIGHT NOW
          </p>
        </div>

        {/* Error Banner */}
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

        {/* Add Child Form */}
        <div className="center-block bg-white rounded-2xl shadow-xl p-10 border-t-4 border-teal-500">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 center-text">Add Child</h2>
          <form onSubmit={addChild} className="space-y-6">
            {formError && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-sm text-red-800 font-medium">
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
        <div className="center-block bg-white rounded-2xl shadow-xl p-10 border-t-4 border-teal-500">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 center-text">Your Children</h2>
          {childrenLoading ? (
            <p className="text-gray-600 center-text py-12 text-lg">Loading children...</p>
          ) : children.length === 0 ? (
            <p className="text-gray-600 center-text py-12 text-lg">No children added yet.</p>
          ) : (
            <div className="space-y-4">
              {children.map((child) => (
                <div key={child.id} className="p-5 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border-2 border-teal-200 hover:shadow-md transition center-text">
                  <p className="font-bold text-xl text-gray-900">{child.name}</p>
                  <p className="text-base text-gray-600 mt-2">
                    Age: {child.birth_date 
                      ? Math.floor((new Date().getTime() - new Date(child.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                      : 'Not set'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="center-block bg-white rounded-2xl shadow-xl p-10 border-t-4 border-teal-500">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 center-text">Next Steps</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-4 text-lg text-gray-700 justify-center">
              <span className="text-3xl">✅</span> Add child profiles
            </li>
            <li className="flex items-center gap-4 text-lg text-gray-700 justify-center">
              <span className="text-3xl">✅</span> Build SOS Button
            </li>
            <li className="flex items-center gap-4 text-lg text-gray-700 justify-center">
              <span className="text-3xl">⚡</span> Connect to OpenAI
            </li>
            <li className="flex items-center gap-4 text-lg text-gray-700 justify-center">
              <span className="text-3xl">🔗</span> Invite co-parents
            </li>
          </ul>
        </div>

        {/* Debug Info */}
        <div className="center-block bg-gray-800 rounded-xl text-gray-300 p-6 text-sm space-y-2">
          <p className="center-text"><strong className="text-white">Logged in:</strong> {user?.email}</p>
          <p className="center-text"><strong className="text-white">User ID:</strong> {user?.id}</p>
        </div>
      </main>

      {/* SOS Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 p-10 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-4xl font-black text-white">🆘 SOS</h2>
              <button
                onClick={() => {
                  setShowSOSModal(false)
                  setGeneratedScript('')
                  setSituation('')
                  setSelectedChild('')
                  setScriptError('')
                }}
                className="text-white hover:bg-red-800 rounded-full w-12 h-12 flex items-center justify-center text-4xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-12">
              {!generatedScript ? (
                <form onSubmit={generateScript} className="space-y-8">
                  {scriptError && (
                    <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl text-base text-red-800 font-bold">
                      ⚠️ {scriptError}
                    </div>
                  )}

                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-4">
                      Which child?
                    </label>
                    <select
                      value={selectedChild}
                      onChange={(e) => setSelectedChild(e.target.value)}
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg font-semibold"
                    >
                      <option value="">Select a child...</option>
                      {children.map((child) => (
                        <option key={child.id} value={child.id}>
                          {child.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-4">
                      What's happening?
                    </label>
                    <textarea
                      value={situation}
                      onChange={(e) => setSituation(e.target.value)}
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
                      placeholder="Describe the situation..."
                      rows={8}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={scriptLoading}
                    className="w-full px-8 py-5 bg-red-600 text-white rounded-xl font-black text-2xl hover:bg-red-700 disabled:opacity-50"
                  >
                    {scriptLoading ? '⏳ Generating...' : '✨ Generate Script'}
                  </button>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="bg-green-50 border-3 border-green-400 rounded-2xl p-8">
                    <p className="text-center text-xl text-green-800 font-black mb-6">✅ HERE'S YOUR SCRIPT</p>
                    <div className="bg-white rounded-xl p-6 border-2 border-green-300 whitespace-pre-wrap text-gray-800 text-lg leading-relaxed font-semibold">
                      {generatedScript}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedScript)
                        alert('✅ Copied!')
                      }}
                      className="w-full px-6 py-5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-bold text-xl"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={() => {
                        setGeneratedScript('')
                        setSituation('')
                        setSelectedChild('')
                      }}
                      className="w-full px-6 py-5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-xl"
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
                      className="w-full px-6 py-5 bg-gray-700 text-white rounded-xl hover:bg-gray-800 font-bold text-xl"
                    >
                      ✓ Close
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
