import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { X } from 'lucide-react'
import { createTicket } from '../../store/slices/ticketsSlice'

export default function CreateTicketModal({ onClose }) {
  const dispatch = useDispatch()
  const contacts = useSelector(s => s.contacts.items)
  const members = useSelector(s => s.team.members)
  const [form, setForm] = useState({ title: '', description: '', contact: '', assignee: '', priority: 'medium', tags: '', status: 'open' })

  const slaMap = { urgent: 3600000, high: 14400000, medium: 86400000, low: 259200000 }

  function submit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    dispatch(createTicket({
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      source: 'manual',
      slaDeadline: Date.now() + slaMap[form.priority],
    }))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
      <div className="card w-full max-w-lg mx-4 animate-fade-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="font-display text-lg text-slate-900">New Ticket</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Title *</label>
            <input className="input-base" placeholder="Describe the issue briefly" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Description</label>
            <textarea className="input-base resize-none" rows={3} placeholder="More details..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Contact</label>
              <select className="input-base" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}>
                <option value="">— Select —</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Assignee</label>
              <select className="input-base" value={form.assignee} onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}>
                <option value="">— Unassigned —</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Priority</label>
              <select className="input-base" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Tags</label>
              <input className="input-base" placeholder="bug, auth, ui" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Ticket</button>
          </div>
        </form>
      </div>
    </div>
  )
}
