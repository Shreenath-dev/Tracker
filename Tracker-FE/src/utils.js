export function priorityBadge(p) {
  const map = { urgent: 'badge-urgent', high: 'badge-high', medium: 'badge-medium', low: 'badge-low' }
  return map[p] || 'badge-low'
}

export function statusBadge(s) {
  const map = { open: 'status-open', inprogress: 'status-inprogress', waiting: 'status-waiting', resolved: 'status-resolved' }
  return map[s] || 'status-open'
}

export function statusLabel(s) {
  const map = { open: 'Open', inprogress: 'In Progress', waiting: 'Waiting', resolved: 'Resolved' }
  return map[s] || s
}

export function timeAgo(ts) {
  const diff = Date.now() - ts
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

export function slaLabel(deadline) {
  const diff = deadline - Date.now()
  if (diff < 0) return { label: 'Breached', color: 'text-red-600' }
  if (diff < 1800000) return { label: `${Math.ceil(diff / 60000)}m`, color: 'text-amber-600' }
  if (diff < 86400000) return { label: `${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m`, color: 'text-slate-500' }
  return { label: `${Math.floor(diff / 86400000)}d`, color: 'text-slate-400' }
}
