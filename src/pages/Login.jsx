import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Login.css'

function Login() {
  const { signInWithGoogle } = useAuth()
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState(null)

  const handleSignIn = async () => {
    setSigningIn(true)
    setError(null)
    const result = await signInWithGoogle()
    if (result?.error) {
      setError(result.error)
      setSigningIn(false)
    }
  }

  return (
    <div className="login">
      <div className="login-card">
        <h1>Hockey Tracker</h1>
        <p>Sign in to track your stats</p>
        {error && <p className="login-error">{error}</p>}
        <button
          className="login-btn"
          onClick={handleSignIn}
          disabled={signingIn}
        >
          {signingIn ? 'Redirecting...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  )
}

export default Login
