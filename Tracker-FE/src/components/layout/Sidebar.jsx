import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LayoutDashboard, Ticket, Users, Plug, Settings, LogOut, UserCog, ChevronLeft, ChevronRight } from 'lucide-react'
import { logout } from '../../store/slices/authSlice'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tickets', icon: Ticket, label: 'Tickets' },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/integrations', icon: Plug, label: 'Integrations' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)
  const [collapsed, setCollapsed] = useState(false)

  const allItems = [
    ...navItems,
    ...(user?.role === 'admin' ? [{ to: '/team', icon: UserCog, label: 'Team' }] : []),
  ]

  return (
    <aside
      className={`shrink-0 h-screen sticky top-0 flex flex-col bg-white border-r border-[var(--border)] transition-all duration-200 ease-in-out ${collapsed ? 'w-14' : 'w-56'}`}
    >
      {/* Logo + toggle */}
      <div className={`flex items-center border-b border-[var(--border)] h-14 ${collapsed ? 'justify-center px-0' : 'px-4 justify-between'}`}>
        {!collapsed && (
          <div className="min-w-0">
            <span className="font-display text-lg text-slate-900 tracking-tight leading-none">Tracker</span>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{user?.workspace}</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-cream-100 transition-colors shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-hidden">
        {allItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 overflow-hidden
              ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'}
              ${isActive
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'text-slate-600 hover:bg-cream-100 hover:text-slate-900 border border-transparent'
              }`
            }
          >
            <Icon size={16} strokeWidth={1.8} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className={`border-t border-[var(--border)] py-3 px-2`}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-semibold">
              {user?.name?.charAt(0)}
            </div>
            <button
              onClick={() => { dispatch(logout()); navigate('/login') }}
              className="text-slate-400 hover:text-red-500 transition-colors"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-cream-50 transition-colors">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-semibold shrink-0">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={() => { dispatch(logout()); navigate('/login') }}
              className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
