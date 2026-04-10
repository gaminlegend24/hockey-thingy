import { useState } from 'react'
import './Stats.css'

function Stats() {
  const [view, setView] = useState('skaters')

  return (
    <div className="stats">
      <h1>Player Stats</h1>
      <div className="stats-toggle">
        <button
          className={view === 'skaters' ? 'stats-toggle-btn active' : 'stats-toggle-btn'}
          onClick={() => setView('skaters')}
        >
          Skaters
        </button>
        <button
          className={view === 'goalies' ? 'stats-toggle-btn active' : 'stats-toggle-btn'}
          onClick={() => setView('goalies')}
        >
          Goalies
        </button>
      </div>
      <div className="stats-table-wrapper">
        {view === 'skaters' ? (
          <table className="stats-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>GP</th>
                <th>G</th>
                <th>A</th>
                <th>PTS</th>
                <th>+/-</th>
                <th>Hits</th>
                <th>Shots</th>
                <th>Pokes</th>
                <th>Blocks</th>
                <th>TOI</th>
                <th>TOI/GP</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="12" className="stats-empty">No data available</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className="stats-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>GP</th>
                <th>W</th>
                <th>L</th>
                <th>GAA</th>
                <th>SV%</th>
                <th>TOI</th>
                <th>TOI/GP</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="8" className="stats-empty">No data available</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Stats
