import { LayoutDashboard, PlusCircle } from 'lucide-react'

function Sidebar({ onDashboard, onCreateQuiz }) {
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-item" onClick={onDashboard}>
          <LayoutDashboard size={15} /> Dashboard
        </li>
        <li className="sidebar-item" onClick={onCreateQuiz}>
          <PlusCircle size={15} /> New Quiz
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar