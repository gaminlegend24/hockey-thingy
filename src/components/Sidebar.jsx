import { useEffect, useState } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLeagues } from '../contexts/LeagueContext'
import './Sidebar.css'

function Sidebar() {
  const { user, isGuest, signOut } = useAuth()
  const { leagues, fetchLeagueById } = useLeagues()
  const { leagueId } = useParams()
  const navigate = useNavigate()
  const [currentLeague, setCurrentLeague] = useState(null)

  useEffect(() => {
    // Try to find league in local list first
    const found = leagues.find(l => l.id === leagueId)
    if (found) {
      setCurrentLeague(found)
    } else if (leagueId) {
      // Guest or league not in list — fetch directly
      fetchLeagueById(leagueId).then(({ league }) => {
        if (league) setCurrentLeague(league)
      })
    }
  }, [leagueId, leagues])

  const base = `/league/${leagueId}`

  const handleAuthAction = () => {
    signOut().then(() => {
      navigate('/')
    })
  }

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
        {isGuest ? (
          <>
            <span className="sidebar-username">Guest</span>
            <button className="sidebar-signout" onClick={handleAuthAction}>
              Sign in
            </button>
          </>
        ) : (
          <>
            <img
              className="sidebar-avatar"
              src={user?.user_metadata?.avatar_url}
              alt=""
            />
            <span className="sidebar-username">
              {user?.user_metadata?.full_name || user?.email}
            </span>
            <button className="sidebar-signout" onClick={handleAuthAction}>
              Sign out
            </button>
          </>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
