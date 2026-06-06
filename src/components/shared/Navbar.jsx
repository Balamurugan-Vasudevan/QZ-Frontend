function Navbar({ user, onLogout, onDashboard }) {
  return (
    <nav className="hr-navbar">
      <span className="hr-logo" onClick={onDashboard} style={{ cursor: 'pointer' }}>QZ</span>
      <span className="hr-title" onClick={onDashboard} style={{ cursor: 'pointer' }}>
        Quiz Builder
      </span>
      <div className="navbar-right">
        <span className="navbar-user">👤 {user.name}</span>
        <button className="btn-logout" onClick={onLogout}>Log out</button>
      </div>
    </nav>
  )
}

export default Navbar