import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, PieChart, Pie, Area, AreaChart, CartesianGrid, Legend,
} from 'recharts'
import {
  Ticket, Clock, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown,
  Timer, Star, Activity, Eye, Users, BarChart3, Zap, Radio,
  ArrowUpRight, ArrowDownRight, Minus, Shield, Globe, MessageSquare,
  Crown, Flame, Building2, CircleDot, RefreshCw,
} from 'lucide-react'
import { timeAgo, statusLabel, slaLabel } from '../utils'
import { selectTicket } from '../store/slices/ticketsSlice'

/* ─── MOCK GENERATORS ─── */
const seed = (i) => Math.abs(Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1
const genSparkline = (base, variance, len = 7) =>
  Array.from({ length: len }, (_, i) => ({
    v: Math.max(0, Math.round(base + (seed(i + base) - 0.5) * variance * 2)),
  }))

const genVolumeData = (days = 30) => {
  const data = []
  const now = Date.now()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * 86400000)
    const label = `${d.getMonth() + 1}/${d.getDate()}`
    data.push({
      date: label,
      created: Math.round(3 + seed(i * 3) * 8),
      resolved: Math.round(2 + seed(i * 7 + 1) * 9),
    })
  }
  return data
}

const genBacklogData = (days = 30) => {
  let net = 12
  const data = []
  const now = Date.now()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * 86400000)
    net += Math.round((seed(i * 11) - 0.45) * 4)
    if (net < 0) net = 1
    data.push({ date: `${d.getMonth() + 1}/${d.getDate()}`, backlog: net })
  }
  return data
}

const genHeatmapData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = Array.from({ length: 12 }, (_, i) => `${i + 8}`)
  return days.map((day, di) =>
    hours.map((hour, hi) => ({
      day,
      hour: `${hour}:00`,
      value: Math.round(seed(di * 12 + hi + 3) * 10),
    }))
  )
}

const mockActivity = [
  { id: 1, type: 'assign', text: 'T-001 assigned to Alex Morgan', time: Date.now() - 180000 },
  { id: 2, type: 'reply', text: 'Client replied on T-002', time: Date.now() - 420000 },
  { id: 3, type: 'resolve', text: 'T-007 resolved by Sarah Chen', time: Date.now() - 900000 },
  { id: 4, type: 'create', text: 'New ticket T-009 from widget', time: Date.now() - 1500000 },
  { id: 5, type: 'sla', text: 'SLA warning on T-005 (< 30m)', time: Date.now() - 2100000 },
  { id: 6, type: 'assign', text: 'T-006 reassigned to Jordan Lee', time: Date.now() - 3000000 },
  { id: 7, type: 'reply', text: 'Internal note added to T-003', time: Date.now() - 4200000 },
  { id: 8, type: 'status', text: 'T-004 moved to In Progress', time: Date.now() - 5400000 },
  { id: 9, type: 'create', text: 'New ticket T-010 from manual', time: Date.now() - 7200000 },
  { id: 10, type: 'resolve', text: 'T-008 marked as resolved', time: Date.now() - 10800000 },
]

/* ─── DESIGN TOKENS ─── */
const PALETTE = {
  blue: { bg: 'rgba(59,130,246,0.08)', text: '#2563eb', accent: '#3b82f6', glow: 'rgba(59,130,246,0.15)' },
  violet: { bg: 'rgba(124,58,237,0.08)', text: '#6d28d9', accent: '#7c3aed', glow: 'rgba(124,58,237,0.15)' },
  red: { bg: 'rgba(220,38,38,0.08)', text: '#dc2626', accent: '#ef4444', glow: 'rgba(220,38,38,0.15)' },
  green: { bg: 'rgba(22,163,74,0.08)', text: '#15803d', accent: '#16a34a', glow: 'rgba(22,163,74,0.15)' },
  amber: { bg: 'rgba(217,119,6,0.08)', text: '#b45309', accent: '#d97706', glow: 'rgba(217,119,6,0.15)' },
  slate: { bg: 'rgba(100,116,139,0.06)', text: '#475569', accent: '#64748b', glow: 'rgba(100,116,139,0.1)' },
}

