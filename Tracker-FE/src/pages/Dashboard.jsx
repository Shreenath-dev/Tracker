import { useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Ticket, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { timeAgo, statusLabel } from '../utils'

const statusColors = { open: '#3b82f6', inprogress: '#7c3aed', waiting: '#d97706', resolved: '#16a34a' }

export default function Dashboard() {
  const tickets = useSelector(s => s.tickets.items)
  const user = useSelector(s => s.auth.user)

  const open = tickets.filter(t => t.status === 'open').length
  const mine = tickets.filter(t => t.assignee === user?.id && t.status !== 'resolved').length
  const breached = tickets.filter(t => t.slaDeadline < Date.now() && t.status !== 'resolved').length
  const resolved = tickets.filter(t => t.status === 'resolved').length

  const statusData = ['open', 'inprogress', 'waiting', 'resolved'].map(s => ({
    name: statusLabel(s),
    count: tickets.filter(t => t.status === s).length,
    color: statusColors[s],
  }))

  const recent = [...tickets].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 8)

  const stats = [
    { label: 'Open Tickets', value: open, icon: Ticket, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Assigned to Me', value: mine, icon: CheckCircle2, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'SLA Breaches Today', value: breached, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Avg Response', value: '1h 42m', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="space-y-6 w-full">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
          <div key={label} className={`card p-5 animate-stagger-${i + 1}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className="font-display text-3xl text-slate-900 mt-1">{value}</p>
              </div>
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={17} className={color} strokeWidth={1.8} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Chart */}
        <div className="card p-5 lg:col-span-2 animate-stagger-3">
          <p className="text-sm font-semibold text-slate-700 mb-4">Tickets by Status</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={statusData} barSize={28}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8a9ab0' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8a9ab0' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e8dfc8', borderRadius: 8, fontSize: 12 }}
                cursor={{ fill: '#f9f3e8' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity feed */}
        <div className="card p-5 lg:col-span-3 animate-stagger-4">
          <p className="text-sm font-semibold text-slate-700 mb-4">Recent Activity</p>
          <div className="space-y-2.5">
            {recent.map(t => (
              <div key={t.id} className="flex items-center gap-3 py-1.5 border-b border-[var(--border)] last:border-0">
                <span className="text-xs font-mono text-slate-400 w-12 shrink-0">{t.id}</span>
                <p className="text-xs text-slate-700 flex-1 truncate">{t.title}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
                  t.status === 'open' ? 'bg-blue-100 text-blue-700' :
                  t.status === 'inprogress' ? 'bg-violet-100 text-violet-700' :
                  t.status === 'waiting' ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`}>{statusLabel(t.status)}</span>
                <span className="text-xs text-slate-400 shrink-0">{timeAgo(t.updatedAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
