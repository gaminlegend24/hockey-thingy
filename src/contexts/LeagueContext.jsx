import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const LeagueContext = createContext()

export function LeagueProvider({ children }) {
  const { user } = useAuth()
  const [leagues, setLeagues] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLeagues = async () => {
    if (!supabase || !user) {
      setLeagues([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('league_members')
      .select('league_id, role, leagues(id, name, owner_id, created_at)')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching leagues:', error.message)
      setLeagues([])
    } else {
      setLeagues(data.map(m => ({ ...m.leagues, role: m.role })))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLeagues()
  }, [user])

  const createLeague = async (name) => {
    if (!supabase || !user) return { error: 'Not authenticated' }

    const { data: league, error: leagueError } = await supabase
      .from('leagues')
      .insert({ name, owner_id: user.id })
      .select()
      .single()

    if (leagueError) {
      console.error('Error creating league:', leagueError.message)
      return { error: leagueError.message }
    }

    const { error: memberError } = await supabase
      .from('league_members')
      .insert({ league_id: league.id, user_id: user.id, role: 'owner' })

    if (memberError) {
      console.error('Error adding owner as member:', memberError.message)
      return { error: memberError.message }
    }

    await fetchLeagues()
    return { error: null, league }
  }

  const deleteLeague = async (leagueId) => {
    if (!supabase) return { error: 'Not configured' }

    const { error } = await supabase
      .from('leagues')
      .delete()
      .eq('id', leagueId)

    if (error) {
      console.error('Error deleting league:', error.message)
      return { error: error.message }
    }

    await fetchLeagues()
    return { error: null }
  }

  return (
    <LeagueContext.Provider value={{ leagues, loading, createLeague, deleteLeague, refreshLeagues: fetchLeagues }}>
      {children}
    </LeagueContext.Provider>
  )
}

export function useLeagues() {
  const context = useContext(LeagueContext)
  if (!context) {
    throw new Error('useLeagues must be used within a LeagueProvider')
  }
  return context
}
