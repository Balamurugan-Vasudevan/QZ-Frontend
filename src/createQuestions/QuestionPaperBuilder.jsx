import { useState } from "react"
import QuestionPaperDetails from "./QuestionPaperDetails"
import QuestionCard from "./QuestionCard"
import "../styles/styles.css"

function QuestionPaperBuilder() {
  const [questions, setQuestions]       = useState([])
  const [paperDetails, setPaperDetails] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)

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

  const handleEdit = (index) => {
    setEditingIndex(index)
    document.getElementById("question-form")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleDelete = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
    if (editingIndex === index) setEditingIndex(null)
  }

  const handleCancelEdit = () => setEditingIndex(null)

  return (
    <div className="qp-builder">

      <nav className="hr-navbar">
        <span className="hr-logo">HR</span>
        <span className="hr-title">Question Paper Builder</span>
      </nav>

      <div className="page-grid">

        {/* Left — paper details */}
        <aside className="left-col">
          <QuestionPaperDetails onSave={(data) => setPaperDetails(data)} />
        </aside>

        {/* Middle — questions list + form */}
        <main className="mid-col">

          {/* Saved questions */}
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
                  <div
                    key={i}
                    className={`q-card ${editingIndex === i ? "q-card-editing" : ""}`}
                  >
                    <div className="q-card-header">
                      <span>Q{i + 1}</span>
                      <div className="q-card-actions">
                        <span className="q-badge">
                          {q.correctAnswers.length} correct
                        </span>
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(i)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(i)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                    <p className="q-text">{q.question}</p>
                    <div className="options-grid">
                      {q.options.map((opt, j) => (
                        <div
                          key={j}
                          className={`opt ${q.correctAnswers.includes(opt) ? "correct" : ""}`}
                        >
                          {q.correctAnswers.includes(opt) ? "✓ " : ""}{opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Question form */}
          <div id="question-form">
            <QuestionCard
              questionNumber={
                editingIndex !== null ? editingIndex + 1 : questions.length + 1
              }
              editData={editingIndex !== null ? questions[editingIndex] : null}
              isEditing={editingIndex !== null}
              onSave={handleAddQuestion}
              onCancelEdit={handleCancelEdit}
            />
          </div>

        </main>

        {/* Right — summary */}
        <aside className="right-col">
          <div className="panel">
            <div className="panel-header"><h3>Summary</h3></div>
            <div className="panel-body">
              <div className="stat-row">
                <span>Total questions</span>
                <strong>{questions.length}</strong>
              </div>
              <div className="stat-row">
                <span>Multi-answer Qs</span>
                <strong>{questions.filter((q) => q.correctAnswers.length > 1).length}</strong>
              </div>
              <div className="stat-row">
                <span>Single-answer Qs</span>
                <strong>{questions.filter((q) => q.correctAnswers.length === 1).length}</strong>
              </div>
              <div className="stat-row">
                <span>Duration</span>
                <strong>{paperDetails?.duration ? `${paperDetails.duration} min` : "—"}</strong>
              </div>
              <div className="stat-row">
                <span>Subject</span>
                <strong>{paperDetails?.subject || "—"}</strong>
              </div>
              <div className="stat-row">
                <span>Standard</span>
                <strong>{paperDetails?.standard ? `Grade ${paperDetails.standard}` : "—"}</strong>
              </div>
              <div className="divider" />
              <div className="stat-row">
                <span>Status</span>
                <strong className="status-green">
                  {paperDetails && questions.length > 0 ? "Ready" : "Draft"}
                </strong>
              </div>
              <button
                className="btn-green full-width"
                disabled={!paperDetails || questions.length === 0}
              >
                Publish paper
              </button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}

export default QuestionPaperBuilder