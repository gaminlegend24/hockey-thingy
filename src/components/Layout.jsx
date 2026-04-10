import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { TeamsProvider } from '../contexts/TeamsContext'
import './Layout.css'

function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <TeamsProvider>
          <Outlet />
        </TeamsProvider>
      </main>
    </div>
  )
}

export default Layout
