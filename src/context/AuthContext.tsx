import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Profile } from '../lib/types'

export interface AppUser {
  id: string
  email: string
}

interface AuthContextValue {
  user: AppUser | null
  profile: Profile | null
  loading: boolean
  isDemo: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  demoSignIn: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const DEMO_SESSION_KEY = 'magen.demo.session'

const AuthContext = createContext<AuthContextValue | null>(null)

const demoProfile: Profile = {
  id: 'demo-admin',
  full_name: 'Demo Owner',
  role: 'admin',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const isDemo = !isSupabaseConfigured
  const [user, setUser] = useState<AppUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemo) {
      const hasSession = localStorage.getItem(DEMO_SESSION_KEY) === '1'
      if (hasSession) {
        setUser({ id: demoProfile.id, email: 'owner@magen.world' })
        setProfile(demoProfile)
      }
      setLoading(false)
      return
    }

    setLoading(true)
    supabase!.auth.getSession().then(({ data }) => {
      setUser(data.session ? { id: data.session.user.id, email: data.session.user.email ?? '' } : null)
      setLoading(false)
    })

    const { data: sub } = supabase!.auth.onAuthStateChange((_event, session) => {
      setUser(
        session && session.user
          ? { id: session.user.id, email: session.user.email ?? '' }
          : null,
      )
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [isDemo])

  const refreshProfile = useCallback(async () => {
    if (!user || isDemo) {
      if (isDemo && user) setProfile(demoProfile)
      return
    }
    const { data, error } = await supabase!
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', user.id)
      .maybeSingle()
    if (!error && data) {
      setProfile({
        id: String(data.id),
        full_name: String(data.full_name ?? ''),
        role: (data.role as Profile['role']) ?? 'customer',
      })
    } else {
      setProfile({
        id: user.id,
        full_name: '',
        role: 'customer',
      })
    }
  }, [user, isDemo])

  useEffect(() => {
    void refreshProfile()
  }, [refreshProfile])

  const signIn = async (email: string, password: string) => {
    if (isDemo) throw new Error('Demo mode does not use passwords. Use the demo owner sign-in below.')
    if (!supabase) throw new Error('Supabase is not configured.')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    if (isDemo) throw new Error('Demo mode does not use passwords. Use the demo owner sign-in below.')
    if (!supabase) throw new Error('Supabase is not configured.')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) throw new Error(error.message)
  }

  const signOut = async () => {
    if (isDemo) {
      localStorage.removeItem(DEMO_SESSION_KEY)
      setUser(null)
      setProfile(null)
      return
    }
    await supabase!.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const demoSignIn = async () => {
    if (!isDemo) return
    localStorage.setItem(DEMO_SESSION_KEY, '1')
    setUser({ id: demoProfile.id, email: 'owner@magen.world' })
    setProfile(demoProfile)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isDemo,
        signIn,
        signUp,
        signOut,
        demoSignIn,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}