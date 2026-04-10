import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTeams } from '../contexts/TeamsContext'
import './Teams.css'

function Teams() {
  const { isGuest } = useAuth()
  const { teams, loading, createTeam, deleteTeam } = useTeams()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    setError(null)
    const result = await createTeam(name.trim())
    if (result.error) {
      setError(result.error)
    } else {
      setName('')
      setShowForm(false)
    }
    setCreating(false)
  }

  const handleDelete = async (e, teamId, teamName) => {
    e.stopPropagation()
    if (!confirm(`Delete "${teamName}"? This cannot be undone.`)) return
    const result = await deleteTeam(teamId)
    if (result.error) setError(result.error)
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="teams">
      <div className="teams-header">
        <h1>Teams</h1>
        {!isGuest && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            Add Team
          </button>
        )}
      </div>

      {error && <p className="teams-error">{error}</p>}

      {teams.length === 0 && !showForm ? (
        <div className="empty-state">
          <p>No teams yet.{!isGuest && ' Add your first team to get started.'}</p>
        </div>
      ) : (
        <div className="teams-grid">
          {teams.map(team => (
            <div key={team.id} className="team-card">
              <span className="team-name">{team.name}</span>
              {!isGuest && (
                <button
                  className="team-delete"
                  onClick={(e) => handleDelete(e, team.id, team.name)}
                  title="Delete team"
                >
                  &times;
                </button>
              )}
            </div>
          ))}

          {showForm && (
            <form className="team-card team-card-form" onSubmit={handleCreate}>
              <input
                type="text"
                placeholder="Team name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <div className="team-form-actions">
                <button type="submit" className="btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => { setShowForm(false); setName('') }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default Teams
