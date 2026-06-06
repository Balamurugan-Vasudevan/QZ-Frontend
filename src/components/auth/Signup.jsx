import { useState } from 'react'

function Signup({ onSignup, onGoLogin }) {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)

  const validate = () => {
    const errs = {}
    if (!name.trim())               errs.name     = 'Name is required.'
    if (!email.trim())              errs.email    = 'Email is required.'
    if (password.length < 6)        errs.password = 'Password must be at least 6 characters.'
    if (password !== confirm)       errs.confirm  = 'Passwords do not match.'
    return errs
  }

  const handleSignup = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onSignup({ name, email })
    }, 800)
  }

  return (
    <div className="auth-card">
      <div className="auth-logo">QZ</div>
      <h2 className="auth-title">Create account</h2>
      <p className="auth-subtitle">Start building quizzes for free</p>

      <div className="field">
        <label>Full Name</label>
        <input type="text" placeholder="John Doe" value={name}
          onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })) }} />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      <div className="field">
        <label>Email</label>
        <input type="text" placeholder="you@example.com" value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })) }} />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      <div className="field">
        <label>Password</label>
        <input type="password" placeholder="Min. 6 characters" value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })) }} />
        {errors.password && <p className="error">{errors.password}</p>}
      </div>

      <div className="field">
        <label>Confirm Password</label>
        <input type="password" placeholder="Repeat password" value={confirm}
          onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: undefined })) }} />
        {errors.confirm && <p className="error">{errors.confirm}</p>}
      </div>

      <button className="btn-green full-width" onClick={handleSignup} disabled={loading}>
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>

      <p className="auth-switch">
        Already have an account?{' '}
        <span className="auth-link" onClick={onGoLogin}>Log in</span>
      </p>
    </div>
  )
}

export default Signup