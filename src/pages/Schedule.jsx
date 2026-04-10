import './Schedule.css'

function Schedule() {
  return (
    <div className="schedule">
      <div className="schedule-header">
        <h1>Schedule</h1>
        <button className="btn-primary">Add Game</button>
      </div>
      <div className="empty-state">
        <p>No games scheduled yet.</p>
      </div>
    </div>
  )
}

export default Schedule
