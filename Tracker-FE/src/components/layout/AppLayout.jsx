import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const titles = {
  '/dashboard': 'Dashboard',
  '/tickets': 'Tickets',
  '/contacts': 'Contacts',
  '/team': 'Team',
  '/integrations': 'Integrations',
  '/settings': 'Settings',
}

export default function AppLayout() {
  const { pathname } = useLocation()
  const title = titles[pathname] || 'Tracker'

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
