import { useState }    from 'react'
import { ArrowLeft, Eye, Pencil, Trash2, Send, Loader } from 'lucide-react'
import { createQuiz, updateQuiz, publishQuiz } from '../../api/quizService'
import QuizSettings    from './QuizSettings'
import QuestionCard    from './QuestionCard'
import QuizPreview     from './QuizPreview'
import QuizSummary     from './QuizSummary'

function QuizBuilder({ editQuiz, onBack }) {
  const [questions, setQuestions]       = useState(editQuiz?.questions?.map((q) => ({
    question:       q.question,
    options:        q.options.map((o) => o.text),
    correctAnswers: q.options.filter((o) => o.isCorrect).map((o) => o.text),
  })) || [])
  const [quizSettings, setQuizSettings] = useState(editQuiz || null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [showPreview, setShowPreview]   = useState(false)
  const [saving, setSaving]             = useState(false)
  const [apiError, setApiError]         = useState('')
  const [published, setPublished]       = useState(editQuiz?.status === 'published')

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

  // format questions for API
  const formatQuestions = () =>
    questions.map((q) => ({
      question: q.question,
      options:  q.options.map((opt) => ({
        text:      opt,
        isCorrect: q.correctAnswers.includes(opt),
      })),
    }))

  const handlePublish = async () => {
    if (!quizSettings || questions.length === 0) return
    setSaving(true)
    setApiError('')
    try {
      const payload = {
        ...quizSettings,
        questions: formatQuestions(),
      }
      if (editQuiz?._id) {
        await updateQuiz(editQuiz._id, payload)
        await publishQuiz(editQuiz._id)
      } else {
        const created = await createQuiz(payload)
        await publishQuiz(created._id || created.id)
      }
      setPublished(true)
      onBack()
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Failed to publish quiz.')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!quizSettings) return
    setSaving(true)
    setApiError('')
    try {
      const payload = { ...quizSettings, questions: formatQuestions() }
      if (editQuiz?._id) {
        await updateQuiz(editQuiz._id, payload)
      } else {
        await createQuiz(payload)
      }
      onBack()
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Failed to save draft.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="qp-builder">
      <div className="builder-topbar">
        <button className="btn-outline" onClick={onBack}>
          <ArrowLeft size={14} style={{ marginRight: 5 }} /> Back
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          {apiError && <p className="api-error">{apiError}</p>}
          <button className="btn-outline"
            disabled={!quizSettings || saving}
            onClick={handleSaveDraft}>
            {saving ? <Loader size={13} className="spin" /> : 'Save Draft'}
          </button>
          <button className="btn-green"
            disabled={!quizSettings || questions.length === 0}
            onClick={() => setShowPreview(true)}>
            <Eye size={14} style={{ marginRight: 5 }} /> Preview
          </button>
        </div>
      </div>

      <div className="page-grid">
        <aside className="left-col">
          <QuizSettings onSave={setQuizSettings} initialData={editQuiz} />
        </aside>

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
                        <button className="btn-edit" onClick={() => handleEdit(i)}>
                          <Pencil size={12} style={{ marginRight: 4 }} /> Edit
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(i)}>
                          <Trash2 size={12} style={{ marginRight: 4 }} /> Delete
                        </button>
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

        <aside className="right-col">
          <QuizSummary quizSettings={quizSettings} questions={questions} />
          <button className="btn-green full-width"
            disabled={!quizSettings || questions.length === 0 || saving}
            onClick={handlePublish}>
            {saving
              ? <><Loader size={13} className="spin" style={{ marginRight: 6 }} />Saving...</>
              : <><Send size={13} style={{ marginRight: 6 }} />Publish Quiz</>
            }
          </button>
        </aside>
      </div>

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