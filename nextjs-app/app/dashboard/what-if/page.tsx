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

export default function WhatIfPage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [children, setChildren] = useState<Child[]>([])
  const [childrenLoading, setChildrenLoading] = useState(false)
  const [selectedChild, setSelectedChild] = useState<string>('')
  const [struggle, setStruggle] = useState('')
  const [frequency, setFrequency] = useState('')
  const [context, setContext] = useState('')
  const [tone, setTone] = useState('gentle')
  const [generatedScript, setGeneratedScript] = useState('')
  const [scriptLoading, setScriptLoading] = useState(false)
  const [scriptError, setScriptError] = useState('')
  const [mainError, setMainError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchChildren()
    }
  }, [user])

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
        setMainError(`Fetch error: ${fetchError.message}`)
        return
      }

      setChildren(data || [])
    } catch (err) {
      console.error('Failed to fetch children:', err)
      setMainError('Failed to fetch children')
    } finally {
      setChildrenLoading(false)
    }
  }

  const generateWhatIfScript = async (e: React.FormEvent) => {
    e.preventDefault()
    setScriptError('')
    setGeneratedScript('')

    if (!selectedChild) {
      setScriptError('Please select a child')
      return
    }

    if (!struggle) {
      setScriptError('Please select a struggle type')
      return
    }

    if (!frequency.trim()) {
      setScriptError('Please tell us when this usually happens')
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

      const payload = {
        childId: selectedChild,
        childName: child.name,
        childAge: childAge,
        neurotype: child.neurotype || 'neurotypical',
        struggle: struggle,
        frequency: frequency.trim(),
        context: context.trim(),
        tone: tone,
        userId: user.id,
        mode: 'what-if',
      }

      console.log('📤 Sending What If payload:', JSON.stringify(payload, null, 2))

      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate script')
      }

      const data = await response.json()
      setGeneratedScript(data.script)
    } catch (err) {
      console.error('What If script generation error:', err)
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
      <nav className="w-full bg-white shadow-2xl border-b-4 border-blue-500 sticky top-0 z-40">
        <div className="page-center__inner py-6">
          <div className="center-block flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-700 font-bold text-xl"
              >
                ← Back
              </Link>
              <h1 className="text-5xl font-black text-blue-600">💡 What If</h1>
            </div>
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
        {/* Intro */}
        <div className="center-block text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Plan Ahead for Predictable Moments
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Know your child's patterns? Generate smart scripts BEFORE the struggle happens.
          </p>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl mb-2">🧠</p>
              <p className="font-bold text-gray-700">Prevention</p>
              <p className="text-sm text-gray-600">Get ahead of it</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-2">📋</p>
              <p className="font-bold text-gray-700">Preparation</p>
              <p className="text-sm text-gray-600">Be ready</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-2">😌</p>
              <p className="font-bold text-gray-700">Confidence</p>
              <p className="text-sm text-gray-600">Know what to do</p>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {mainError && (
          <div className="center-block p-6 bg-red-50 border-2 border-red-200 rounded-xl mb-8">
            <p className="text-red-800 font-semibold text-lg">{mainError}</p>
            <button
              onClick={() => setMainError('')}
              className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Form */}
        <div className="center-block bg-white rounded-2xl shadow-xl p-12 border-t-4 border-blue-500 mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-10 center-text">
            Create a What If Script
          </h3>

          {!generatedScript ? (
            <form onSubmit={generateWhatIfScript} className="space-y-8">
              {scriptError && (
                <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl text-base text-red-800 font-bold">
                  ⚠️ {scriptError}
                </div>
              )}

              {/* FIELD 1: Child Selection */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  Which child?
                </label>
                <select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                >
                  <option value="">Select a child...</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* FIELD 2: Struggle Category */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  What's the recurring struggle?
                </label>
                <select
                  value={struggle}
                  onChange={(e) => setStruggle(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                >
                  <option value="">Select a struggle type...</option>
                  <option value="aggression">🤛 Aggression (hitting, kicking)</option>
                  <option value="lying">🤥 Lying/Dishonesty</option>
                  <option value="bedtime">🛏️ Bedtime Resistance</option>
                  <option value="homework">📚 Homework Refusal</option>
                  <option value="screen-time">📱 Screen Time Battles</option>
                  <option value="tantrums">😤 Tantrums/Meltdowns</option>
                  <option value="sibling">👶 Sibling Conflict</option>
                  <option value="defiance">🚫 Defiance/Not Listening</option>
                  <option value="morning">🌅 Morning Chaos</option>
                  <option value="transitions">🔄 Transitions/Changes</option>
                </select>
              </div>

              {/* FIELD 3: When does it happen? */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  When does this usually happen?
                </label>
                <input
                  type="text"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="e.g., Every morning at 8am, After school, At bedtime, During dinner..."
                />
              </div>

              {/* FIELD 4: Context/Triggers */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  What's the context? (What triggers it?)
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="e.g., Tired, hungry, doesn't want to leave fun activity, afraid of the dark, wants my attention, sibling is annoying..."
                  rows={4}
                />
              </div>

              {/* FIELD 5: Tone */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  What tone should the script be?
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                >
                  <option value="gentle">🤗 Gentle & Empathetic</option>
                  <option value="firm">💪 Firm & Boundaried</option>
                  <option value="playful">🎭 Playful & Light</option>
                  <option value="calm">🧘 Calm & Grounded</option>
                </select>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={scriptLoading}
                className="w-full px-8 py-5 bg-blue-600 text-white rounded-xl font-black text-2xl hover:bg-blue-700 disabled:opacity-50"
              >
                {scriptLoading ? '⏳ Generating...' : '✨ Generate What If Script'}
              </button>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="bg-blue-50 border-3 border-blue-400 rounded-2xl p-8">
                <p className="text-center text-xl text-blue-800 font-black mb-6">
                  💡 HERE'S YOUR WHAT IF SCRIPT
                </p>
                <div className="bg-white rounded-xl p-6 border-2 border-blue-300 whitespace-pre-wrap text-gray-800 text-lg leading-relaxed font-semibold overflow-y-auto max-h-96">
                  {generatedScript}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedScript)
                    alert('✅ Copied to clipboard!')
                  }}
                  className="w-full px-6 py-5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-bold text-xl"
                >
                  📋 Copy Script
                </button>
                <button
                  onClick={() => {
                    setGeneratedScript('')
                    setSelectedChild('')
                    setStruggle('')
                    setFrequency('')
                    setContext('')
                    setTone('gentle')
                  }}
                  className="w-full px-6 py-5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-xl"
                >
                  🔄 Create Another
                </button>
                <Link
                  href="/dashboard"
                  className="w-full px-6 py-5 bg-gray-700 text-white rounded-xl hover:bg-gray-800 font-bold text-xl text-center"
                >
                  ✓ Back to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="center-block bg-blue-50 rounded-2xl shadow-xl p-10 border-t-4 border-blue-500">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 center-text">
            💡 What If Tips
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-4 text-lg text-gray-700">
              <span className="text-2xl flex-shrink-0">✓</span>
              <span>
                <strong>Be specific about timing:</strong> "Every Tuesday afternoon at pickup" gives better results than "sometimes"
              </span>
            </li>
            <li className="flex items-start gap-4 text-lg text-gray-700">
              <span className="text-2xl flex-shrink-0">✓</span>
              <span>
                <strong>Describe triggers:</strong> What happens right before? Low blood sugar? Tired? Transitions? Details matter.
              </span>
            </li>
            <li className="flex items-start gap-4 text-lg text-gray-700">
              <span className="text-2xl flex-shrink-0">✓</span>
              <span>
                <strong>Reference later:</strong> Bookmark this page. Screenshot scripts. Build your personal parent playbook.
              </span>
            </li>
            <li className="flex items-start gap-4 text-lg text-gray-700">
              <span className="text-2xl flex-shrink-0">✓</span>
              <span>
                <strong>Adjust neurotype:</strong> Make sure your child's neurotype is set up for best scripts.
              </span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}