import { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const TeamsContext = createContext()

function getLogoPath(logoUrl) {
  if (!logoUrl) return null
  // Extract the storage path from the public URL
  // URL format: .../storage/v1/object/public/team-logos/{path}
  const marker = '/team-logos/'
  const idx = logoUrl.indexOf(marker)
  if (idx === -1) return null
  return logoUrl.slice(idx + marker.length)
}

async function uploadLogoFile(file, leagueId) {
  const ext = file.name.split('.').pop()
  const path = `${leagueId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage
    .from('team-logos')
    .upload(path, file, { upsert: false })
  if (error) return { error: error.message, url: null }
  const { data } = supabase.storage.from('team-logos').getPublicUrl(path)
  return { error: null, url: data.publicUrl }
}

export function TeamsProvider({ children }) {
  const { leagueId } = useParams()
  const { user, isGuest } = useAuth()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTeams = async () => {
    if (!supabase || !leagueId) {
      setTeams([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('league_id', leagueId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching teams:', error.message)
      setTeams([])
    } else {
      setTeams(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    fetchTeams()
  }, [leagueId])

  const createTeam = async (name, logoFile) => {
    if (!supabase || !user || isGuest) return { error: 'Not authenticated' }

    let logo_url = null
    if (logoFile) {
      const { error: uploadError, url } = await uploadLogoFile(logoFile, leagueId)
      if (uploadError) return { error: uploadError }
      logo_url = url
    }

    const { data, error } = await supabase
      .from('teams')
      .insert({ league_id: leagueId, name, logo_url })
      .select()
      .single()

    if (error) {
      console.error('Error creating team:', error.message)
      return { error: error.message }
    }

    await fetchTeams()
    return { error: null, team: data }
  }

  const deleteTeam = async (teamId) => {
    if (!supabase || isGuest) return { error: 'Not authorized' }

    const team = teams.find(t => t.id === teamId)

    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId)

    if (error) {
      console.error('Error deleting team:', error.message)
      return { error: error.message }
    }

    // Clean up logo from storage
    if (team?.logo_url) {
      const path = getLogoPath(team.logo_url)
      if (path) {
        await supabase.storage.from('team-logos').remove([path])
      }
    }

    await fetchTeams()
    return { error: null }
  }

  const uploadLogo = async (teamId, file) => {
    if (!supabase || !user || isGuest) return { error: 'Not authenticated' }

    const team = teams.find(t => t.id === teamId)

    const { error: uploadError, url } = await uploadLogoFile(file, leagueId)
    if (uploadError) return { error: uploadError }

    const { error } = await supabase
      .from('teams')
      .update({ logo_url: url })
      .eq('id', teamId)

    if (error) {
      console.error('Error updating team logo:', error.message)
      return { error: error.message }
    }

    // Clean up old logo
    if (team?.logo_url) {
      const oldPath = getLogoPath(team.logo_url)
      if (oldPath) {
        await supabase.storage.from('team-logos').remove([oldPath])
      }
    }

    await fetchTeams()
    return { error: null }
  }

  return (
    <TeamsContext.Provider value={{ teams, loading, createTeam, deleteTeam, uploadLogo }}>
      {children}
    </TeamsContext.Provider>
  )
}

export function useTeams() {
  const context = useContext(TeamsContext)
  if (!context) {
    throw new Error('useTeams must be used within a TeamsProvider')
  }
  return context
}
