import { useParams } from 'react-router-dom'
import { useLeagues } from '../contexts/LeagueContext'
import './Dashboard.css'

function Dashboard() {
  const { leagueId } = useParams()
  const { leagues } = useLeagues()
  const league = leagues.find(l => l.id === leagueId)

  return (
    <div className="dashboard">
      <h1>{league?.name || 'Dashboard'}</h1>
      <p className="dashboard-subtitle">League Overview</p>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span className="dashboard-card-value">0</span>
          <span className="dashboard-card-label">Teams</span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-value">0</span>
          <span className="dashboard-card-label">Players</span>
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
