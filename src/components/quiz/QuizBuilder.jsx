import { useState } from 'react'
import QuizSettings from './QuizSettings'
import QuestionCard from './QuestionCard'
import QuizPreview from './QuizPreview'
import QuizSummary from './QuizSummary'

function QuizBuilder({ user, editQuiz, onBack }) {
  const [questions, setQuestions]       = useState(editQuiz?.questions || [])
  const [quizSettings, setQuizSettings] = useState(editQuiz || null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [showPreview, setShowPreview]   = useState(false)

  const handleAddQuestion = (q) => {
    if (editingIndex !== null) {
      const updated = [...questions]
      updated[editingIndex] = q
      setQuestions(updated)
      setEditingIndex(null)
    } else {
      setQuestions((prev) => [...prev, q])
    }
  }

  const handleEdit   = (i) => {
    setEditingIndex(i)
    document.getElementById('question-form')?.scrollIntoView({ behavior: 'smooth' })
  }
  const handleDelete = (i) => {
    setQuestions((prev) => prev.filter((_, idx) => idx !== i))
    if (editingIndex === i) setEditingIndex(null)
  }
  const handleCancelEdit = () => setEditingIndex(null)

  return (
    <div className="qp-builder">

      {/* Back + Preview bar */}
      <div className="builder-topbar">
        <button className="btn-outline" onClick={onBack}>← Back to Dashboard</button>
        <button
          className="btn-green"
          disabled={!quizSettings || questions.length === 0}
          onClick={() => setShowPreview(true)}
        >
          👁 Preview Quiz
        </button>
      </div>

      <div className="page-grid">

        {/* Left — settings */}
        <aside className="left-col">
          <QuizSettings onSave={setQuizSettings} initialData={editQuiz} />
        </aside>

        {/* Middle — questions */}
        <main className="mid-col">
          <div className="panel">
            <div className="panel-header space-between">
              <h3>Questions</h3>
              <span className="badge">{questions.length} added</span>
            </div>
            <div className="questions-area">
              {questions.length === 0 ? (
                <p className="empty-state">No questions yet. Add one below.</p>
              ) : (
                questions.map((q, i) => (
                  <div key={i}
                    className={`q-card ${editingIndex === i ? 'q-card-editing' : ''}`}>
                    <div className="q-card-header">
                      <span>Q{i + 1}</span>
                      <div className="q-card-actions">
                        <span className="q-badge">{q.correctAnswers.length} correct</span>
                        <button className="btn-edit"   onClick={() => handleEdit(i)}>✏️ Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(i)}>🗑 Delete</button>
                      </div>
                    </div>
                    <p className="q-text">{q.question}</p>
                    <div className="options-grid">
                      {q.options.map((opt, j) => (
                        <div key={j}
                          className={`opt ${q.correctAnswers.includes(opt) ? 'correct' : ''}`}>
                          {q.correctAnswers.includes(opt) ? '✓ ' : ''}{opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div id="question-form">
            <QuestionCard
              questionNumber={editingIndex !== null ? editingIndex + 1 : questions.length + 1}
              editData={editingIndex !== null ? questions[editingIndex] : null}
              isEditing={editingIndex !== null}
              onSave={handleAddQuestion}
              onCancelEdit={handleCancelEdit}
            />
          </div>
        </main>

        {/* Right — summary */}
        <aside className="right-col">
          <QuizSummary quizSettings={quizSettings} questions={questions} />
          <button
            className="btn-green full-width"
            disabled={!quizSettings || questions.length === 0}
          >
            Publish Quiz
          </button>
        </aside>

      </div>

      {/* Preview modal */}
      {showPreview && (
        <QuizPreview
          quizSettings={quizSettings}
          questions={questions}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}

export default QuizBuilder