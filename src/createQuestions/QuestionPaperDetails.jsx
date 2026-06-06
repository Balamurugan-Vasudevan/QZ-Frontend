import { useState } from 'react'

function QuestionPaperDetails({ onSave }) {
  const [title, setTitle]       = useState('')
  const [description, setDesc]  = useState('')
  const [standard, setStandard] = useState('')
  const [subject, setSubject]   = useState('')
  const [examDate, setExamDate] = useState('')
  const [examTime, setExamTime] = useState('')
  const [duration, setDuration] = useState('')
  const [errors, setErrors]     = useState({})

  const clearError = (f) => setErrors((p) => ({ ...p, [f]: undefined }))

  const validate = () => {
    const errs = {}
    if (!title.trim())                      errs.title    = 'Title is required.'
    if (!standard)                          errs.standard = 'Please select a standard.'
    if (!subject)                           errs.subject  = 'Please select a subject.'
    if (!examDate)                          errs.examDate = 'Exam date is required.'
    if (!examTime)                          errs.examTime = 'Exam time is required.'
    if (!duration || Number(duration) <= 0) errs.duration = 'Enter a valid duration (> 0).'
    return errs
  }

  const handleSave = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    onSave?.({ title, description, standard, subject, examDate, examTime, duration: Number(duration) })
  }

  const handleReset = () => {
    setTitle(''); setDesc(''); setStandard(''); setSubject('')
    setExamDate(''); setExamTime(''); setDuration(''); setErrors({})
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Paper Details</h3>
      </div>
      <div className="panel-body">

        {/* Basic Info */}
        <span className="section-label">Basic Info</span>

        <div className="field">
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter paper title"
            value={title}
            onChange={(e) => { setTitle(e.target.value); clearError('title') }}
          />
          {errors.title && <p className="error">{errors.title}</p>}
        </div>

        <div className="field">
          <label>Description</label>
          <textarea
            placeholder="Enter a short description (optional)"
            value={description}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div className="section-divider" />

        {/* Classification */}
        <span className="section-label">Classification</span>

        <div className="field">
          <label>Standard</label>
          <select
            value={standard}
            onChange={(e) => { setStandard(e.target.value); clearError('standard') }}
          >
            <option value="">Select Standard</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          {errors.standard && <p className="error">{errors.standard}</p>}
        </div>

        <div className="field">
          <label>Subject</label>
          <select
            value={subject}
            onChange={(e) => { setSubject(e.target.value); clearError('subject') }}
          >
            <option value="">Select Subject</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
            <option value="Geography">Geography</option>
          </select>
          {errors.subject && <p className="error">{errors.subject}</p>}
        </div>

        <div className="section-divider" />

        {/* Schedule */}
        <span className="section-label">Schedule</span>

        <div className="date-time-row">
          <div className="field">
            <label>Exam Date</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => { setExamDate(e.target.value); clearError('examDate') }}
            />
            {errors.examDate && <p className="error">{errors.examDate}</p>}
          </div>
          <div className="field">
            <label>Exam Time</label>
            <input
              type="time"
              value={examTime}
              onChange={(e) => { setExamTime(e.target.value); clearError('examTime') }}
            />
            {errors.examTime && <p className="error">{errors.examTime}</p>}
          </div>
        </div>

        <div className="field">
          <label>Duration (minutes)</label>
          <input
            type="number"
            placeholder="e.g. 90"
            min={1}
            value={duration}
            onChange={(e) => { setDuration(e.target.value); clearError('duration') }}
          />
          {errors.duration && <p className="error">{errors.duration}</p>}
        </div>

        <div className="btn-row">
          <button className="btn-outline" onClick={handleReset}>Reset</button>
          <button className="btn-green" onClick={handleSave}>Save Details</button>
        </div>

      </div>
    </div>
  )
}

export default QuestionPaperDetails