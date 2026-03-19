import { useState } from 'react'
import { useSelector } from 'react-redux'
import { User, Bell, Lock, Building2, Sliders, FileText, CreditCard } from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'workspace', label: 'Workspace', icon: Building2, adminOnly: true },
  { id: 'sla', label: 'SLA Rules', icon: Sliders, adminOnly: true },
  { id: 'canned', label: 'Canned Responses', icon: FileText, adminOnly: true },
  { id: 'billing', label: 'Billing', icon: CreditCard, adminOnly: true },
]

const notifEvents = [
  { id: 'assignment', label: 'Ticket assigned to me' },
  { id: 'reply', label: 'Reply received on my ticket' },
  { id: 'sla_warning', label: 'SLA warning (30 min before breach)' },
  { id: 'sla_breach', label: 'SLA breached' },
  { id: 'status_change', label: 'Ticket status changed by teammate' },
]

const defaultSLA = { urgent: 1, high: 4, medium: 24, low: 72 }

const mockCanned = [
  { id: 'cr1', name: 'Acknowledge receipt', body: 'Thank you for reaching out. We have received your request and will get back to you shortly.' },
  { id: 'cr2', name: 'Request more info', body: 'Could you please provide more details about the issue you are experiencing?' },
]

export default function SettingsPage() {
  const user = useSelector(s => s.auth.user)
  const [tab, setTab] = useState('profile')
  const [profile, setProfile] = useState({ name: user?.name || '', timezone: 'UTC-5', language: 'English' })
  const [notifs, setNotifs] = useState({ assignment: { email: true, inapp: true }, reply: { email: true, inapp: true }, sla_warning: { email: false, inapp: true }, sla_breach: { email: true, inapp: true }, status_change: { email: false, inapp: true } })
  const [sla, setSla] = useState(defaultSLA)
  const [workspace, setWorkspace] = useState({ name: user?.workspace || '', industry: '', size: '' })
  const [canned, setCanned] = useState(mockCanned)
  const [newCanned, setNewCanned] = useState({ name: '', body: '' })
  const [saved, setSaved] = useState(false)

  const visibleTabs = tabs.filter(t => !t.adminOnly || user?.role === 'admin')

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="w-full flex gap-6">
      {/* Sidebar tabs */}
      <div className="w-44 shrink-0 space-y-0.5">
        {visibleTabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${tab === id ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'text-slate-600 hover:bg-cream-100'}`}
          >
            <Icon size={14} strokeWidth={1.8} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 card p-6 animate-fade-up">
        {tab === 'profile' && (
          <div className="space-y-5">
            <h3 className="font-display text-lg text-slate-900">Profile</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xl font-semibold">{user?.name?.charAt(0)}</div>
              <button className="btn-secondary text-xs">Change avatar</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Full name</label>
                <input className="input-base" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
                <input className="input-base opacity-60 cursor-not-allowed" value={user?.email} disabled />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Timezone</label>
                <select className="input-base" value={profile.timezone} onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))}>
                  {['UTC-8', 'UTC-5', 'UTC+0', 'UTC+1', 'UTC+5:30', 'UTC+8'].map(tz => <option key={tz}>{tz}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Language</label>
                <select className="input-base" value={profile.language} onChange={e => setProfile(p => ({ ...p, language: e.target.value }))}>
                  {['English', 'Spanish', 'French', 'German', 'Japanese'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <button onClick={save} className="btn-primary">{saved ? '✓ Saved' : 'Save changes'}</button>
          </div>
        )}

        {tab === 'notifications' && (
          <div className="space-y-5">
            <h3 className="font-display text-lg text-slate-900">Notifications</h3>
            <div className="overflow-hidden rounded-lg border border-[var(--border)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-cream-50 border-b border-[var(--border)]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Event</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">In-app</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {notifEvents.map(ev => (
                    <tr key={ev.id} className="hover:bg-cream-50">
                      <td className="px-4 py-3 text-slate-700">{ev.label}</td>
                      <td className="px-4 py-3 text-center">
                        <input type="checkbox" checked={notifs[ev.id]?.email} onChange={e => setNotifs(n => ({ ...n, [ev.id]: { ...n[ev.id], email: e.target.checked } }))} className="rounded" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input type="checkbox" checked={notifs[ev.id]?.inapp} onChange={e => setNotifs(n => ({ ...n, [ev.id]: { ...n[ev.id], inapp: e.target.checked } }))} className="rounded" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={save} className="btn-primary">{saved ? '✓ Saved' : 'Save preferences'}</button>
          </div>
        )}

        {tab === 'password' && (
          <div className="space-y-5">
            <h3 className="font-display text-lg text-slate-900">Change Password</h3>
            <div className="space-y-4 max-w-sm">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Current password</label>
                <input className="input-base" type="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">New password</label>
                <input className="input-base" type="password" placeholder="Min. 8 characters" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Confirm new password</label>
                <input className="input-base" type="password" placeholder="••••••••" />
              </div>
              <button onClick={save} className="btn-primary">{saved ? '✓ Updated' : 'Update password'}</button>
            </div>
          </div>
        )}

        {tab === 'workspace' && (
          <div className="space-y-5">
            <h3 className="font-display text-lg text-slate-900">Workspace</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Organisation name</label>
                <input className="input-base" value={workspace.name} onChange={e => setWorkspace(w => ({ ...w, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Industry</label>
                <select className="input-base" value={workspace.industry} onChange={e => setWorkspace(w => ({ ...w, industry: e.target.value }))}>
                  <option value="">Select industry</option>
                  {['SaaS', 'E-commerce', 'Finance', 'Healthcare', 'Education', 'Other'].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Organisation size</label>
                <select className="input-base" value={workspace.size} onChange={e => setWorkspace(w => ({ ...w, size: e.target.value }))}>
                  <option value="">Select size</option>
                  {['1–10', '11–50', '51–200', '201–500', '500+'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button onClick={save} className="btn-primary">{saved ? '✓ Saved' : 'Save changes'}</button>
          </div>
        )}

        {tab === 'sla' && (
          <div className="space-y-5">
            <h3 className="font-display text-lg text-slate-900">SLA Rules</h3>
            <p className="text-sm text-slate-500">Configure default response time targets per priority level.</p>
            <div className="space-y-3">
              {Object.entries(sla).map(([priority, hours]) => (
                <div key={priority} className="flex items-center gap-4">
                  <span className={`w-20 text-xs font-medium px-2 py-1 rounded-full text-center ${priority === 'urgent' ? 'badge-urgent' : priority === 'high' ? 'badge-high' : priority === 'medium' ? 'badge-medium' : 'badge-low'}`}>{priority}</span>
                  <input
                    type="number"
                    className="input-base w-24"
                    value={hours}
                    min={1}
                    onChange={e => setSla(s => ({ ...s, [priority]: Number(e.target.value) }))}
                  />
                  <span className="text-sm text-slate-500">hours</span>
                </div>
              ))}
            </div>
            <button onClick={save} className="btn-primary">{saved ? '✓ Saved' : 'Save SLA rules'}</button>
          </div>
        )}

        {tab === 'canned' && (
          <div className="space-y-5">
            <h3 className="font-display text-lg text-slate-900">Canned Responses</h3>
            <div className="space-y-3">
              {canned.map(cr => (
                <div key={cr.id} className="border border-[var(--border)] rounded-lg p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-slate-800">{cr.name}</p>
                    <button onClick={() => setCanned(c => c.filter(x => x.id !== cr.id))} className="text-slate-300 hover:text-red-500 transition-colors shrink-0"><span className="text-xs">Remove</span></button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cr.body}</p>
                </div>
              ))}
            </div>
            <div className="border border-[var(--border)] rounded-lg p-4 space-y-3 bg-cream-50">
              <p className="text-xs font-medium text-slate-600">New canned response</p>
              <input className="input-base" placeholder="Response name" value={newCanned.name} onChange={e => setNewCanned(c => ({ ...c, name: e.target.value }))} />
              <textarea className="input-base resize-none" rows={3} placeholder="Response body..." value={newCanned.body} onChange={e => setNewCanned(c => ({ ...c, body: e.target.value }))} />
              <button onClick={() => { if (newCanned.name && newCanned.body) { setCanned(c => [...c, { id: `cr${Date.now()}`, ...newCanned }]); setNewCanned({ name: '', body: '' }) } }} className="btn-primary text-xs">Add response</button>
            </div>
          </div>
        )}

        {tab === 'billing' && (
          <div className="space-y-5">
            <h3 className="font-display text-lg text-slate-900">Billing & Plan</h3>
            <div className="border border-amber-200 bg-amber-50 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Pro Plan</p>
                  <p className="text-sm text-slate-600 mt-0.5">Up to 10 agents · Unlimited tickets · All integrations</p>
                </div>
                <span className="font-display text-2xl text-slate-900">$99<span className="text-sm font-body text-slate-500">/mo</span></span>
              </div>
              <div className="mt-4 pt-4 border-t border-amber-200 flex items-center justify-between text-sm">
                <span className="text-slate-600">Next billing date: <strong>Feb 1, 2026</strong></span>
                <button className="btn-secondary text-xs">Manage plan</button>
              </div>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Recent invoices</p>
              {[{ date: 'Jan 1, 2026', amount: '$99.00', status: 'Paid' }, { date: 'Dec 1, 2025', amount: '$99.00', status: 'Paid' }].map(inv => (
                <div key={inv.date} className="flex items-center justify-between py-2.5 border-b border-[var(--border)] last:border-0 text-sm">
                  <span className="text-slate-700">{inv.date}</span>
                  <span className="text-slate-600">{inv.amount}</span>
                  <span className="text-green-600 text-xs font-medium">{inv.status}</span>
                  <button className="text-xs text-amber-600 hover:text-amber-700">Download</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
