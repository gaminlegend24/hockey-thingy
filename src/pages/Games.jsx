import './Games.css'

function Games() {
  return (
    <div className="games">
      <div className="games-header">
        <h1>Games</h1>
        <button className="btn-primary">Add Game</button>
      </div>
      <div className="empty-state">
        <p>No games recorded yet.</p>
      </div>
    </div>
  )
}

export default Games
