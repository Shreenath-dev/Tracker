import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { X, Send, Lock, Globe, Clock } from 'lucide-react'
import { closeTicket, updateTicket, addReply } from '../../store/slices/ticketsSlice'
import { priorityBadge, statusBadge, statusLabel, timeAgo, slaLabel } from '../../utils'

const statuses = ['open', 'inprogress', 'waiting', 'resolved']
const priorities = ['urgent', 'high', 'medium', 'low']

export default function TicketDrawer() {
  const dispatch = useDispatch()
  const { selectedId, items, replies } = useSelector(s => s.tickets)
  const contacts = useSelector(s => s.contacts.items)
  const members = useSelector(s => s.team.members)
  const ticket = items.find(t => t.id === selectedId)
  const [replyText, setReplyText] = useState('')
  const [replyType, setReplyType] = useState('client')

  if (!ticket) return null

  const contact = contacts.find(c => c.id === ticket.contact)
  const assignee = members.find(m => m.id === ticket.assignee)
  const threadReplies = replies[ticket.id] || []
  const sla = slaLabel(ticket.slaDeadline)

  function sendReply() {
    if (!replyText.trim()) return
    dispatch(addReply({ ticketId: ticket.id, reply: { author: 'Alex Morgan', type: replyType, content: replyText } }))
    setReplyText('')
  }

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-slate-900/20 backdrop-blur-sm" onClick={() => dispatch(closeTicket())} />
      <div className="w-[520px] h-full bg-white shadow-drawer flex flex-col animate-slide-in overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-slate-400">{ticket.id}</span>
              <span className={statusBadge(ticket.status)}>{statusLabel(ticket.status)}</span>
              <span className={priorityBadge(ticket.priority)}>{ticket.priority}</span>
            </div>
            <h2 className="font-display text-lg text-slate-900 leading-snug">{ticket.title}</h2>
          </div>
          <button onClick={() => dispatch(closeTicket())} className="text-slate-400 hover:text-slate-700 mt-1 shrink-0"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Meta */}
          <div className="px-6 py-4 border-b border-[var(--border)] grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-400 mb-1">Status</p>
              <select
                className="input-base text-xs py-1.5"
                value={ticket.status}
                onChange={e => dispatch(updateTicket({ id: ticket.id, status: e.target.value }))}
              >
                {statuses.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Priority</p>
              <select
                className="input-base text-xs py-1.5"
                value={ticket.priority}
                onChange={e => dispatch(updateTicket({ id: ticket.id, priority: e.target.value }))}
              >
                {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Assignee</p>
              <select
                className="input-base text-xs py-1.5"
                value={ticket.assignee || ''}
                onChange={e => dispatch(updateTicket({ id: ticket.id, assignee: e.target.value }))}
              >
                <option value="">Unassigned</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">SLA</p>
              <div className={`flex items-center gap-1.5 text-xs font-medium ${sla.color}`}>
                <Clock size={12} />
                {sla.label}
              </div>
            </div>
          </div>

          {/* Contact */}
          {contact && (
            <div className="px-6 py-3 border-b border-[var(--border)]">
              <p className="text-xs text-slate-400 mb-1">Contact</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-semibold">{contact.name.charAt(0)}</div>
                <div>
                  <p className="text-xs font-medium text-slate-800">{contact.name}</p>
                  <p className="text-xs text-slate-400">{contact.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {ticket.tags?.length > 0 && (
            <div className="px-6 py-3 border-b border-[var(--border)]">
              <p className="text-xs text-slate-400 mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {ticket.tags.map(tag => (
                  <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {ticket.description && (
            <div className="px-6 py-4 border-b border-[var(--border)]">
              <p className="text-xs text-slate-400 mb-2">Description</p>
              <p className="text-sm text-slate-700 leading-relaxed">{ticket.description}</p>
            </div>
          )}

          {/* Thread */}
          <div className="px-6 py-4 space-y-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Thread</p>
            {threadReplies.length === 0 && (
              <p className="text-xs text-slate-400 italic">No replies yet.</p>
            )}
            {threadReplies.map(r => (
              <div key={r.id} className={`rounded-lg p-3 text-sm ${r.type === 'internal' ? 'bg-amber-50 border border-amber-100' : 'bg-slate-50 border border-[var(--border)]'}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  {r.type === 'internal' ? <Lock size={11} className="text-amber-500" /> : <Globe size={11} className="text-slate-400" />}
                  <span className="text-xs font-medium text-slate-700">{r.author}</span>
                  <span className="text-xs text-slate-400 ml-auto">{timeAgo(r.createdAt)}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{r.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reply box */}
        <div className="px-6 py-4 border-t border-[var(--border)] bg-cream-50">
          <div className="flex gap-2 mb-2">
            {['client', 'internal'].map(t => (
              <button
                key={t}
                onClick={() => setReplyType(t)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${replyType === t ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 border border-[var(--border)]'}`}
              >
                {t === 'client' ? '↗ Client reply' : '🔒 Internal note'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <textarea
              className="input-base resize-none flex-1 text-sm"
              rows={2}
              placeholder={replyType === 'internal' ? 'Add an internal note...' : 'Reply to client...'}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) sendReply() }}
            />
            <button onClick={sendReply} className="btn-primary self-end flex items-center gap-1.5">
              <Send size={13} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
