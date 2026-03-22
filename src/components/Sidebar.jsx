import { NavLink } from 'react-router-dom'
import './Sidebar.css'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Hockey Tracker</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/teams">Teams</NavLink>
        <NavLink to="/players">Players</NavLink>
        <NavLink to="/games">Games</NavLink>
        <NavLink to="/stats">Stats</NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
