import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, LogOut, User } from 'lucide-react'

function Navbar({ onLogout, onDashboard }) {
  const { user } = useAuth()

  return (
    <nav className="hr-navbar">
      <span className="hr-logo" onClick={onDashboard}>QZ</span>
      <span className="hr-title" onClick={onDashboard}>Quiz Builder</span>
      <div className="navbar-right">
        <span className="navbar-user">
          <User size={14} style={{ marginRight: 5 }} />
          {user?.name}
        </span>
        <button className="btn-logout" onClick={onLogout}>
          <LogOut size={13} style={{ marginRight: 5 }} />
          Log out
        </button>
      </div>
    </nav>
  )
}

export default Navbar