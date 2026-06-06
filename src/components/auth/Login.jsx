import { useState } from 'react'

function Login({ onLogin, onGoSignup }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)

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
    // simulate API call
    setTimeout(() => {
      setLoading(false)
      onLogin({ name: email.split('@')[0], email })
    }, 800)
  }

  return (
    <div className="auth-card">
      <div className="auth-logo">QZ</div>
      <h2 className="auth-title">Welcome back</h2>
      <p className="auth-subtitle">Log in to your Quiz Builder account</p>

      <div className="field">
        <label>Email</label>
        <input
          type="text"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })) }}
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      <div className="field">
        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })) }}
        />
        {errors.password && <p className="error">{errors.password}</p>}
      </div>

      <button className="btn-green full-width" onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>

      <p className="auth-switch">
        Don't have an account?{' '}
        <span className="auth-link" onClick={onGoSignup}>Sign up</span>
      </p>
    </div>
  )
}

export default Login