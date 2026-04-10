import './Players.css'

function Players() {
  return (
    <div className="players">
      <div className="players-header">
        <h1>Players</h1>
        <button className="btn-primary">Add Player</button>
      </div>
      <div className="empty-state">
        <p>No players yet. Add your first player to get started.</p>
      </div>
    </div>
  )
}

export default Players