/* ─── MINI SPARKLINE (SVG) ─── */
function Sparkline({ data, color = '#d97706', height = 28, width = 56 }) {
  if (!data || data.length === 0) return null
  const max = Math.max(...data.map((d) => d.v), 1)
  const barW = (width - (data.length - 1) * 2) / data.length
  return (
    <svg width={width} height={height} className="shrink-0">
      {data.map((d, i) => {
        const h = (d.v / max) * (height - 2)
        return (
          <rect
            key={i}
            x={i * (barW + 2)}
            y={height - h - 1}
            width={barW}
            height={Math.max(h, 2)}
            rx={1.5}
            fill={color}
            opacity={i === data.length - 1 ? 1 : 0.45}
          />
        )
      })}
    </svg>
  )
}

/* ─── DELTA BADGE ─── */
function Delta({ value, suffix = '' }) {
  if (value === 0) return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-slate-400">
      <Minus size={11} /> 0{suffix}
    </span>
  )
  const positive = value > 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
      {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {Math.abs(value)}{suffix}
    </span>
  )
}

/* ─── TIME RANGE TOGGLE ─── */
function RangeToggle({ value, onChange }) {
  const opts = ['7d', '30d', '90d']
  return (
    <div className="flex bg-cream-100 rounded-lg p-0.5 gap-0.5">
      {opts.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
            value === o
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

/* ─── SECTION HEADER ─── */
function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2.5 mb-4 mt-2">
      <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
        <Icon size={14} className="text-amber-600" strokeWidth={2} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-800 leading-tight">{title}</h3>
        {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

/* ─── EMPTY STATE ─── */
function EmptyState({ message, color = 'green' }) {
  const colors = {
    green: 'text-emerald-600 bg-emerald-50',
    amber: 'text-amber-600 bg-amber-50',
    slate: 'text-slate-500 bg-slate-50',
  }
  return (
    <div className={`flex items-center justify-center gap-2 py-8 rounded-lg ${colors[color]}`}>
      <CheckCircle2 size={16} />
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

/* ─── CUSTOM TOOLTIP ─── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[var(--border)] rounded-lg px-3 py-2 shadow-card">
      <p className="text-[11px] font-medium text-slate-500 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs font-semibold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

/* ─── ACTIVITY ICON ─── */
function ActivityIcon({ type }) {
  const map = {
    assign: { icon: Users, color: 'text-blue-500 bg-blue-50' },
    reply: { icon: MessageSquare, color: 'text-violet-500 bg-violet-50' },
    resolve: { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50' },
    create: { icon: Ticket, color: 'text-amber-500 bg-amber-50' },
    sla: { icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
    status: { icon: Activity, color: 'text-slate-500 bg-slate-50' },
  }
  const { icon: Icon, color } = map[type] || map.status
  return (
    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${color}`}>
      <Icon size={12} strokeWidth={2} />
    </div>
  )
}

/* ─── HEATMAP CELL ─── */
function HeatCell({ value }) {
  const opacity = Math.min(value / 10, 1)
  return (
    <div
      className="w-full aspect-square rounded-[3px] transition-all duration-200 hover:scale-125 cursor-default"
      style={{ backgroundColor: `rgba(217,119,6,${0.08 + opacity * 0.72})` }}
      title={`${value} tickets`}
    />
  )
}

/* ════════════════════════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
   ════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const dispatch = useDispatch()
  const tickets = useSelector((s) => s.tickets.items)
  const user = useSelector((s) => s.auth.user)
  const team = useSelector((s) => s.team.members)
  const contacts = useSelector((s) => s.contacts.items)

  const [volumeRange, setVolumeRange] = useState('7d')
  const [statusRange, setStatusRange] = useState('7d')
  const [priorityRange, setPriorityRange] = useState('7d')
  const [slaRefresh, setSlaRefresh] = useState(0)

  const isManager = user?.role === 'admin' || user?.role === 'manager'

  // Auto-refresh SLA watchlist every 60s
  useEffect(() => {
    const timer = setInterval(() => setSlaRefresh((p) => p + 1), 60000)
    return () => clearInterval(timer)
  }, [])

  /* ─── ROW 1: Pulse Metrics ─── */
  const openCount = tickets.filter((t) => t.status === 'open').length
  const myCount = tickets.filter((t) => t.assignee === user?.id && t.status !== 'resolved').length
  const breachedCount = tickets.filter((t) => t.slaDeadline < Date.now() && t.status !== 'resolved').length
  const resolvedToday = tickets.filter((t) => {
    if (t.status !== 'resolved') return false
    const today = new Date()
    const updated = new Date(t.updatedAt)
    return updated.toDateString() === today.toDateString()
  }).length

  const pulseCards = [
    {
      label: 'Open Tickets',
      value: openCount,
      delta: -2,
      sparkData: genSparkline(openCount, 3),
      palette: PALETTE.blue,
      icon: Ticket,
    },
    {
      label: 'My Tickets',
      value: myCount,
      delta: 1,
      sparkData: genSparkline(myCount, 2),
      palette: PALETTE.violet,
      icon: Eye,
    },
    {
      label: 'SLA Breached',
      value: breachedCount,
      delta: breachedCount > 0 ? 1 : 0,
      sparkData: genSparkline(breachedCount, 2),
      palette: breachedCount > 0 ? PALETTE.red : PALETTE.green,
      icon: AlertTriangle,
      alert: breachedCount > 0,
    },
    {
      label: 'Resolved Today',
      value: resolvedToday,
      delta: 3,
      sparkData: genSparkline(resolvedToday || 1, 2),
      palette: PALETTE.green,
      icon: CheckCircle2,
    },
  ]

  /* ─── ROW 2: Performance Metrics ─── */
  const perfCards = [
    {
      label: 'Avg First Response',
      value: '1h 42m',
      target: '< 2h',
      status: 'green',
      trend: -12,
      trendLabel: 'vs last week',
      icon: Timer,
    },
    {
      label: 'Avg Resolution Time',
      value: '6h 15m',
      target: '< 8h',
      status: 'green',
      trend: -8,
      trendLabel: 'vs last week',
      icon: Clock,
    },
    {
      label: 'CSAT Score',
      value: '4.6',
      target: '> 4.0',
      status: 'green',
      trend: 5,
      trendLabel: 'vs last week',
      icon: Star,
      suffix: '/5',
    },
  ]

  /* ─── ROW 3: Distribution Data ─── */
  const volumeData = useMemo(() => {
    const days = volumeRange === '7d' ? 7 : volumeRange === '30d' ? 30 : 90
    return genVolumeData(days)
  }, [volumeRange])

  const statusData = useMemo(() => {
    const counts = { open: 0, inprogress: 0, waiting: 0, resolved: 0 }
    tickets.forEach((t) => { if (counts[t.status] !== undefined) counts[t.status]++ })
    return [
      { name: 'Open', value: counts.open, fill: '#3b82f6' },
      { name: 'In Progress', value: counts.inprogress, fill: '#7c3aed' },
      { name: 'Waiting', value: counts.waiting, fill: '#d97706' },
      { name: 'Resolved', value: counts.resolved, fill: '#16a34a' },
    ]
  }, [tickets])

  const priorityData = useMemo(() => {
    const counts = { urgent: 0, high: 0, medium: 0, low: 0 }
    tickets.forEach((t) => { if (counts[t.priority] !== undefined) counts[t.priority]++ })
    return [
      { name: 'Urgent', count: counts.urgent, fill: '#dc2626' },
      { name: 'High', count: counts.high, fill: '#ea580c' },
      { name: 'Medium', count: counts.medium, fill: '#d97706' },
      { name: 'Low', count: counts.low, fill: '#16a34a' },
    ]
  }, [tickets])

  /* ─── ROW 4: SLA Watchlist ─── */
  const slaWatchlist = useMemo(() => {
    const twoHoursFromNow = Date.now() + 7200000
    return tickets
      .filter((t) => t.status !== 'resolved' && t.slaDeadline <= twoHoursFromNow)
      .sort((a, b) => a.slaDeadline - b.slaDeadline)
  }, [tickets, slaRefresh])

  /* ─── ROW 5: Team Data ─── */
  const workloadData = useMemo(
    () => team.map((m) => ({ name: m.name.split(' ')[0], open: m.open, fill: m.open > 5 ? '#ef4444' : m.open > 3 ? '#d97706' : '#16a34a' })),
    [team]
  )

  const leaderboard = useMemo(
    () => [...team].sort((a, b) => b.resolved - a.resolved),
    [team]
  )

  const heatmapData = useMemo(() => genHeatmapData(), [])

  /* ─── ROW 6: Source/Channel Data ─── */
  const sourceData = useMemo(() => {
    const manual = tickets.filter((t) => t.source === 'manual').length
    const widget = tickets.filter((t) => t.source === 'widget').length
    return [
      { name: 'Manual', value: manual, fill: '#7c3aed' },
      { name: 'Widget', value: widget, fill: '#d97706' },
    ]
  }, [tickets])

  const backlogData = useMemo(() => genBacklogData(30), [])

  const topCompanies = useMemo(() => {
    const counts = {}
    tickets.forEach((t) => {
      const contact = contacts.find((c) => c.id === t.contact)
      if (contact) counts[contact.company] = (counts[contact.company] || 0) + 1
    })
    return Object.entries(counts)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [tickets, contacts])

  /* ════════════════════════════════════════════════════════════════ */

  return (
    <div className="space-y-6 w-full max-w-[1440px] mx-auto pb-8">

      {/* ─── DASHBOARD HEADER ─── */}
      <div className="flex items-end justify-between animate-stagger-1">
        <div>
          <h1 className="font-display text-2xl text-slate-900 tracking-tight">
            Command Centre
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Live overview · Last refreshed {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-medium text-emerald-600">Live</span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* ROW 1 — PULSE METRICS                                  */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {pulseCards.map(({ label, value, delta, sparkData, palette, icon: Icon, alert }, i) => (
          <div
            key={label}
            className={`card p-5 group hover:shadow-card-hover transition-all duration-300 animate-stagger-${i + 1} relative overflow-hidden`}
            style={{ borderLeft: `3px solid ${palette.accent}` }}
          >
            {/* Glow accent */}
            <div
              className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
              style={{ backgroundColor: palette.glow }}
            />

            <div className="flex items-start justify-between relative">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon size={13} style={{ color: palette.text }} strokeWidth={2} />
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wide">{label}</p>
                </div>
                <div className="flex items-baseline gap-3">
                  <p className="font-display text-3xl text-slate-900 leading-none">{value}</p>
                  <Delta value={delta} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">vs yesterday</p>
              </div>

              <Sparkline data={sparkData} color={palette.accent} />
            </div>

            {/* Pulse dot for SLA breaches */}
            {alert && (
              <div className="absolute top-3 right-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* ROW 2 — PERFORMANCE METRICS                            */}
      {/* ════════════════════════════════════════════════════════ */}
      <SectionTitle icon={TrendingUp} title="Performance" subtitle="Against SLA targets" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {perfCards.map(({ label, value, target, status, trend, trendLabel, icon: Icon, suffix }, i) => {
          const statusColor = status === 'green' ? PALETTE.green : status === 'amber' ? PALETTE.amber : PALETTE.red
          return (
            <div
              key={label}
              className={`card p-5 group hover:shadow-card-hover transition-all duration-300 animate-stagger-${i + 1}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: statusColor.bg }}
                  >
                    <Icon size={15} style={{ color: statusColor.text }} strokeWidth={1.8} />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{label}</p>
                </div>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                >
                  {target}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <p className="font-display text-3xl text-slate-900 leading-none">{value}</p>
                {suffix && <span className="text-sm text-slate-400 font-medium">{suffix}</span>}
              </div>

              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[var(--border)]">
                {trend < 0 ? (
                  <TrendingDown size={13} className="text-emerald-500" />
                ) : (
                  <TrendingUp size={13} className="text-emerald-500" />
                )}
                <span className="text-[11px] font-medium text-emerald-600">
                  {Math.abs(trend)}% faster
                </span>
                <span className="text-[10px] text-slate-400 ml-1">{trendLabel}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* ROW 3 — DISTRIBUTION CHARTS                            */}
      {/* ════════════════════════════════════════════════════════ */}
      <SectionTitle icon={BarChart3} title="Distribution" subtitle="Where tickets stand" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Volume over time */}
        <div className="card p-5 animate-stagger-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-700">Ticket Volume</p>
            <RangeToggle value={volumeRange} onChange={setVolumeRange} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={volumeData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} fill="url(#gradCreated)" name="Created" dot={false} />
              <Area type="monotone" dataKey="resolved" stroke="#16a34a" strokeWidth={2} fill="url(#gradResolved)" name="Resolved" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-[10px] text-slate-500 font-medium">Created</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-[10px] text-slate-500 font-medium">Resolved</span>
            </div>
          </div>
        </div>

        {/* Status donut */}
        <div className="card p-5 animate-stagger-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-700">By Status</p>
            <RangeToggle value={statusRange} onChange={setStatusRange} />
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Center label */}
          <div className="text-center -mt-[118px] mb-[72px] pointer-events-none relative z-10">
            <p className="font-display text-2xl text-slate-900">{tickets.length}</p>
            <p className="text-[10px] text-slate-400 font-medium">Total</p>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.fill }} />
                <span className="text-[10px] text-slate-500 font-medium">{s.name}</span>
                <span className="text-[10px] font-semibold text-slate-700 ml-auto">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority horizontal bar */}
        <div className="card p-5 animate-stagger-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-700">By Priority</p>
            <RangeToggle value={priorityRange} onChange={setPriorityRange} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData} layout="vertical" margin={{ top: 0, right: 8, left: 4, bottom: 0 }} barSize={20}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} width={54} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} name="Tickets">
                {priorityData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* ROW 4 — LIVE FEEDS                                     */}
      {/* ════════════════════════════════════════════════════════ */}
      <SectionTitle icon={Radio} title="Live Feeds" subtitle="Real-time workspace activity" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* SLA Watchlist */}
        <div className="card p-5 animate-stagger-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                <Shield size={14} className="text-red-500" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">SLA Watchlist</p>
                <p className="text-[10px] text-slate-400">Expiring within 2 hours</p>
              </div>
            </div>
            <button
              onClick={() => setSlaRefresh((p) => p + 1)}
              className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors"
              title="Refresh"
            >
              <RefreshCw size={12} className="text-slate-400" />
            </button>
          </div>

          {slaWatchlist.length === 0 ? (
            <EmptyState message="No breaches today — clean slate!" color="green" />
          ) : (
            <div className="space-y-2">
              {slaWatchlist.map((t) => {
                const sla = slaLabel(t.slaDeadline)
                const isBreached = t.slaDeadline < Date.now()
                return (
                  <button
                    key={t.id}
                    onClick={() => dispatch(selectTicket(t.id))}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 hover:shadow-sm ${
                      isBreached ? 'bg-red-50/60 hover:bg-red-50' : 'bg-amber-50/40 hover:bg-amber-50'
                    }`}
                  >
                    {isBreached && (
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                      </span>
                    )}
                    <span className="text-xs font-mono text-slate-400 w-10 shrink-0">{t.id}</span>
                    <span className="text-xs text-slate-700 flex-1 truncate font-medium">{t.title}</span>
                    <span className={`text-xs font-bold shrink-0 tabular-nums ${sla.color}`}>
                      {sla.label}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="card p-5 animate-stagger-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                <Activity size={14} className="text-violet-500" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Activity Feed</p>
                <p className="text-[10px] text-slate-400">Last 10 events</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {mockActivity.map((evt, i) => (
              <div
                key={evt.id}
                className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0 group hover:bg-cream-50 rounded-lg px-2 -mx-2 transition-colors"
              >
                <ActivityIcon type={evt.type} />
                <p className="text-xs text-slate-600 flex-1 truncate">{evt.text}</p>
                <span className="text-[10px] text-slate-400 shrink-0 tabular-nums font-medium">
                  {timeAgo(evt.time)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* ROW 5 — TEAM OVERVIEW (manager/admin only)             */}
      {/* ════════════════════════════════════════════════════════ */}
      {isManager && (
        <>
          <SectionTitle icon={Users} title="Team Overview" subtitle="Manager & admin view" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Agent Workload */}
            <div className="card p-5 animate-stagger-1">
              <p className="text-sm font-semibold text-slate-700 mb-4">Agent Workload</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={workloadData} barSize={28} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="open" radius={[6, 6, 0, 0]} name="Open">
                    {workloadData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Leaderboard */}
            <div className="card p-5 animate-stagger-2">
              <p className="text-sm font-semibold text-slate-700 mb-4">Resolution Leaderboard</p>
              <div className="space-y-3">
                {leaderboard.map((m, i) => {
                  const medals = ['🥇', '🥈', '🥉']
                  return (
                    <div key={m.id} className="flex items-center gap-3">
                      <span className="text-base w-6 text-center shrink-0">
                        {medals[i] || <span className="text-xs text-slate-400 font-mono">#{i + 1}</span>}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-[11px] font-bold text-amber-700 shrink-0">
                        {m.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{m.name}</p>
                        <p className="text-[10px] text-slate-400">{m.avgResponse} avg</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-slate-800 tabular-nums">{m.resolved}</p>
                        <p className="text-[10px] text-emerald-600 font-medium">
                          <ArrowUpRight size={10} className="inline" /> this week
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Response Heatmap */}
            <div className="card p-5 animate-stagger-3">
              <p className="text-sm font-semibold text-slate-700 mb-4">Volume Heatmap</p>
              <div className="space-y-1">
                {/* Header row */}
                <div className="grid gap-1" style={{ gridTemplateColumns: '36px repeat(12, 1fr)' }}>
                  <div />
                  {Array.from({ length: 12 }, (_, i) => (
                    <span key={i} className="text-[9px] text-slate-400 text-center font-medium">
                      {i + 8}
                    </span>
                  ))}
                </div>
                {/* Data rows */}
                {heatmapData.map((row, di) => (
                  <div key={di} className="grid gap-1" style={{ gridTemplateColumns: '36px repeat(12, 1fr)' }}>
                    <span className="text-[10px] text-slate-500 font-medium flex items-center">{row[0].day}</span>
                    {row.map((cell, hi) => (
                      <HeatCell key={hi} value={cell.value} />
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                <span className="text-[9px] text-slate-400">Less</span>
                <div className="flex gap-1">
                  {[0.08, 0.25, 0.45, 0.65, 0.85].map((op, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-[2px]"
                      style={{ backgroundColor: `rgba(217,119,6,${op})` }}
                    />
                  ))}
                </div>
                <span className="text-[9px] text-slate-400">More</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* ROW 6 — SOURCE & CHANNEL INTELLIGENCE                  */}
      {/* ════════════════════════════════════════════════════════ */}
      <SectionTitle icon={Globe} title="Source & Channel Intelligence" subtitle="Where tickets come from" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Ticket Sources */}
        <div className="card p-5 animate-stagger-1">
          <p className="text-sm font-semibold text-slate-700 mb-4">Ticket Sources</p>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {sourceData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-5 mt-2">
            {sourceData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.fill }} />
                <span className="text-[11px] text-slate-500 font-medium">{s.name}</span>
                <span className="text-[11px] font-bold text-slate-700">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Backlog Growth */}
        <div className="card p-5 animate-stagger-2">
          <p className="text-sm font-semibold text-slate-700 mb-4">Backlog Growth</p>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={backlogData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradBacklog" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d97706" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#d97706" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="backlog" stroke="#d97706" strokeWidth={2} fill="url(#gradBacklog)" name="Net Open" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Companies */}
        <div className="card p-5 animate-stagger-3">
          <p className="text-sm font-semibold text-slate-700 mb-4">Top Companies</p>
          {topCompanies.length === 0 ? (
            <EmptyState message="No company data" color="slate" />
          ) : (
            <div className="space-y-3">
              {topCompanies.map((c, i) => {
                const maxCount = topCompanies[0]?.count || 1
                const pct = (c.count / maxCount) * 100
                return (
                  <div key={c.company}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <Building2 size={11} className="text-slate-500" />
                        </div>
                        <span className="text-xs font-medium text-slate-700">{c.company}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 tabular-nums">
                        {c.count} {c.count === 1 ? 'ticket' : 'tickets'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, #d97706, #f59e0b)`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
