import './Teams.css'

function Teams() {
  return (
    <div className="teams">
      <div className="teams-header">
        <h1>Teams</h1>
        <button className="btn-primary">Add Team</button>
      </div>
      <div className="empty-state">
        <p>No teams yet. Add your first team to get started.</p>
      </div>
    </div>
  )
}

export default Teams
