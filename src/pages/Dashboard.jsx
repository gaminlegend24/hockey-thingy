import './Dashboard.css'

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="dashboard-subtitle">Welcome to Hockey Tracker</p>
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
