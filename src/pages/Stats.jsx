import './Stats.css'

function Stats() {
  return (
    <div className="stats">
      <h1>Standings & Stats</h1>
      <div className="stats-table-wrapper">
        <table className="stats-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>W</th>
              <th>L</th>
              <th>OTL</th>
              <th>PTS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" className="stats-empty">No data available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Stats
