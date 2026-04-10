import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const handleSession = (session) => {
      const u = session?.user ?? null
      setUser(u)
      setIsGuest(u?.is_anonymous === true)
      setLoading(false)
    }

    // Listen for auth changes first (catches OAuth callback tokens)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session)
    })

    // Also check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session)
    }).catch(() => {
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    if (!supabase) {
      return { error: 'Supabase is not configured. Check your environment variables.' }
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/hockey-thingy/',
      },
    })
    if (error) {
      console.error('Sign in error:', error.message)
      return { error: error.message }
    }
    if (data?.url) {
      window.location.href = data.url
    }
    return { error: null }
  }

  const signInAnonymously = async () => {
    if (!supabase) {
      return { error: 'Supabase is not configured.' }
    }
    const { error } = await supabase.auth.signInAnonymously()
    if (error) {
      console.error('Anonymous sign in error:', error.message)
      return { error: error.message }
    }
    return { error: null }
  }

  const signOut = () => {
    if (!supabase) return
    return supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, isGuest, signInWithGoogle, signInAnonymously, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
