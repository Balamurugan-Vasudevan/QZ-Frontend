import { useState }  from 'react'
import { useAuth }   from '../../context/AuthContext'
import { LogOut }    from 'lucide-react'
import ProfileModal  from '../profile/ProfileModal'

function Navbar({ onLogout, onDashboard }) {
  const { user }            = useAuth()
  const [showProfile, setShowProfile] = useState(false)

  return (
    <>
      <nav className="hr-navbar">
        <span className="hr-logo" onClick={onDashboard}>QZ</span>
        <span className="hr-title" onClick={onDashboard}>Quiz Builder</span>

        <div className="navbar-right">
          {/* Profile avatar button */}
          <button
            className="navbar-avatar"
            onClick={() => setShowProfile(true)}
            title="View profile"
          >
            {user?.name?.charAt(0).toUpperCase()}
          </button>

          {/* User name */}
          <span className="navbar-user">{user?.name}</span>

          {/* Logout */}
          <button className="btn-logout" onClick={onLogout}>
            <LogOut size={13} style={{ marginRight: 5 }} />
            Log out
          </button>
        </div>
      </nav>

      {/* Profile modal */}
      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} />
      )}
    </>
  )
}

export default Navbar