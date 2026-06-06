function Sidebar({ onDashboard, onCreateQuiz }) {
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-item" onClick={onDashboard}>
          <span>🏠</span> Dashboard
        </li>
        <li className="sidebar-item" onClick={onCreateQuiz}>
          <span>➕</span> New Quiz
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar