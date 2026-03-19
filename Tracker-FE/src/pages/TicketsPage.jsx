import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LayoutGrid, List, Search, ChevronDown, Trash2, UserCheck, Tag } from 'lucide-react'
import { selectTicket, setView, setFilter, toggleSelectTicket, clearSelection, bulkUpdate, deleteTicket, moveTicket } from '../store/slices/ticketsSlice'
import TicketDrawer from '../components/tickets/TicketDrawer'
import { priorityBadge, statusBadge, statusLabel, timeAgo, slaLabel } from '../utils'

const COLUMNS = ['open', 'inprogress', 'waiting', 'resolved']
const colLabels = { open: 'Open', inprogress: 'In Progress', waiting: 'Waiting', resolved: 'Resolved' }
const colColors = { open: 'border-blue-400', inprogress: 'border-violet-400', waiting: 'border-amber-400', resolved: 'border-green-400' }

function KanbanCard({ ticket, contacts, onOpen }) {
  const contact = contacts.find(c => c.id === ticket.contact)
  const sla = slaLabel(ticket.slaDeadline)
  return (
    <div
      onClick={() => onOpen(ticket.id)}
      className="card p-3.5 cursor-pointer hover:shadow-card-hover transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-mono text-slate-400">{ticket.id}</span>
        <span className={priorityBadge(ticket.priority)}>{ticket.priority}</span>
      </div>
      <p className="text-sm font-medium text-slate-800 leading-snug mb-2 group-hover:text-amber-700 transition-colors">{ticket.title}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{contact?.name || '—'}</span>
        <span className={`text-xs font-medium ${sla.color}`}>{sla.label}</span>
      </div>
      {ticket.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {ticket.tags.slice(0, 2).map(t => (
            <span key={t} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{t}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TicketsPage() {
  const dispatch = useDispatch()
  const { items, view, filters, selectedIds, selectedId } = useSelector(s => s.tickets)
  const contacts = useSelector(s => s.contacts.items)
  const members = useSelector(s => s.team.members)
  const [dragOver, setDragOver] = useState(null)
  const [dragging, setDragging] = useState(null)
  const [bulkAction, setBulkAction] = useState('')

  const filtered = items.filter(t => {
    if (filters.status && t.status !== filters.status) return false
    if (filters.priority && t.priority !== filters.priority) return false
    if (filters.assignee && t.assignee !== filters.assignee) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!t.title.toLowerCase().includes(q) && !t.description?.toLowerCase().includes(q)) return false
    }
    return true
  })

  function applyBulk() {
    if (!bulkAction || selectedIds.length === 0) return
    if (bulkAction === 'delete') {
      selectedIds.forEach(id => dispatch(deleteTicket(id)))
      dispatch(clearSelection())
    } else {
      const [field, value] = bulkAction.split(':')
      dispatch(bulkUpdate({ ids: selectedIds, changes: { [field]: value } }))
    }
    setBulkAction('')
  }

  return (
    <div className="space-y-4 w-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input-base pl-8"
            placeholder="Search tickets..."
            value={filters.search}
            onChange={e => dispatch(setFilter({ search: e.target.value }))}
          />
        </div>

        <select className="input-base w-auto text-sm" value={filters.status} onChange={e => dispatch(setFilter({ status: e.target.value }))}>
          <option value="">All statuses</option>
          {COLUMNS.map(s => <option key={s} value={s}>{colLabels[s]}</option>)}
        </select>

        <select className="input-base w-auto text-sm" value={filters.priority} onChange={e => dispatch(setFilter({ priority: e.target.value }))}>
          <option value="">All priorities</option>
          {['urgent', 'high', 'medium', 'low'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </select>

        <select className="input-base w-auto text-sm" value={filters.assignee} onChange={e => dispatch(setFilter({ assignee: e.target.value }))}>
          <option value="">All assignees</option>
          {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>

        <div className="ml-auto flex items-center gap-1 bg-white border border-[var(--border)] rounded-lg p-1">
          <button onClick={() => dispatch(setView('list'))} className={`p-1.5 rounded transition-colors ${view === 'list' ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:text-slate-700'}`}><List size={15} /></button>
          <button onClick={() => dispatch(setView('kanban'))} className={`p-1.5 rounded transition-colors ${view === 'kanban' ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:text-slate-700'}`}><LayoutGrid size={15} /></button>
        </div>
      </div>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg animate-fade-up">
          <span className="text-sm font-medium text-amber-800">{selectedIds.length} selected</span>
          <select className="input-base w-auto text-sm py-1" value={bulkAction} onChange={e => setBulkAction(e.target.value)}>
            <option value="">Bulk action...</option>
            <option value="status:resolved">Mark Resolved</option>
            <option value="status:open">Mark Open</option>
            <option value="priority:urgent">Set Urgent</option>
            <option value="priority:low">Set Low</option>
            <option value="delete">Delete</option>
          </select>
          <button onClick={applyBulk} className="btn-primary py-1 text-xs">Apply</button>
          <button onClick={() => dispatch(clearSelection())} className="text-xs text-slate-500 hover:text-slate-700 ml-auto">Clear</button>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="card overflow-hidden animate-fade-up">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-cream-50">
                <th className="w-8 px-4 py-3"><input type="checkbox" className="rounded" onChange={e => { if (!e.target.checked) dispatch(clearSelection()) }} /></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Assignee</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">SLA</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map(t => {
                const contact = contacts.find(c => c.id === t.contact)
                const assignee = members.find(m => m.id === t.assignee)
                const sla = slaLabel(t.slaDeadline)
                const isSelected = selectedIds.includes(t.id)
                return (
                  <tr
                    key={t.id}
                    className={`hover:bg-cream-50 transition-colors cursor-pointer ${isSelected ? 'bg-amber-50' : ''}`}
                  >
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => dispatch(toggleSelectTicket(t.id))}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400" onClick={() => dispatch(selectTicket(t.id))}>{t.id}</td>
                    <td className="px-4 py-3 max-w-xs" onClick={() => dispatch(selectTicket(t.id))}>
                      <p className="font-medium text-slate-800 truncate hover:text-amber-700 transition-colors">{t.title}</p>
                      {t.tags?.length > 0 && (
                        <div className="flex gap-1 mt-0.5">
                          {t.tags.slice(0, 2).map(tag => <span key={tag} className="text-xs text-slate-400">{tag}</span>)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600" onClick={() => dispatch(selectTicket(t.id))}>{contact?.name || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-600" onClick={() => dispatch(selectTicket(t.id))}>{assignee?.name || 'Unassigned'}</td>
                    <td className="px-4 py-3" onClick={() => dispatch(selectTicket(t.id))}><span className={priorityBadge(t.priority)}>{t.priority}</span></td>
                    <td className="px-4 py-3" onClick={() => dispatch(selectTicket(t.id))}><span className={statusBadge(t.status)}>{statusLabel(t.status)}</span></td>
                    <td className={`px-4 py-3 text-xs font-medium ${sla.color}`} onClick={() => dispatch(selectTicket(t.id))}>{sla.label}</td>
                    <td className="px-4 py-3 text-xs text-slate-400" onClick={() => dispatch(selectTicket(t.id))}>{timeAgo(t.createdAt)}</td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-400">No tickets match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="grid grid-cols-4 gap-4 animate-fade-up">
          {COLUMNS.map(col => {
            const colTickets = filtered.filter(t => t.status === col)
            return (
              <div
                key={col}
                className={`rounded-xl border-t-2 ${colColors[col]} bg-cream-50 border border-[var(--border)] p-3 min-h-96`}
                onDragOver={e => { e.preventDefault(); setDragOver(col) }}
                onDrop={() => {
                  if (dragging) dispatch(moveTicket({ id: dragging, status: col }))
                  setDragOver(null)
                  setDragging(null)
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{colLabels[col]}</span>
                  <span className="text-xs bg-white border border-[var(--border)] text-slate-500 px-1.5 py-0.5 rounded-full">{colTickets.length}</span>
                </div>
                <div className={`space-y-2 transition-all ${dragOver === col ? 'ring-2 ring-amber-300 ring-offset-2 rounded-lg' : ''}`}>
                  {colTickets.map(t => (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={() => setDragging(t.id)}
                      onDragEnd={() => { setDragging(null); setDragOver(null) }}
                    >
                      <KanbanCard ticket={t} contacts={contacts} onOpen={id => dispatch(selectTicket(id))} />
                    </div>
                  ))}
                  {colTickets.length === 0 && (
                    <div className="text-xs text-slate-400 text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">Drop here</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedId && <TicketDrawer />}
    </div>
  )
}
