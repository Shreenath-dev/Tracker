import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Bell, Plus, X, LogOut } from 'lucide-react'
import { markRead, markAllRead } from '../../store/slices/notificationsSlice'
import { signOut } from '../../store/slices/authSlice'
import CreateTicketModal from '../tickets/CreateTicketModal'

const typeColors = {
  assignment: 'bg-blue-100 text-blue-600',
  sla_warning: 'bg-amber-100 text-amber-600',
  sla_breach: 'bg-red-100 text-red-600',
  reply: 'bg-violet-100 text-violet-600',
  status: 'bg-green-100 text-green-600',
}

function timeAgo(ts) {
  const diff = Date.now() - ts
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

export default function Header({ title }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const notifications = useSelector(s => s.notifications.items)
  const unread = notifications.filter(n => !n.read).length
  const [showNotifs, setShowNotifs] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  return (
    <>
      <header className="h-14 px-6 flex items-center justify-between border-b border-[var(--border)] bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <h1 className="font-display text-xl text-slate-900">{title}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary flex items-center gap-1.5"
          >
            <Plus size={14} />
            New Ticket
          </button>

          <button
            onClick={async () => {
              await dispatch(signOut())
              navigate('/login')
            }}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
            title="Sign out"
          >
            <LogOut size={17} strokeWidth={1.8} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifs(v => !v)}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-cream-100 text-slate-600 transition-colors"
            >
              <Bell size={17} strokeWidth={1.8} />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-11 w-80 card shadow-card-hover z-50 animate-fade-up">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                  <span className="text-sm font-semibold text-slate-800">Notifications</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => dispatch(markAllRead())} className="text-xs text-amber-600 hover:text-amber-700 font-medium">Mark all read</button>
                    <button onClick={() => setShowNotifs(false)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border)]">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => dispatch(markRead(n.id))}
                      className={`px-4 py-3 cursor-pointer hover:bg-cream-50 transition-colors ${!n.read ? 'bg-amber-50/40' : ''}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`mt-0.5 text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${typeColors[n.type] || 'bg-slate-100 text-slate-600'}`}>
                          {n.type.replace('_', ' ')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-700 leading-relaxed">{n.message}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                        </div>
                        {!n.read && <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showCreate && <CreateTicketModal onClose={() => setShowCreate(false)} />}
    </>
  )
}
