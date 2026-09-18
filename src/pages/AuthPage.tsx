import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2, LogIn, UserPlus, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'
import { useToast } from '../context/ToastContext'
import { useSEO } from '../lib/seo'

interface FieldErrors {
  fullName?: string
  email?: string
  password?: string
}

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useSEO({
    title: mode === 'signin' ? 'Sign In' : 'Create Account',
    description: 'Sign in to your Magen World account or create a new account to track orders.',
    path: '/auth',
    noindex: true,
  })

  const { signIn, signUp, demoSignIn, isDemo } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/account'

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {}
    if (mode === 'signup' && fullName.trim().length === 0) {
      errors.fullName = 'Please enter your full name.'
    }
    if (email.trim().length === 0) {
      errors.email = 'Please enter your email address.'
    } else if (!emailPattern.test(email.trim())) {
      errors.email = 'Please enter a valid email address.'
    }
    if (password.length === 0) {
      errors.password = 'Please enter a password.'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.'
    }
    return errors
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setFieldErrors({})

    if (!isSupabaseConfigured) {
      setError('Connect Supabase in .env to enable accounts. In demo mode, use the demo store below.')
      return
    }

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'signup') {
        await signUp(email, password, fullName.trim())
        setInfo(
          'Account created! A confirmation email may have been sent. You can now sign in.',
        )
        setMode('signin')
        setPassword('')
      } else {
        await signIn(email, password)
        toast('Welcome back to Magen World!')
        navigate(from, { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDemo = async () => {
    if (!isDemo) return
    await demoSignIn()
    toast('Signed in to the demo store as owner.')
    navigate('/admin', { replace: true })
  }

  const inputClasses =
    'w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
      {isDemo && (
        <div className="animate-fade-in mb-6 rounded-2xl bg-emerald-900 p-5 text-center">
          <p className="text-sm font-medium text-emerald-100">
            This build is in local demo mode.
          </p>
          <button
            onClick={handleDemo}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-emerald-950 transition hover:bg-amber-300"
          >
            <Store className="h-4 w-4" /> Enter demo store
          </button>
          <p className="mt-2 text-xs text-emerald-300">
            Explore admin, orders and checkout without a database.
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="grid grid-cols-2 border-b border-stone-200">
          <button
            onClick={() => {
              setMode('signin')
              setError('')
            }}
            className={`flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition ${
              mode === 'signin'
                ? 'border-b-2 border-emerald-700 text-emerald-800'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <LogIn className="h-4 w-4" /> Sign in
          </button>
          <button
            onClick={() => {
              setMode('signup')
              setError('')
            }}
            className={`flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition ${
              mode === 'signup'
                ? 'border-b-2 border-emerald-700 text-emerald-800'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <UserPlus className="h-4 w-4" /> Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <h1 className="font-display text-xl font-bold text-stone-900">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>

          {mode === 'signup' && (
            <div>
              <label htmlFor="auth-name" className="mb-1.5 block text-sm font-medium text-stone-700">
                Full name
              </label>
              <input
                id="auth-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                aria-invalid={fieldErrors.fullName ? true : undefined}
                aria-describedby={fieldErrors.fullName ? 'auth-name-error' : undefined}
                className={inputClasses}
              />
              {fieldErrors.fullName && (
                <p id="auth-name-error" className="mt-1.5 text-xs font-medium text-rose-600">
                  {fieldErrors.fullName}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="mb-1.5 block text-sm font-medium text-stone-700">
              Email address
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby={fieldErrors.email ? 'auth-email-error' : undefined}
              className={inputClasses}
            />
            {fieldErrors.email && (
              <p id="auth-email-error" className="mt-1.5 text-xs font-medium text-rose-600">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="auth-password" className="mb-1.5 block text-sm font-medium text-stone-700">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              aria-invalid={fieldErrors.password ? true : undefined}
              aria-describedby={fieldErrors.password ? 'auth-password-error' : undefined}
              className={inputClasses}
            />
            {fieldErrors.password && (
              <p id="auth-password-error" className="mt-1.5 text-xs font-medium text-rose-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </div>
          )}
          {info && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Please wait…
              </>
            ) : mode === 'signin' ? (
              'Sign in'
            ) : (
              'Create account'
            )}
          </button>

          <p className="text-center text-xs text-stone-500">
            By continuing you agree to{' '}
            <Link to="/terms" className="font-semibold text-emerald-700 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-semibold text-emerald-700 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </div>

      <p className="mt-4 text-center text-sm text-stone-500">
        <Link to="/shop" className="font-semibold text-emerald-700 hover:text-emerald-800">
          ← Back to shop
        </Link>
      </p>
    </div>
  )
}