import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AppLayout from './components/layout/AppLayout'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import TicketsPage from './pages/TicketsPage'
import ContactsPage from './pages/ContactsPage'
import TeamPage from './pages/TeamPage'
import IntegrationsPage from './pages/IntegrationsPage'
import SettingsPage from './pages/SettingsPage'

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(s => s.auth.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
