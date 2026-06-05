import { useState } from "react"
import QuestionPaperDetails from "./QuestionPaperDetails"
import QuestionCard from "./QuestionCard"
import "../styles/styles.css"

function QuestionPaperBuilder() {
  const [questions, setQuestions]       = useState([])
  const [paperDetails, setPaperDetails] = useState(null)

  const handleAddQuestion = (q) => setQuestions((prev) => [...prev, q])

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

        {/* Middle — questions list + new question form */}
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
                  <div key={i} className="q-card">
                    <div className="q-card-header">
                      <span>Q{i + 1}</span>
                      <span className="q-badge">{q.correctAnswers.length} correct</span>
                    </div>
                    <p className="q-text">{q.question}</p>
                    <div className="options-grid">
                      {q.options.map((opt, j) => (
                        <div key={j} className={`opt ${q.correctAnswers.includes(opt) ? "correct" : ""}`}>
                          {q.correctAnswers.includes(opt) ? "✓ " : ""}{opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <QuestionCard
            questionNumber={questions.length + 1}
            onSave={handleAddQuestion}
          />
        </main>

        {/* Right — summary */}
        <aside className="right-col">
          <div className="panel">
            <div className="panel-header"><h3>Summary</h3></div>
            <div className="panel-body">
              <div className="stat-row"><span>Total questions</span><strong>{questions.length}</strong></div>
              <div className="stat-row"><span>Multi-answer Qs</span><strong>{questions.filter((q) => q.correctAnswers.length > 1).length}</strong></div>
              <div className="stat-row"><span>Single-answer Qs</span><strong>{questions.filter((q) => q.correctAnswers.length === 1).length}</strong></div>
              <div className="stat-row"><span>Duration</span><strong>{paperDetails?.duration ? `${paperDetails.duration} min` : "—"}</strong></div>
              <div className="stat-row"><span>Subject</span><strong>{paperDetails?.subject || "—"}</strong></div>
              <div className="stat-row"><span>Standard</span><strong>{paperDetails?.standard ? `Grade ${paperDetails.standard}` : "—"}</strong></div>
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