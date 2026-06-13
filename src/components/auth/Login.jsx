import { useState }  from 'react'
import { useAuth }   from '../../context/AuthContext'
import { Mail, Lock, LogIn } from 'lucide-react'

function Login({ onGoSignup }) {
  const { login }               = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const errs = {}
    if (!email.trim())    errs.email    = 'Email is required.'
    if (!password.trim()) errs.password = 'Password is required.'
    return errs
  }

  const handleLogin = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setApiError('')
    try {
      await login({ email, password })
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-logo">QZ</div>
      <h2 className="auth-title">Welcome back</h2>
      <p className="auth-subtitle">Log in to your Quiz Builder account</p>

      {apiError && <p className="api-error">{apiError}</p>}

      <div className="field">
        <label>Email</label>
        <div className="input-icon-wrapper">
          <Mail size={14} className="input-icon" />
          <input type="text" placeholder="you@example.com" value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })) }} />
        </div>
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      <div className="field">
        <label>Password</label>
        <div className="input-icon-wrapper">
          <Lock size={14} className="input-icon" />
          <input type="password" placeholder="••••••••" value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })) }} />
        </div>
        {errors.password && <p className="error">{errors.password}</p>}
      </div>

      <button className="btn-green full-width" onClick={handleLogin} disabled={loading}>
        {loading
          ? 'Logging in...'
          : <><LogIn size={14} style={{ marginRight: 6 }} />Log In</>
        }
      </button>

      <p className="auth-switch">
        Don't have an account?{' '}
        <span className="auth-link" onClick={onGoSignup}>Sign up</span>
      </p>
    </div>
  )
}

export default Login