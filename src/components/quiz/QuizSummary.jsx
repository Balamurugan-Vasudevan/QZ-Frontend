const difficultyColor = {
  Easy: '#2ec866', Medium: '#f6ad55', Hard: '#e53e3e'
}

function QuizSummary({ quizSettings, questions }) {
  const multiAnswer  = questions.filter((q) => q.correctAnswers.length > 1).length
  const singleAnswer = questions.filter((q) => q.correctAnswers.length === 1).length

  return (
    <div className="panel">
      <div className="panel-header"><h3>Summary</h3></div>
      <div className="panel-body">

        <div className="stat-row">
          <span>Total questions</span>
          <strong>{questions.length}</strong>
        </div>
        <div className="stat-row">
          <span>Multi-answer Qs</span>
          <strong>{multiAnswer}</strong>
        </div>
        <div className="stat-row">
          <span>Single-answer Qs</span>
          <strong>{singleAnswer}</strong>
        </div>
        <div className="stat-row">
          <span>Category</span>
          <strong>{quizSettings?.category || '—'}</strong>
        </div>
        <div className="stat-row">
          <span>Difficulty</span>
          <strong style={{ color: difficultyColor[quizSettings?.difficulty] || '#222' }}>
            {quizSettings?.difficulty || '—'}
          </strong>
        </div>
        <div className="stat-row">
          <span>Time Limit</span>
          <strong>{quizSettings?.timeLimit ? `${quizSettings.timeLimit} min` : '—'}</strong>
        </div>
        <div className="stat-row">
          <span>Passing Score</span>
          <strong>{quizSettings?.passingScore ? `${quizSettings.passingScore}%` : '—'}</strong>
        </div>
        <div className="stat-row">
          <span>Max Attempts</span>
          <strong>{quizSettings?.maxAttempts || '—'}</strong>
        </div>
        <div className="stat-row">
          <span>Visibility</span>
          <strong style={{ textTransform: 'capitalize' }}>
            {quizSettings?.visibility || '—'}
          </strong>
        </div>

        <div className="divider" />

        <div className="stat-row">
          <span>Status</span>
          <strong className="status-green">
            {quizSettings && questions.length > 0 ? 'Ready' : 'Draft'}
          </strong>
        </div>

      </div>
    </div>
  )
}

export default QuizSummary