import { useState, useEffect } from 'react'
import { getPublicQuizzes }    from '../../api/attemptService'
import { getMyAttempts }       from '../../api/attemptService'
import {
  BookOpen, Clock, Trophy,
  ChevronRight, Loader, Search,
  BarChart2
} from 'lucide-react'

const difficultyColor = {
  Easy: '#2ec866', Medium: '#f6ad55', Hard: '#e53e3e'
}

function StudentDashboard({ onTakeQuiz }) {
  const [quizzes, setQuizzes]   = useState([])
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [tab, setTab]           = useState('quizzes')  // quizzes | attempts

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [q, a] = await Promise.all([getPublicQuizzes(), getMyAttempts()])
      setQuizzes(q)
      setAttempts(a)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = quizzes.filter((q) => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || q.difficulty.toLowerCase() === filter
    return matchSearch && matchFilter
  })

  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((a, b) => a + b.percentage, 0) / attempts.length)
    : 0

  return (
    <div className="dashboard">

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <BookOpen size={20} color="#2ec866" />
          <span className="stat-num">{quizzes.length}</span>
          <span className="stat-label">Available Quizzes</span>
        </div>
        <div className="stat-card">
          <BarChart2 size={20} color="#2ec866" />
          <span className="stat-num">{attempts.length}</span>
          <span className="stat-label">Attempts</span>
        </div>
        <div className="stat-card">
          <Trophy size={20} color="#2ec866" />
          <span className="stat-num">{avgScore}%</span>
          <span className="stat-label">Avg Score</span>
        </div>
        <div className="stat-card">
          <Clock size={20} color="#2ec866" />
          <span className="stat-num">
            {attempts.filter((a) => a.passed === true).length}
          </span>
          <span className="stat-label">Passed</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="student-tabs">
        <button
          className={`student-tab ${tab === 'quizzes' ? 'active' : ''}`}
          onClick={() => setTab('quizzes')}
        >
          <BookOpen size={14} style={{ marginRight: 5 }} />
          Available Quizzes
        </button>
        <button
          className={`student-tab ${tab === 'attempts' ? 'active' : ''}`}
          onClick={() => setTab('attempts')}
        >
          <Trophy size={14} style={{ marginRight: 5 }} />
          My Attempts
        </button>
      </div>

      {/* Quizzes Tab */}
      {tab === 'quizzes' && (
        <>
          <div className="dashboard-filters">
            <div className="input-icon-wrapper" style={{ flex: 1 }}>
              <Search size={14} className="input-icon" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
                style={{ paddingLeft: 32 }}
              />
            </div>
            <div className="filter-tabs">
              {['all', 'easy', 'medium', 'hard'].map((f) => (
                <button key={f}
                  className={`filter-tab ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

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
                  <p>No quizzes available.</p>
                </div>
              ) : (
                filtered.map((quiz) => {
                  const attempted = attempts.find((a) => a.quiz_id === (quiz._id || quiz.id))
                  return (
                    <div key={quiz._id || quiz.id} className="quiz-list-card">
                      <div className="quiz-list-left">
                        <h3 className="quiz-list-title">{quiz.title}</h3>
                        {quiz.description && (
                          <p className="quiz-description">{quiz.description}</p>
                        )}
                        <div className="quiz-list-meta">
                          <span className="meta-tag">{quiz.category}</span>
                          <span className="meta-tag"
                            style={{ color: difficultyColor[quiz.difficulty], borderColor: difficultyColor[quiz.difficulty] }}>
                            {quiz.difficulty}
                          </span>
                          <span className="meta-tag">
                            <BookOpen size={10} style={{ marginRight: 3 }} />
                            {quiz.questions?.length || 0} questions
                          </span>
                          {quiz.time_limit && (
                            <span className="meta-tag">
                              <Clock size={10} style={{ marginRight: 3 }} />
                              {quiz.time_limit} min
                            </span>
                          )}
                          {quiz.passing_score && (
                            <span className="meta-tag">
                              <Trophy size={10} style={{ marginRight: 3 }} />
                              Pass: {quiz.passing_score}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="quiz-list-right">
                        {attempted && (
                          <span className={`status-badge ${attempted.passed ? 'published' : 'draft'}`}>
                            {attempted.percentage}% — {attempted.passed === true ? 'Passed' : attempted.passed === false ? 'Failed' : 'Attempted'}
                          </span>
                        )}
                        <button className="btn-green" onClick={() => onTakeQuiz(quiz)}>
                          {attempted ? 'Retake' : 'Start Quiz'}
                          <ChevronRight size={14} style={{ marginLeft: 4 }} />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </>
      )}

      {/* Attempts Tab */}
      {tab === 'attempts' && (
        <div className="quiz-list">
          {attempts.length === 0 ? (
            <div className="empty-dashboard">
              <Trophy size={36} color="#ccc" />
              <p>No attempts yet. Take a quiz!</p>
            </div>
          ) : (
            attempts.map((attempt) => (
              <div key={attempt._id || attempt.id} className="quiz-list-card">
                <div className="quiz-list-left">
                  <h3 className="quiz-list-title">{attempt.quiz_title}</h3>
                  <div className="quiz-list-meta">
                    <span className="meta-tag">
                      Score: {attempt.score}/{attempt.total}
                    </span>
                    <span className="meta-tag">{attempt.percentage}%</span>
                    <span className="meta-tag">
                      {new Date(attempt.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="quiz-list-right">
                  {attempt.passed !== null && (
                    <span className={`status-badge ${attempt.passed ? 'published' : 'draft'}`}>
                      {attempt.passed ? '✓ Passed' : '✗ Failed'}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  )
}

export default StudentDashboard