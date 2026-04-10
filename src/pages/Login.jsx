import { useAuth } from '../contexts/AuthContext'
import './Login.css'

function Login() {
  const { signInWithGoogle } = useAuth()

  return (
    <div className="login">
      <div className="login-card">
        <h1>Hockey Tracker</h1>
        <p>Sign in to track your stats</p>
        <button className="login-btn" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      </div>
    </div>
  )
}

export default Login
