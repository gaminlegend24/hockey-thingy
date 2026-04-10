import { NavLink, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLeagues } from '../contexts/LeagueContext'
import './Sidebar.css'

function Sidebar() {
  const { user, signOut } = useAuth()
  const { leagues } = useLeagues()
  const { leagueId } = useParams()

  const currentLeague = leagues.find(l => l.id === leagueId)
  const base = `/league/${leagueId}`

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>{currentLeague?.name || 'Hockey Tracker'}</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-back">Back to Leagues</NavLink>
        <NavLink to={base} end>Dashboard</NavLink>
        <NavLink to={`${base}/teams`}>Teams</NavLink>
        <NavLink to={`${base}/schedule`}>Schedule</NavLink>
        <NavLink to={`${base}/standings`}>Standings</NavLink>
        <NavLink to={`${base}/stats`}>Stats</NavLink>
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
