import { useState } from 'react'

function QuizPreview({ quizSettings, questions, onClose }) {
  const [current, setCurrent]   = useState(0)
  const [selected, setSelected] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const q = questions[current]

  const toggleOption = (opt) => {
    if (submitted) return
    setSelected((prev) => {
      const curr = prev[current] || []
      return {
        ...prev,
        [current]: curr.includes(opt) ? curr.filter((o) => o !== opt) : [...curr, opt]
      }
    })
  }

  const handleSubmit = () => setSubmitted(true)

  const score = submitted
    ? questions.reduce((acc, q, i) => {
        const sel = selected[i] || []
        const correct = q.correctAnswers
        const isRight =
          sel.length === correct.length && correct.every((c) => sel.includes(c))
        return isRight ? acc + 1 : acc
      }, 0)
    : 0

  return (
    <div className="preview-overlay">
      <div className="preview-modal">
        <div className="preview-header">
          <h2>{quizSettings?.title || 'Quiz Preview'}</h2>
          <button className="btn-remove" onClick={onClose}>✕</button>
        </div>

        {!submitted ? (
          <>
            <div className="preview-progress">
              <div className="preview-progress-bar"
                style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
            </div>
            <p className="preview-counter">
              Question {current + 1} of {questions.length}
            </p>
            <p className="preview-question">{q.question}</p>
            <p className="hint" style={{ marginBottom: 10 }}>
              {q.correctAnswers.length > 1 ? 'Select all correct answers' : 'Select one answer'}
            </p>
            <div className="preview-options">
              {q.options.map((opt, i) => (
                <div key={i}
                  className={`preview-option ${(selected[current] || []).includes(opt) ? 'selected' : ''}`}
                  onClick={() => toggleOption(opt)}>
                  {opt}
                </div>
              ))}
            </div>
            <div className="preview-nav">
              <button className="btn-outline"
                onClick={() => setCurrent((p) => p - 1)} disabled={current === 0}>
                ← Prev
              </button>
              {current < questions.length - 1
                ? <button className="btn-green" onClick={() => setCurrent((p) => p + 1)}>
                    Next →
                  </button>
                : <button className="btn-green" onClick={handleSubmit}>Submit</button>
              }
            </div>
          </>
        ) : (
          <div className="preview-result">
            <div className="result-score">
              {score}/{questions.length}
            </div>
            <p className="result-label">
              {score === questions.length
                ? '🎉 Perfect score!'
                : score >= questions.length / 2
                ? '👍 Good job!'
                : '📚 Keep practicing!'}
            </p>
            {quizSettings?.passingScore && (
              <p className="result-pass">
                Passing score: {quizSettings.passingScore}% —{' '}
                <strong style={{ color: (score / questions.length) * 100 >= quizSettings.passingScore ? '#2ec866' : '#e53e3e' }}>
                  {(score / questions.length) * 100 >= quizSettings.passingScore ? 'Passed ✓' : 'Failed ✗'}
                </strong>
              </p>
            )}
            <button className="btn-green" style={{ marginTop: 16 }} onClick={onClose}>
              Close Preview
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizPreview