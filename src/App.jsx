import { useState } from 'react'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Dashboard from './components/dashboard/Dashboard'
import QuizBuilder from './components/quiz/QuizBuilder'
import Navbar from './components/shared/Navbar'

function App() {
  const [page, setPage]   = useState('login')   // login | signup | dashboard | builder
  const [user, setUser]   = useState(null)
  const [editQuiz, setEditQuiz] = useState(null)

  const handleLogin  = (userData) => { setUser(userData); setPage('dashboard') }
  const handleSignup = (userData) => { setUser(userData); setPage('dashboard') }
  const handleLogout = ()         => { setUser(null);     setPage('login') }

  const goToBuilder  = (quiz = null) => { setEditQuiz(quiz); setPage('builder') }
  const goToDashboard = ()           => { setEditQuiz(null); setPage('dashboard') }

  if (!user) {
    return (
      <div className="auth-wrapper">
        {page === 'login'
          ? <Login onLogin={handleLogin} onGoSignup={() => setPage('signup')} />
          : <Signup onSignup={handleSignup} onGoLogin={() => setPage('login')} />
        }
      </div>
    )
  }

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} onDashboard={goToDashboard} />
      {page === 'dashboard'
        ? <Dashboard user={user} onCreateQuiz={() => goToBuilder(null)} onEditQuiz={goToBuilder} />
        : <QuizBuilder user={user} editQuiz={editQuiz} onBack={goToDashboard} />
      }
    </div>
  )
}

export default App