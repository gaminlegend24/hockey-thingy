import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLeagues } from '../contexts/LeagueContext'
import './Dashboard.css'

function Dashboard() {
  const { leagueId } = useParams()
  const { isGuest } = useAuth()
  const { leagues, fetchLeagueById, toggleLeaguePublic } = useLeagues()
  const [league, setLeague] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const found = leagues.find(l => l.id === leagueId)
    if (found) {
      setLeague(found)
    } else if (leagueId) {
      fetchLeagueById(leagueId).then(({ league: l }) => {
        if (l) setLeague(l)
      })
    }
  }, [leagueId, leagues])

  const handleTogglePublic = async () => {
    const result = await toggleLeaguePublic(leagueId, !league.public)
    if (!result.error) {
      setLeague(prev => ({ ...prev, public: !prev.public }))
    }
  }

  const handleCopyLink = () => {
    const url = window.location.origin + '/hockey-thingy/league/' + leagueId
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isOwner = league?.role === 'owner'

  return (
    <div className="dashboard">
      <h1>{league?.name || 'Dashboard'}</h1>
      <p className="dashboard-subtitle">League Overview</p>

      {isOwner && !isGuest && (
        <div className="dashboard-share">
          <label className="dashboard-toggle">
            <input
              type="checkbox"
              checked={league?.public || false}
              onChange={handleTogglePublic}
            />
            <span>Public league</span>
          </label>
          {league?.public && (
            <button className="btn-secondary btn-small" onClick={handleCopyLink}>
              {copied ? 'Copied!' : 'Copy share link'}
            </button>
          )}
        </div>
      )}

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span className="dashboard-card-value">0</span>
          <span className="dashboard-card-label">Teams</span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-value">0</span>
          <span className="dashboard-card-label">Games Played</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
