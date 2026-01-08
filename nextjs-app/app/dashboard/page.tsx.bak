
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Sturdy Dashboard</h1>
          <button
            onClick={signOut}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError('')}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Child</h2>
            <form onSubmit={addChild} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Child's Name
                </label>
                <input
                  type="text"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="e.g., Emma"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="e.g., 5"
                  min="1"
                  max="18"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Child
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Children</h2>
            {childrenLoading ? (
              <p className="text-gray-600">Loading children...</p>
            ) : children.length === 0 ? (
              <p className="text-gray-600">No children added yet. Add one on the left!</p>
            ) : (
              <div className="space-y-3">
                {children.map((child) => (
                  <div key={child.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-medium text-gray-900">{child.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Age: {child.birth_date 
                        ? Math.floor((new Date().getTime() - new Date(child.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                        : 'Not set'}
                    </p>
                    {child.neurotype && (
                      <p className="text-sm text-gray-600">Neurotype: {child.neurotype}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>✅ Add child profiles</li>
            <li>⚡ Build SOS Button (script generation)</li>
            <li>📝 Connect to OpenAI for script generation</li>
            <li>🔗 Invite co-parents to collaborate</li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-xs text-gray-700">
          <p><strong>Logged in as:</strong> {user?.email}</p>
          <p><strong>User ID:</strong> {user?.id}</p>
        </div>
      </main>
    </div>
  )
}