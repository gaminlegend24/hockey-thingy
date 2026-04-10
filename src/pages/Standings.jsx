import './Standings.css'

function Standings() {
  return (
    <div className="standings">
      <h1>Standings</h1>
      <div className="standings-table-wrapper">
        <table className="standings-table">
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
              <td colSpan="5" className="standings-empty">No data available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Standings
