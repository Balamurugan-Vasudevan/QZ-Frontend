import { useState } from 'react'

const SAMPLE_QUIZZES = [
  { id: 1, title: 'JavaScript Basics',   category: 'Technology', difficulty: 'Easy',   questions: 5,  visibility: 'public',  status: 'published' },
  { id: 2, title: 'World Geography',     category: 'Geography',  difficulty: 'Medium', questions: 8,  visibility: 'link',    status: 'draft'     },
  { id: 3, title: 'Science Quiz',        category: 'Science',    difficulty: 'Hard',   questions: 10, visibility: 'private', status: 'published' },
]

const difficultyColor = {
  Easy: '#2ec866', Medium: '#f6ad55', Hard: '#e53e3e'
}

function Dashboard({ user, onCreateQuiz, onEditQuiz }) {
  const [quizzes, setQuizzes] = useState(SAMPLE_QUIZZES)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')

  const handleDelete = (id) => setQuizzes((prev) => prev.filter((q) => q.id !== id))

  const filtered = quizzes.filter((q) => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || q.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome, {user.name} 👋</h1>
          <p className="dashboard-subtitle">Manage and create your quizzes</p>
        </div>
        <button className="btn-green" onClick={onCreateQuiz}>+ Create Quiz</button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-num">{quizzes.length}</span>
          <span className="stat-label">Total Quizzes</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{quizzes.filter((q) => q.status === 'published').length}</span>
          <span className="stat-label">Published</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{quizzes.filter((q) => q.status === 'draft').length}</span>
          <span className="stat-label">Drafts</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{quizzes.reduce((a, q) => a + q.questions, 0)}</span>
          <span className="stat-label">Total Questions</span>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-filters">
        <input
          type="text"
          placeholder="Search quizzes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="filter-tabs">
          {['all', 'published', 'draft'].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz list */}
      <div className="quiz-list">
        {filtered.length === 0 ? (
          <div className="empty-dashboard">
            <p>No quizzes found.</p>
            <button className="btn-green" onClick={onCreateQuiz}>Create your first quiz</button>
          </div>
        ) : (
          filtered.map((quiz) => (
            <div key={quiz.id} className="quiz-list-card">
              <div className="quiz-list-left">
                <h3 className="quiz-list-title">{quiz.title}</h3>
                <div className="quiz-list-meta">
                  <span className="meta-tag">{quiz.category}</span>
                  <span
                    className="meta-tag"
                    style={{ color: difficultyColor[quiz.difficulty], borderColor: difficultyColor[quiz.difficulty] }}
                  >
                    {quiz.difficulty}
                  </span>
                  <span className="meta-tag">{quiz.questions} questions</span>
                  <span className="meta-tag">🔗 {quiz.visibility}</span>
                </div>
              </div>
              <div className="quiz-list-right">
                <span className={`status-badge ${quiz.status}`}>
                  {quiz.status}
                </span>
                <button className="btn-edit" onClick={() => onEditQuiz(quiz)}>✏️ Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(quiz.id)}>🗑 Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Dashboard