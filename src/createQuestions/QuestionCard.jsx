import { useState, useEffect } from "react"

function QuestionCard({ questionNumber, editData, isEditing, onSave, onCancelEdit }) {
  const [question, setQuestion] = useState("")
  const [options, setOptions]   = useState([
    { id: 1, text: "" }, { id: 2, text: "" },
    { id: 3, text: "" }, { id: 4, text: "" },
  ])
  const [correctIds, setCorrectIds] = useState([])
  const [errors, setErrors]         = useState({})
  const [nextId, setNextId]         = useState(5)

  // pre-fill form when editing
  useEffect(() => {
    if (editData) {
      setQuestion(editData.question)
      const mapped = editData.options.map((text, i) => ({ id: i + 1, text }))
      setOptions(mapped)
      setCorrectIds(
        mapped
          .filter((o) => editData.correctAnswers.includes(o.text))
          .map((o) => o.id)
      )
      setNextId(editData.options.length + 1)
      setErrors({})
    } else {
      setQuestion("")
      setOptions([
        { id: 1, text: "" }, { id: 2, text: "" },
        { id: 3, text: "" }, { id: 4, text: "" },
      ])
      setCorrectIds([])
      setNextId(5)
      setErrors({})
    }
  }, [editData])

  const toggleCorrect = (id) =>
    setCorrectIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )

  const updateOption = (id, value) =>
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text: value } : o)))

  const addOption = () => {
    setOptions((prev) => [...prev, { id: nextId, text: "" }])
    setNextId((prev) => prev + 1)
  }

  const removeOption = (id) => {
    setOptions((prev) => prev.filter((o) => o.id !== id))
    setCorrectIds((prev) => prev.filter((i) => i !== id))
  }

  const validate = () => {
    const errs = {}
    if (!question.trim())        errs.question = "Question is required."
    if (options.length < 2)      errs.options  = "At least 2 options required."
    else if (options.some((o) => !o.text.trim()))
                                 errs.options  = "All options must be filled."
    if (correctIds.length === 0) errs.correct  = "Select at least one correct answer."
    return errs
  }

  const handleSave = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    onSave?.({
      question,
      options: options.map((o) => o.text),
      correctAnswers: options
        .filter((o) => correctIds.includes(o.id))
        .map((o) => o.text),
    })
  }

  return (
    <div className={`panel ${isEditing ? "panel-editing" : ""}`}>
      <div className="panel-header space-between">
        <h3>
          {isEditing ? `Editing Q${questionNumber}` : `New Question — Q${questionNumber}`}
        </h3>
        {isEditing && <span className="editing-badge">Editing</span>}
      </div>
      <div className="panel-body">

        <div className="field">
          <label>Question text</label>
          <input
            type="text"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value)
              setErrors((p) => ({ ...p, question: undefined }))
            }}
          />
          {errors.question && <p className="error">{errors.question}</p>}
        </div>

        <div className="field">
          <label>
            Options <span className="hint">(check all correct answers)</span>
          </label>
          {options.map((opt, index) => (
            <div key={opt.id} className="option-row">
              <input
                type="checkbox"
                checked={correctIds.includes(opt.id)}
                onChange={() => {
                  toggleCorrect(opt.id)
                  setErrors((p) => ({ ...p, correct: undefined }))
                }}
              />
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={opt.text}
                onChange={(e) => {
                  updateOption(opt.id, e.target.value)
                  setErrors((p) => ({ ...p, options: undefined }))
                }}
              />
              {options.length > 2 && (
                <button
                  className="btn-remove"
                  onClick={() => removeOption(opt.id)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {errors.options && <p className="error">{errors.options}</p>}
          {errors.correct && <p className="error">{errors.correct}</p>}
        </div>

        <div className="btn-row">
          <button className="btn-outline" onClick={addOption}>
            + Add Option
          </button>
          {isEditing && (
            <button className="btn-cancel" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
          <button className="btn-green" onClick={handleSave}>
            {isEditing ? "Update Question" : "Save Question"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default QuestionCard