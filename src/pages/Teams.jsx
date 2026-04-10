import { useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTeams } from '../contexts/TeamsContext'
import './Teams.css'

function LogoDrop({ logoFile, previewUrl, onFile, onClear }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) onFile(file)
  }

  const handlePick = (e) => {
    const file = e.target.files[0]
    if (file) onFile(file)
    e.target.value = ''
  }

  return (
    <div
      className={`logo-drop${dragOver ? ' drag-over' : ''}`}
      onClick={() => !previewUrl && inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handlePick} />
      {previewUrl ? (
        <div className="logo-preview">
          <img src={previewUrl} alt="Logo preview" />
          <button
            type="button"
            className="logo-preview-clear"
            onClick={(e) => { e.stopPropagation(); onClear() }}
            title="Remove logo"
          >
            &times;
          </button>
        </div>
      ) : (
        <span className="logo-drop-hint">Drop logo here or click to browse</span>
      )}
    </div>
  )
}

function Teams() {
  const { isGuest } = useAuth()
  const { teams, loading, createTeam, deleteTeam, uploadLogo } = useTeams()

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [logoFile, setLogoFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)

  const logoInputRefs = useRef({})

  const handleLogoFile = (file) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setLogoFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleLogoClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setLogoFile(null)
    setPreviewUrl(null)
  }

  const resetForm = () => {
    setName('')
    handleLogoClear()
    setShowForm(false)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    setError(null)
    const result = await createTeam(name.trim(), logoFile)
    if (result.error) {
      setError(result.error)
    } else {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setName('')
      setLogoFile(null)
      setPreviewUrl(null)
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

  const handleLogoChange = async (teamId, file) => {
    const result = await uploadLogo(teamId, file)
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
              {!isGuest ? (
                <>
                  <input
                    ref={el => logoInputRefs.current[team.id] = el}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) handleLogoChange(team.id, file)
                      e.target.value = ''
                    }}
                  />
                  <div
                    className={team.logo_url ? 'team-logo' : 'team-logo-placeholder'}
                    onClick={() => logoInputRefs.current[team.id]?.click()}
                    title="Click to change logo"
                  >
                    {team.logo_url && <img src={team.logo_url} alt={`${team.name} logo`} />}
                  </div>
                </>
              ) : (
                <div className={team.logo_url ? 'team-logo' : 'team-logo-placeholder'}>
                  {team.logo_url && <img src={team.logo_url} alt={`${team.name} logo`} />}
                </div>
              )}
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
              <LogoDrop
                logoFile={logoFile}
                previewUrl={previewUrl}
                onFile={handleLogoFile}
                onClear={handleLogoClear}
              />
              <div className="team-form-actions">
                <button type="submit" className="btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create'}
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>
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
