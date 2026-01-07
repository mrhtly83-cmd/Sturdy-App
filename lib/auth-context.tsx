'use client'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setUser(data.session?.user ?? null)
        setSession(data.session ?? null)
      } catch (err) {
        console.error('Get session error:', err)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setSession(session ?? null)
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      setError(null)
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signupError) throw signupError

      setUser(data.user)
      setSession(data.session)

      router.push('/onboarding')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign up failed'
      setError(msg)
      throw err
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const { data, error: signinError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signinError) throw signinError

      setUser(data.user)
      setSession(data.session)

      router.push('/dashboard')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign in failed'
      setError(msg)
      throw err
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      const { error: signoutError } = await supabase.auth.signOut()

      if (signoutError) throw signoutError

      setUser(null)
      setSession(null)

      router.push('/')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign out failed'
      setError(msg)
      throw err
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
