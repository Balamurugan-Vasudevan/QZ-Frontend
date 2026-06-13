import { useState }    from 'react'
import { useAuth }     from './context/AuthContext'
import Login           from './components/auth/Login'
import Signup          from './components/auth/Signup'
import Dashboard       from './components/dashboard/Dashboard'
import QuizBuilder     from './components/quiz/QuizBuilder'
import Navbar          from './components/shared/Navbar'

function App() {
  const { user, logout, loading } = useAuth()
  const [page, setPage]           = useState('dashboard')
  const [editQuiz, setEditQuiz]   = useState(null)
  const [authPage, setAuthPage]   = useState('login')

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="auth-wrapper">
        {authPage === 'login'
          ? <Login onGoSignup={() => setAuthPage('signup')} />
          : <Signup onGoLogin={() => setAuthPage('login')} />
        }
      </div>
    )
  }

  const goToBuilder   = (quiz = null) => { setEditQuiz(quiz); setPage('builder')   }
  const goToDashboard = ()            => { setEditQuiz(null); setPage('dashboard') }

  return (
    <div className="app">
      <Navbar onLogout={logout} onDashboard={goToDashboard} />
      {page === 'dashboard'
        ? <Dashboard onCreateQuiz={() => goToBuilder(null)} onEditQuiz={goToBuilder} />
        : <QuizBuilder editQuiz={editQuiz} onBack={goToDashboard} />
      }
    </div>
  )
}

export default App