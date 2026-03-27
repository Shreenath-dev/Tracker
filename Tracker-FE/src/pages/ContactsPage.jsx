import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Search, Plus, X, Mail, Phone, Building2, User, Eye, ThumbsUp, Share2, MoreHorizontal, Paperclip, Link as LinkIcon, ChevronDown } from 'lucide-react'
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
            <div className="w-full max-w-5xl h-[85vh] bg-white rounded-xl shadow-2xl flex flex-col animate-fade-up overflow-hidden" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <User size={16} className="text-amber-600" />
                  <span className="hover:underline cursor-pointer">CON-{selected.id.substring(0, 4)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"><Eye size={16}/></button>
                  <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"><ThumbsUp size={16}/></button>
                  <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"><Share2 size={16}/></button>
                  <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"><MoreHorizontal size={16}/></button>
                  <div className="w-px h-4 bg-slate-200 mx-1" />
                  <button onClick={() => setSelected(null)} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"><X size={18} /></button>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 overflow-hidden">
                {/* Main Content (Left) */}
                <div className="flex-1 overflow-y-auto p-8 pr-10">
                  <h1 className="font-display text-2xl text-slate-900 mb-6">{selected.name}</h1>
                  
                  <div className="flex items-center gap-2 mb-8">
                    <button className="btn-secondary py-1.5 px-3 mb-1 text-sm font-medium flex items-center gap-1.5 bg-slate-100 border-none hover:bg-slate-200 text-slate-700"><Paperclip size={14}/> Attach</button>
                    <button className="btn-secondary py-1.5 px-3 mb-1 text-sm font-medium flex items-center gap-1.5 bg-slate-100 border-none hover:bg-slate-200 text-slate-700"><Mail size={14}/> Send Email</button>
                    <button className="btn-secondary py-1.5 px-3 mb-1 text-sm font-medium flex items-center gap-1.5 bg-slate-100 border-none hover:bg-slate-200 text-slate-700"><LinkIcon size={14}/> Link item <ChevronDown size={14} className="ml-1 opacity-50"/></button>
                    <button className="btn-secondary py-1.5 px-2 mb-1 text-sm font-medium flex items-center justify-center bg-slate-100 border-none hover:bg-slate-200 text-slate-700"><MoreHorizontal size={16}/></button>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-800 mb-2">Description / Notes</h3>
                  <p className="text-sm text-slate-500 mb-8 whitespace-pre-wrap hover:bg-slate-50 p-2 -mx-2 rounded cursor-text transition-colors">{selected.notes || 'Add notes...'}</p>

                  <h3 className="text-sm font-semibold text-slate-800 mb-4">Activity</h3>
                  <div className="flex items-center justify-between border-b border-slate-200 mb-4 pb-0 text-sm">
                    <div className="flex gap-4">
                      <span className="text-slate-500 py-1">Show:</span>
                      <button className="px-1 py-1 font-medium text-slate-600 hover:text-slate-800 transition-colors bg-slate-100 rounded-sm mb-1">All</button>
                      <button className="px-1 py-1 font-medium text-blue-600 border-b-2 border-blue-600 rounded-sm bg-blue-50/50 mb-[-1px]">Comments</button>
                      <button className="px-1 py-1 font-medium text-slate-600 hover:text-slate-800 transition-colors mb-1 rounded-sm">History</button>
                      <button className="px-1 py-1 font-medium text-slate-600 hover:text-slate-800 transition-colors mb-1 rounded-sm">Work log</button>
                    </div>
                    <button className="text-slate-500 text-xs font-medium flex items-center gap-1">Newest first <ChevronDown size={12}/></button>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold shrink-0 text-sm">{'U'}</div>
                    <div className="flex-1 border border-slate-200 rounded p-3 text-sm text-slate-400 hover:bg-slate-50 cursor-text transition-colors shadow-sm">
                      Add a comment...
                      <p className="text-[10px] text-slate-400 mt-2 font-medium bg-transparent border-none p-0 inline-block">Pro tip: press <span className="font-bold bg-slate-200 text-slate-600 px-1 rounded mx-0.5">M</span> to comment</p>
                    </div>
                  </div>
                </div>

                {/* Sidebar (Right) */}
                <div className="w-[340px] bg-white border-l border-slate-200 overflow-y-auto p-6 scrollbar-thin">
                  <div className="mb-6 flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded flex items-center justify-between text-sm font-medium transition-colors shadow-sm">
                      Active <ChevronDown size={14} />
                    </button>
                    <button className="px-3 py-1.5 rounded text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1 shadow-sm">
                      <span className="font-mono opacity-50 mr-1">⚡</span> Actions <ChevronDown size={14}/>
                    </button>
                  </div>

                  <div className="border border-[var(--border)] rounded bg-white mb-6">
                    <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors font-medium text-sm text-slate-800">
                      Details
                      <ChevronDown size={16} className="text-slate-400" />
                    </div>
                    <div className="p-4 space-y-5">
                      <div>
                        <p className="text-xs text-slate-500 mb-1.5 font-medium">Company</p>
                        <div className="flex items-center gap-2 p-1 bg-slate-50 border border-slate-200 rounded max-w-max shadow-sm">
                          <span className="text-sm font-medium text-slate-700 px-2 flex items-center gap-1"><Building2 size={14} className="text-slate-400"/> {selected.company || 'None'}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 mb-1 font-medium">Email</p>
                        <span className="text-sm text-slate-700 flex items-center gap-2"><Mail size={14} className="text-slate-400"/> {selected.email}</span>
                      </div>
                      
                      {selected.phone && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1 font-medium">Phone</p>
                          <span className="text-sm text-slate-700 flex items-center gap-2"><Phone size={14} className="text-slate-400"/> {selected.phone}</span>
                        </div>
                      )}

                      <div className="border-t border-slate-100 pt-5 mt-5">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-slate-500 font-medium">Tickets</p>
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{contactTickets.length}</span>
                          </div>
                          <div className="space-y-2">
                            {contactTickets.length === 0 && <p className="text-sm text-slate-400 italic bg-slate-50 p-3 rounded border border-dashed border-slate-200 text-center">No tickets yet.</p>}
                            {contactTickets.map(t => (
                              <div key={t.id} className="flex flex-col gap-1 p-2 bg-slate-50 border border-slate-200 rounded hover:border-amber-300 transition-colors cursor-pointer group shadow-sm">
                                <span className="font-mono text-[10px] text-slate-400">{t.id}</span>
                                <span className="text-xs font-medium text-slate-700 group-hover:text-amber-700 leading-tight">
                                  {t.title}
                                </span>
                              </div>
                            ))}
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
