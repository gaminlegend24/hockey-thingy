import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLeagues } from '../contexts/LeagueContext'
import { useAuth } from '../contexts/AuthContext'
import './Leagues.css'

function Leagues() {
  const { leagues, loading, createLeague } = useLeagues()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    setError(null)
    const result = await createLeague(name.trim())
    if (result.error) {
      setError(result.error)
    } else {
      setName('')
      setShowForm(false)
    }
    setCreating(false)
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="leagues-page">
      <div className="leagues-header">
        <div>
          <h1>Your Leagues</h1>
          <p className="leagues-subtitle">Select a league or create a new one</p>
        </div>
        <div className="leagues-header-right">
          <span className="leagues-user">{user?.user_metadata?.full_name || user?.email}</span>
          <button className="btn-secondary" onClick={signOut}>Sign out</button>
        </div>
      </div>

      {error && <p className="leagues-error">{error}</p>}

      <div className="leagues-grid">
        {leagues.map(league => (
          <div
            key={league.id}
            className="league-card"
            onClick={() => navigate(`/league/${league.id}`)}
          >
            <h3>{league.name}</h3>
            <span className="league-role">{league.role}</span>
          </div>
        ))}

        {showForm ? (
          <form className="league-card league-card-form" onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="League name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <div className="league-form-actions">
              <button type="submit" className="btn-primary" disabled={creating}>
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setName('') }}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="league-card league-card-new" onClick={() => setShowForm(true)}>
            <span className="league-card-plus">+</span>
            <span>Create League</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Leagues
