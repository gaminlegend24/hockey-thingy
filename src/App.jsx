import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { LeagueProvider } from './contexts/LeagueContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Leagues from './pages/Leagues'
import Dashboard from './pages/Dashboard'
import Teams from './pages/Teams'
import Schedule from './pages/Schedule'
import Standings from './pages/Standings'
import Stats from './pages/Stats'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!user) {
    return <Login />
  }

  return (
    <LeagueProvider>
      <Routes>
        <Route index element={<Leagues />} />
        <Route path="league/:leagueId" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="teams" element={<Teams />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="standings" element={<Standings />} />
          <Route path="stats" element={<Stats />} />
        </Route>
      </Routes>
    </LeagueProvider>
  )
}

export default App
