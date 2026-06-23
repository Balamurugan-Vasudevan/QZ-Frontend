import { useState }     from 'react'
import { submitAttempt } from '../../api/attemptService'
import {
  ArrowLeft, ChevronLeft, ChevronRight,
  Send, RotateCcw, Trophy, X
} from 'lucide-react'

function TakeQuiz({ quiz, onBack }) {
  const [current, setCurrent]     = useState(0)
  const [selected, setSelected]   = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  if (!quiz) return null

  const questions = quiz.questions || []
  const q         = questions[current]

  const toggleOption = (opt) => {
    if (submitted) return
    setSelected((prev) => {
      const curr = prev[current] || []
      return {
        ...prev,
        [current]: curr.includes(opt)
          ? curr.filter((o) => o !== opt)
          : [...curr, opt]
      }
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const answers = Object.entries(selected).map(([idx, opts]) => ({
        question_index:   parseInt(idx),
        selected_options: opts,
      }))
      const res = await submitAttempt({
        quiz_id: quiz._id || quiz.id,
        answers,
      })
      setResult(res)
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setCurrent(0)
    setSelected({})
    setSubmitted(false)
    setResult(null)
    setError('')
  }

  // Result screen
  if (submitted && result) {
    return (
      <div className="take-quiz-wrapper">
        <div className="take-quiz-card">
          <div className="result-screen">
            <Trophy size={48} color="#2ec866" />
            <div className="result-score-big">
              {result.score}/{result.total}
            </div>
            <div className="result-percentage">{result.percentage}%</div>

            {result.passed !== null && (
              <div className={`result-pass-badge ${result.passed ? 'passed' : 'failed'}`}>
                {result.passed ? '✓ Passed' : '✗ Failed'}
              </div>
            )}

            {quiz.passing_score && (
              <p className="result-pass-info">
                Passing score: {quiz.passing_score}%
              </p>
            )}

            <div className="result-actions">
              <button className="btn-outline" onClick={handleRetry}>
                <RotateCcw size={13} style={{ marginRight: 5 }} /> Retry
              </button>
              <button className="btn-green" onClick={onBack}>
                <ArrowLeft size={13} style={{ marginRight: 5 }} /> Back to Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="take-quiz-wrapper">
      <div className="take-quiz-card">

        {/* Header */}
        <div className="take-quiz-header">
          <button className="btn-remove" onClick={onBack}>
            <X size={16} />
          </button>
          <div className="take-quiz-title">
            <h2>{quiz.title}</h2>
            <span className="take-quiz-counter">
              {current + 1} / {questions.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="preview-progress">
          <div className="preview-progress-bar"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>

        {/* Question */}
        <div className="take-quiz-body">
          <p className="take-quiz-question">{q.question}</p>
          <p className="hint" style={{ marginBottom: 12 }}>
            Select your answer
          </p>

          {error && <p className="api-error">{error}</p>}

          <div className="preview-options">
            {q.options.map((opt, i) => (
              <div key={i}
                className={`preview-option ${(selected[current] || []).includes(opt.text || opt) ? 'selected' : ''}`}
                onClick={() => toggleOption(opt.text || opt)}>
                <span className="option-letter">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt.text || opt}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="take-quiz-nav">
          <button className="btn-outline"
            onClick={() => setCurrent((p) => p - 1)}
            disabled={current === 0}>
            <ChevronLeft size={14} style={{ marginRight: 4 }} /> Prev
          </button>

          {current < questions.length - 1
            ? <button className="btn-green"
                onClick={() => setCurrent((p) => p + 1)}>
                Next <ChevronRight size={14} style={{ marginLeft: 4 }} />
              </button>
            : <button className="btn-green"
                onClick={handleSubmit} disabled={loading}>
                {loading
                  ? 'Submitting...'
                  : <><Send size={13} style={{ marginRight: 5 }} />Submit</>
                }
              </button>
          }
        </div>

      </div>
    </div>
  )
}

export default TakeQuiz
