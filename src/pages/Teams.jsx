import { useAuth } from '../contexts/AuthContext'
import './Teams.css'

function Teams() {
  const { isGuest } = useAuth()

  return (
    <div className="teams">
      <div className="teams-header">
        <h1>Teams</h1>
        {!isGuest && <button className="btn-primary">Add Team</button>}
      </div>
      <div className="empty-state">
        <p>No teams yet.{!isGuest && ' Add your first team to get started.'}</p>
      </div>
    </div>
  )
}

export default Teams
