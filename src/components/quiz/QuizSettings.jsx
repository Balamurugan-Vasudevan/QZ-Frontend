import { useState } from 'react'

const CATEGORIES = [
  'General Knowledge', 'Technology', 'Science', 'Mathematics',
  'History', 'Geography', 'Sports', 'Entertainment',
  'Business', 'Health', 'Language', 'Custom'
]

function QuizSettings({ onSave, initialData }) {
  const [title, setTitle]           = useState(initialData?.title || '')
  const [description, setDesc]      = useState(initialData?.description || '')
  const [category, setCategory]     = useState(initialData?.category || '')
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || '')
  const [visibility, setVisibility] = useState(initialData?.visibility || 'public')
  const [timeLimit, setTimeLimit]   = useState(initialData?.timeLimit || '')
  const [passingScore, setPass]     = useState(initialData?.passingScore || '')
  const [maxAttempts, setMax]       = useState(initialData?.maxAttempts || '')
  const [errors, setErrors]         = useState({})
  const [saved, setSaved]           = useState(false)

  const clearError = (f) => setErrors((p) => ({ ...p, [f]: undefined }))

  const validate = () => {
    const errs = {}
    if (!title.trim())  errs.title      = 'Quiz title is required.'
    if (!category)      errs.category   = 'Please select a category.'
    if (!difficulty)    errs.difficulty = 'Please select a difficulty.'
    if (passingScore && (Number(passingScore) < 0 || Number(passingScore) > 100))
                        errs.passingScore = 'Must be between 0 and 100.'
    return errs
  }

  const handleSave = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onSave?.({
      title, description, category, difficulty, visibility,
      timeLimit:    timeLimit    ? Number(timeLimit)    : null,
      passingScore: passingScore ? Number(passingScore) : null,
      maxAttempts:  maxAttempts  ? Number(maxAttempts)  : null,
    })
  }

  const handleReset = () => {
    setTitle(''); setDesc(''); setCategory(''); setDifficulty('')
    setVisibility('public'); setTimeLimit(''); setPass(''); setMax('')
    setErrors({}); setSaved(false)
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Quiz Settings</h3>
      </div>
      <div className="panel-body">

        <span className="section-label">Basic Info</span>

        <div className="field">
          <label>Quiz Title</label>
          <input type="text" placeholder="e.g. JavaScript Basics"
            value={title} onChange={(e) => { setTitle(e.target.value); clearError('title') }} />
          {errors.title && <p className="error">{errors.title}</p>}
        </div>

        <div className="field">
          <label>Description</label>
          <textarea placeholder="What is this quiz about? (optional)"
            value={description} onChange={(e) => setDesc(e.target.value)} />
        </div>

        <div className="section-divider" />
        <span className="section-label">Classification</span>

        <div className="field">
          <label>Category</label>
          <select value={category}
            onChange={(e) => { setCategory(e.target.value); clearError('category') }}>
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="error">{errors.category}</p>}
        </div>

        <div className="field">
          <label>Difficulty</label>
          <div className="difficulty-row">
            {['Easy', 'Medium', 'Hard'].map((d) => (
              <button key={d}
                className={`difficulty-btn ${difficulty === d ? `difficulty-${d.toLowerCase()} active` : ''}`}
                onClick={() => { setDifficulty(d); clearError('difficulty') }}>
                {d}
              </button>
            ))}
          </div>
          {errors.difficulty && <p className="error">{errors.difficulty}</p>}
        </div>

        <div className="section-divider" />
        <span className="section-label">Visibility</span>

        <div className="visibility-row">
          {[
            { value: 'public',  label: '🌐 Public',    desc: 'Anyone can find it'    },
            { value: 'private', label: '🔒 Private',   desc: 'Only you'              },
            { value: 'link',    label: '🔗 Link only', desc: 'Anyone with the link'  },
          ].map((v) => (
            <div key={v.value}
              className={`visibility-card ${visibility === v.value ? 'active' : ''}`}
              onClick={() => setVisibility(v.value)}>
              <span className="visibility-label">{v.label}</span>
              <span className="visibility-desc">{v.desc}</span>
            </div>
          ))}
        </div>

        <div className="section-divider" />
        <span className="section-label">Rules</span>

        <div className="field">
          <label>Time Limit (minutes) <span className="hint">— optional</span></label>
          <input type="number" placeholder="e.g. 30" min={1} value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)} />
        </div>

        <div className="date-time-row">
          <div className="field">
            <label>Passing Score (%)</label>
            <input type="number" placeholder="e.g. 70" min={0} max={100}
              value={passingScore}
              onChange={(e) => { setPass(e.target.value); clearError('passingScore') }} />
            {errors.passingScore && <p className="error">{errors.passingScore}</p>}
          </div>
          <div className="field">
            <label>Max Attempts</label>
            <input type="number" placeholder="e.g. 3" min={1}
              value={maxAttempts} onChange={(e) => setMax(e.target.value)} />
          </div>
        </div>

        <div className="btn-row">
          <button className="btn-outline" onClick={handleReset}>Reset</button>
          <button className="btn-green" onClick={handleSave}>
            {saved ? '✓ Saved!' : 'Save Settings'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default QuizSettings