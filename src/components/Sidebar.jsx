import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Sidebar.css'

function Sidebar() {
  const { user, signOut } = useAuth()

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Hockey Tracker</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/teams">Teams</NavLink>
        <NavLink to="/schedule">Schedule</NavLink>
        <NavLink to="/standings">Standings</NavLink>
        <NavLink to="/stats">Stats</NavLink>
      </nav>
      <div className="sidebar-user">
        <img
          className="sidebar-avatar"
          src={user?.user_metadata?.avatar_url}
          alt=""
        />
        <span className="sidebar-username">
          {user?.user_metadata?.full_name || user?.email}
        </span>
        <button className="sidebar-signout" onClick={signOut}>
          Sign out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
