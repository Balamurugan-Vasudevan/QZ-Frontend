import { useState, useEffect }  from 'react'
import { getQuizzes, deleteQuiz } from '../../api/quizService'
import {
  Plus, Pencil, Trash2, Globe,
  Lock, Link, BookOpen, BarChart2,
  CheckSquare, FileText, Loader
} from 'lucide-react'

const difficultyColor  = { Easy: '#2ec866', Medium: '#f6ad55', Hard: '#e53e3e' }
const visibilityIcon   = {
  public:  <Globe  size={11} />,
  private: <Lock   size={11} />,
  link:    <Link   size={11} />,
}

function Dashboard({ onCreateQuiz, onEditQuiz }) {
  const [quizzes, setQuizzes]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    setLoading(true)
    try {
      const data = await getQuizzes()
      setQuizzes(data)
    } catch (err) {
      setApiError('Failed to load quizzes.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quiz?')) return
    try {
      await deleteQuiz(id)
      setQuizzes((prev) => prev.filter((q) => q.id !== id && q._id !== id))
    } catch {
      setApiError('Failed to delete quiz.')
    }
  }

  const filtered = quizzes.filter((q) => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || q.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Quizzes</h1>
          <p className="dashboard-subtitle">Manage and create your quizzes</p>
        </div>
        <button className="btn-green" onClick={onCreateQuiz}>
          <Plus size={14} style={{ marginRight: 5 }} /> Create Quiz
        </button>
      </div>

      {apiError && <p className="api-error">{apiError}</p>}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <BookOpen size={20} color="#2ec866" />
          <span className="stat-num">{quizzes.length}</span>
          <span className="stat-label">Total Quizzes</span>
        </div>
        <div className="stat-card">
          <CheckSquare size={20} color="#2ec866" />
          <span className="stat-num">{quizzes.filter((q) => q.status === 'published').length}</span>
          <span className="stat-label">Published</span>
        </div>
        <div className="stat-card">
          <FileText size={20} color="#2ec866" />
          <span className="stat-num">{quizzes.filter((q) => q.status === 'draft').length}</span>
          <span className="stat-label">Drafts</span>
        </div>
        <div className="stat-card">
          <BarChart2 size={20} color="#2ec866" />
          <span className="stat-num">{quizzes.reduce((a, q) => a + (q.questions?.length || 0), 0)}</span>
          <span className="stat-label">Total Questions</span>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-filters">
        <input type="text" placeholder="Search quizzes..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="search-input" />
        <div className="filter-tabs">
          {['all', 'published', 'draft'].map((f) => (
            <button key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz list */}
      {loading ? (
        <div className="loading-state">
          <Loader size={24} color="#2ec866" className="spin" />
          <p>Loading quizzes...</p>
        </div>
      ) : (
        <div className="quiz-list">
          {filtered.length === 0 ? (
            <div className="empty-dashboard">
              <BookOpen size={36} color="#ccc" />
              <p>No quizzes found.</p>
              <button className="btn-green" onClick={onCreateQuiz}>
                <Plus size={14} style={{ marginRight: 5 }} />
                Create your first quiz
              </button>
            </div>
          ) : (
            filtered.map((quiz) => (
              <div key={quiz._id || quiz.id} className="quiz-list-card">
                <div className="quiz-list-left">
                  <h3 className="quiz-list-title">{quiz.title}</h3>
                  <div className="quiz-list-meta">
                    <span className="meta-tag">{quiz.category}</span>
                    <span className="meta-tag"
                      style={{ color: difficultyColor[quiz.difficulty], borderColor: difficultyColor[quiz.difficulty] }}>
                      {quiz.difficulty}
                    </span>
                    <span className="meta-tag">{quiz.questions?.length || 0} questions</span>
                    <span className="meta-tag">
                      {visibilityIcon[quiz.visibility]}
                      <span style={{ marginLeft: 4 }}>{quiz.visibility}</span>
                    </span>
                  </div>
                </div>
                <div className="quiz-list-right">
                  <span className={`status-badge ${quiz.status}`}>{quiz.status}</span>
                  <button className="btn-edit" onClick={() => onEditQuiz(quiz)}>
                    <Pencil size={12} style={{ marginRight: 4 }} /> Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(quiz._id || quiz.id)}>
                    <Trash2 size={12} style={{ marginRight: 4 }} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard