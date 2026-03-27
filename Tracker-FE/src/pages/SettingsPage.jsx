import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { User, Bell, Lock, Building2, Sliders, FileText, CreditCard, Shield, Users, Plus, X, Trash2 } from 'lucide-react'
import { addPolicy, removePolicy, updatePolicy, addRole, removeRole, updateRole } from '../store/slices/settingsSlice'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'workspace', label: 'Workspace', icon: Building2, adminOnly: true },
  { id: 'roles', label: 'Roles', icon: Users, adminOnly: true },
  { id: 'policies', label: 'Policies', icon: Shield, adminOnly: true },
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
  const dispatch = useDispatch()
  const user = useSelector(s => s.auth.user)
  const { roles, policies, permissions } = useSelector(s => s.settings)

  const [tab, setTab] = useState('profile')
  const [profile, setProfile] = useState({ name: '' })
  const [notifs, setNotifs] = useState({ assignment: { email: true, inapp: true }, reply: { email: true, inapp: true }, sla_warning: { email: false, inapp: true }, sla_breach: { email: true, inapp: true }, status_change: { email: false, inapp: true } })
  const [sla, setSla] = useState(defaultSLA)
  const [workspace, setWorkspace] = useState({ name: '', industry: '', size: '' })
  const [canned, setCanned] = useState(mockCanned)
  const [newCanned, setNewCanned] = useState({ name: '', body: '' })
  const [saved, setSaved] = useState(false)

  // Modals / forms state for Roles and Policies
  const [showRoleForm, setShowRoleForm] = useState(false)
  const [roleForm, setRoleForm] = useState({ id: null, name: '', policies: [] })

  const [showPolicyForm, setShowPolicyForm] = useState(false)
  const [policyForm, setPolicyForm] = useState({ id: null, name: '', permissions: [] })

  useEffect(() => { if (user?.fullname) setProfile({ name: user.fullname }) }, [user])

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
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xl font-semibold">{user?.fullname?.charAt(0)}</div>
              <button className="btn-secondary text-xs">Change avatar</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Full name</label>
                <input className="input-base" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
                <input className="input-base opacity-60 cursor-not-allowed" value={user?.email || ''} disabled />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Role</label>
                <input className="input-base opacity-60 cursor-not-allowed capitalize" value={user?.role || '—'} disabled />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Email Verification</label>
                <div className="flex items-center gap-2 h-9">
                  {user?.isverified
                    ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">✓ Verified</span>
                    : <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600 border border-red-200">✗ Not Verified</span>
                  }
                </div>
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

        {tab === 'roles' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-slate-900">Roles</h3>
              <button
                onClick={() => { setRoleForm({ id: null, name: '', policies: [] }); setShowRoleForm(true) }}
                className="btn-primary text-xs flex items-center gap-1"
              ><Plus size={14} /> Create Role</button>
            </div>

            {!showRoleForm ? (
              <div className="space-y-3">
                {roles.map(r => (
                  <div key={r.id} className="border border-[var(--border)] rounded-lg p-4 bg-white hover:border-amber-200 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{r.name}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {r.policies.map(pid => {
                            const p = policies.find(x => x.id === pid)
                            return p ? <span key={pid} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{p.name}</span> : null
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setRoleForm({ ...r, policies: [...r.policies] }); setShowRoleForm(true) }} className="text-slate-400 hover:text-amber-600 text-xs transition-colors">Edit</button>
                        <button onClick={() => dispatch(removeRole(r.id))} className="text-slate-400 hover:text-red-500 transition-colors shrink-0"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-[var(--border)] rounded-lg p-5 bg-cream-50 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-slate-800">{roleForm.id ? 'Edit Role' : 'New Role'}</h4>
                  <button onClick={() => setShowRoleForm(false)} className="text-slate-400 hover:text-slate-700"><X size={16} /></button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Role Name</label>
                  <input className="input-base" placeholder="e.g. Senior Support Agent" value={roleForm.name} onChange={e => setRoleForm({ ...roleForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">Assign Policies</label>
                  <div className="grid grid-cols-2 gap-2">
                    {policies.map(p => (
                      <label key={p.id} className="flex items-center gap-2 p-2 border border-[var(--border)] rounded-md bg-white cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          className="rounded text-amber-500 focus:ring-amber-500"
                          checked={roleForm.policies.includes(p.id)}
                          onChange={e => {
                            const newPolicies = e.target.checked
                              ? [...roleForm.policies, p.id]
                              : roleForm.policies.filter(id => id !== p.id)
                            setRoleForm({ ...roleForm, policies: newPolicies })
                          }}
                        />
                        <span className="text-sm font-medium text-slate-700">{p.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setShowRoleForm(false)} className="btn-secondary text-xs">Cancel</button>
                  <button
                    onClick={() => {
                      if (!roleForm.name.trim()) return
                      if (roleForm.id) dispatch(updateRole(roleForm))
                      else dispatch(addRole({ ...roleForm, name: roleForm.name.trim() }))
                      setShowRoleForm(false)
                    }}
                    className="btn-primary text-xs"
                  >Save Role</button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'policies' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-slate-900">Policies (Permissions)</h3>
              <button
                onClick={() => { setPolicyForm({ id: null, name: '', permissions: [] }); setShowPolicyForm(true) }}
                className="btn-primary text-xs flex items-center gap-1"
              ><Plus size={14} /> Create Policy</button>
            </div>

            {!showPolicyForm ? (
              <div className="space-y-3">
                {policies.map(p => (
                  <div key={p.id} className="border border-[var(--border)] rounded-lg p-4 bg-white hover:border-amber-200 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{p.permissions.length} permissions assigned</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setPolicyForm({ ...p, permissions: [...p.permissions] }); setShowPolicyForm(true) }} className="text-slate-400 hover:text-amber-600 text-xs transition-colors">Edit</button>
                        <button onClick={() => dispatch(removePolicy(p.id))} className="text-slate-400 hover:text-red-500 transition-colors shrink-0"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-[var(--border)] rounded-lg p-5 bg-cream-50 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-slate-800">{policyForm.id ? 'Edit Policy' : 'New Policy'}</h4>
                  <button onClick={() => setShowPolicyForm(false)} className="text-slate-400 hover:text-slate-700"><X size={16} /></button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Policy Name</label>
                  <input className="input-base" placeholder="e.g. Read-Only Ticket Access" value={policyForm.name} onChange={e => setPolicyForm({ ...policyForm, name: e.target.value })} />
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-600 mb-2">Permissions</label>
                  <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-white">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-cream-50 border-b border-[var(--border)]">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Module</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">View</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Create</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Edit</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {permissions.map(mod => (
                          <tr key={mod.id} className="hover:bg-cream-50">
                            <td className="px-4 py-3 text-slate-700 font-medium">{mod.label}</td>
                            {['view', 'create', 'edit', 'delete'].map(action => {
                              const pId = `${mod.id}_${action}`
                              return (
                                <td key={pId} className="px-4 py-3 text-center">
                                  <input
                                    type="checkbox"
                                    className="rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                                    checked={policyForm.permissions.includes(pId)}
                                    onChange={e => {
                                      const newPerms = e.target.checked
                                        ? [...policyForm.permissions, pId]
                                        : policyForm.permissions.filter(id => id !== pId)
                                      setPolicyForm({ ...policyForm, permissions: newPerms })
                                    }}
                                  />
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)] mt-4">
                  <button onClick={() => setShowPolicyForm(false)} className="btn-secondary text-xs">Cancel</button>
                  <button
                    onClick={() => {
                      if (!policyForm.name.trim()) return
                      if (policyForm.id) dispatch(updatePolicy(policyForm))
                      else dispatch(addPolicy({ ...policyForm, name: policyForm.name.trim() }))
                      setShowPolicyForm(false)
                    }}
                    className="btn-primary text-xs"
                  >Save Policy</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
