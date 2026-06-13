import { useState }  from 'react'
import { Mail, Lock, User, UserPlus } from 'lucide-react'
import { registerUser } from '../../api/authService'

function Signup({ onGoLogin }) {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess]   = useState(false)

  const validate = () => {
    const errs = {}
    if (!name.trim())         errs.name     = 'Name is required.'
    if (!email.trim())        errs.email    = 'Email is required.'
    if (password.length < 6)  errs.password = 'Password must be at least 6 characters.'
    if (password !== confirm)  errs.confirm  = 'Passwords do not match.'
    return errs
  }

  const handleSignup = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setApiError('')
    try {
      await registerUser({ name, email, password })
      // show success message then redirect to login
      setSuccess(true)
      setTimeout(() => {
        onGoLogin()
      }, 2000)
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Signup failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // success state — show before redirecting
  if (success) {
    return (
      <div className="auth-card">
        <div className="auth-logo">QZ</div>
        <div className="success-box">
          <div className="success-icon">✓</div>
          <h2 className="auth-title">Account created!</h2>
          <p className="auth-subtitle">Redirecting you to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-card">
      <div className="auth-logo">QZ</div>
      <h2 className="auth-title">Create account</h2>
      <p className="auth-subtitle">Start building quizzes for free</p>

      {apiError && <p className="api-error">{apiError}</p>}

      <div className="field">
        <label>Full Name</label>
        <div className="input-icon-wrapper">
          <User size={14} className="input-icon" />
          <input type="text" placeholder="John Doe" value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })) }} />
        </div>
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

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
          <input type="password" placeholder="Min. 6 characters" value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })) }} />
        </div>
        {errors.password && <p className="error">{errors.password}</p>}
      </div>

      <div className="field">
        <label>Confirm Password</label>
        <div className="input-icon-wrapper">
          <Lock size={14} className="input-icon" />
          <input type="password" placeholder="Repeat password" value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: undefined })) }} />
        </div>
        {errors.confirm && <p className="error">{errors.confirm}</p>}
      </div>

      <button className="btn-green full-width" onClick={handleSignup} disabled={loading}>
        {loading
          ? 'Creating account...'
          : <><UserPlus size={14} style={{ marginRight: 6 }} />Sign Up</>
        }
      </button>

      <p className="auth-switch">
        Already have an account?{' '}
        <span className="auth-link" onClick={onGoLogin}>Log in</span>
      </p>
    </div>
  )
}

export default Signup