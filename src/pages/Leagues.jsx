import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLeagues } from '../contexts/LeagueContext'
import { useAuth } from '../contexts/AuthContext'
import './Leagues.css'

function Leagues() {
  const { leagues, loading, createLeague, deleteLeague } = useLeagues()
  const { user, isGuest, signOut } = useAuth()
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

  const handleDelete = async (e, leagueId, leagueName) => {
    e.stopPropagation()
    if (!confirm(`Delete "${leagueName}"? This cannot be undone.`)) return
    const result = await deleteLeague(leagueId)
    if (result.error) setError(result.error)
  }

  const handleAuthAction = () => {
    signOut().then(() => navigate('/'))
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="leagues-page">
      <div className="leagues-header">
        <div>
          <h1>{isGuest ? 'Guest Mode' : 'Your Leagues'}</h1>
          <p className="leagues-subtitle">
            {isGuest
              ? 'Use a shared link to view a league, or sign in to create your own.'
              : 'Select a league or create a new one'}
          </p>
        </div>
        <div className="leagues-header-right">
          {isGuest ? (
            <button className="btn-primary" onClick={handleAuthAction}>Sign in</button>
          ) : (
            <>
              <span className="leagues-user">{user?.user_metadata?.full_name || user?.email}</span>
              <button className="btn-secondary" onClick={handleAuthAction}>Sign out</button>
            </>
          )}
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
            <div className="league-card-top">
              <h3>{league.name}</h3>
              {league.role === 'owner' && (
                <button
                  className="league-delete"
                  onClick={(e) => handleDelete(e, league.id, league.name)}
                  title="Delete league"
                >
                  &times;
                </button>
              )}
            </div>
            <span className="league-role">{league.role}</span>
          </div>
        ))}

        {!isGuest && (
          showForm ? (
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
          )
        )}
      </div>
    </div>
  )
}

export default Leagues
