import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Search, Plus, X, Mail, Phone, Building2 } from 'lucide-react'
import { setSearch, createContact } from '../store/slices/contactsSlice'

function ContactModal({ onClose }) {
  const dispatch = useDispatch()
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', notes: '' })

  function submit(e) {
    e.preventDefault()
    if (!form.name || !form.email) return
    dispatch(createContact(form))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
      <div className="card w-full max-w-md mx-4 animate-fade-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="font-display text-lg text-slate-900">New Contact</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Name *</label>
              <input className="input-base" placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Email *</label>
              <input className="input-base" type="email" placeholder="email@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Company</label>
              <input className="input-base" placeholder="Company name" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone</label>
              <input className="input-base" placeholder="+1 555-0100" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Notes</label>
            <textarea className="input-base resize-none" rows={2} placeholder="Internal notes..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Contact</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ContactsPage() {
  const dispatch = useDispatch()
  const { items, search } = useSelector(s => s.contacts)
  const tickets = useSelector(s => s.tickets.items)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(null)

  const filtered = items.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.company?.toLowerCase().includes(search.toLowerCase())
  )

  const contactTickets = selected ? tickets.filter(t => t.contact === selected.id) : []

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="relative w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input-base pl-8" placeholder="Search contacts..." value={search} onChange={e => dispatch(setSearch(e.target.value))} />
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-1.5 ml-auto">
          <Plus size={14} /> New Contact
        </button>
      </div>

      <div className="flex gap-4">
        {/* Contact list */}
        <div className="flex-1 card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-cream-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tickets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map(c => {
                const ticketCount = tickets.filter(t => t.contact === c.id).length
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={`cursor-pointer hover:bg-cream-50 transition-colors ${selected?.id === c.id ? 'bg-amber-50' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-semibold shrink-0">{c.name.charAt(0)}</div>
                        <span className="font-medium text-slate-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{c.company || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{c.email}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{ticketCount}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Contact detail */}
        {selected && (
          <div className="w-72 shrink-0 card p-5 space-y-4 animate-fade-up self-start">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold">{selected.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{selected.name}</p>
                  <p className="text-xs text-slate-400">{selected.company}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600"><Mail size={12} />{selected.email}</div>
              {selected.phone && <div className="flex items-center gap-2 text-slate-600"><Phone size={12} />{selected.phone}</div>}
              {selected.company && <div className="flex items-center gap-2 text-slate-600"><Building2 size={12} />{selected.company}</div>}
            </div>
            {selected.notes && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Notes</p>
                <p className="text-xs text-slate-600 leading-relaxed">{selected.notes}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Tickets ({contactTickets.length})</p>
              <div className="space-y-1.5">
                {contactTickets.length === 0 && <p className="text-xs text-slate-400 italic">No tickets yet.</p>}
                {contactTickets.map(t => (
                  <div key={t.id} className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-slate-400">{t.id}</span>
                    <span className="text-slate-700 truncate flex-1">{t.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
