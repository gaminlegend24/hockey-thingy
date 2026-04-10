import { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const TeamsContext = createContext()

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

  const createTeam = async (name) => {
    if (!supabase || !user || isGuest) return { error: 'Not authenticated' }

    const { data, error } = await supabase
      .from('teams')
      .insert({ league_id: leagueId, name })
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

    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId)

    if (error) {
      console.error('Error deleting team:', error.message)
      return { error: error.message }
    }

    await fetchTeams()
    return { error: null }
  }

  return (
    <TeamsContext.Provider value={{ teams, loading, createTeam, deleteTeam }}>
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
