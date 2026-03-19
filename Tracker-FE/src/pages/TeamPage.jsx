import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, X, Trash2, Shield, Clock, CheckCircle2, Ticket } from 'lucide-react'
import { inviteMember, removeMember, updateMemberRole } from '../store/slices/teamSlice'

const roleColors = { admin: 'bg-red-100 text-red-700', manager: 'bg-violet-100 text-violet-700', agent: 'bg-blue-100 text-blue-700' }

function timeAgo(ts) {
  if (!ts) return 'Never'
  const diff = Date.now() - ts
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

function InviteModal({ teams, onClose }) {
  const dispatch = useDispatch()
  const [form, setForm] = useState({ name: '', email: '', role: 'agent', team: teams[0] || '' })

  function submit(e) {
    e.preventDefault()
    if (!form.email) return
    dispatch(inviteMember(form))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
      <div className="card w-full max-w-md mx-4 animate-fade-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="font-display text-lg text-slate-900">Invite Member</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Email *</label>
            <input className="input-base" type="email" placeholder="teammate@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Role</label>
              <select className="input-base" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="agent">Agent</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Team</label>
              <select className="input-base" value={form.team} onChange={e => setForm(f => ({ ...f, team: e.target.value }))}>
                {teams.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Send Invite</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function TeamPage() {
  const dispatch = useDispatch()
  const { members, teams } = useSelector(s => s.team)
  const currentUser = useSelector(s => s.auth.user)
  const [showInvite, setShowInvite] = useState(false)

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{members.length} members across {teams.length} teams</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="btn-primary flex items-center gap-1.5">
          <Plus size={14} /> Invite Member
        </button>
      </div>

      {/* Teams overview */}
      <div className="grid grid-cols-3 xl:grid-cols-6 gap-3">
        {teams.map(team => {
          const count = members.filter(m => m.team === team).length
          return (
            <div key={team} className="card p-4">
              <p className="font-semibold text-slate-800 text-sm">{team}</p>
              <p className="text-xs text-slate-400 mt-0.5">{count} member{count !== 1 ? 's' : ''}</p>
            </div>
          )
        })}
      </div>

      {/* Members table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[var(--border)] bg-cream-50">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Members</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Member</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Team</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Active</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Performance</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {members.map(m => (
              <tr key={m.id} className="hover:bg-cream-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-semibold shrink-0">{m.name.charAt(0)}</div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{m.name}</p>
                      <p className="text-xs text-slate-400">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  {currentUser?.role === 'admin' && m.id !== currentUser?.id ? (
                    <select
                      className="text-xs border border-[var(--border)] rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                      value={m.role}
                      onChange={e => dispatch(updateMemberRole({ id: m.id, role: e.target.value }))}
                    >
                      <option value="agent">Agent</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[m.role]}`}>{m.role}</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-600">{m.team}</td>
                <td className="px-5 py-3.5 text-xs text-slate-500">{timeAgo(m.lastActive)}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><CheckCircle2 size={11} className="text-green-500" />{m.resolved}</span>
                    <span className="flex items-center gap-1"><Clock size={11} className="text-amber-500" />{m.avgResponse}</span>
                    <span className="flex items-center gap-1"><Ticket size={11} className="text-blue-500" />{m.open} open</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  {m.id !== currentUser?.id && (
                    <button
                      onClick={() => dispatch(removeMember(m.id))}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permissions table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[var(--border)] bg-cream-50">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role Permissions</p>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Permission</th>
              <th className="px-5 py-3 text-center font-semibold text-blue-600">Agent</th>
              <th className="px-5 py-3 text-center font-semibold text-violet-600">Manager</th>
              <th className="px-5 py-3 text-center font-semibold text-red-600">Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {[
              ['View & reply tickets', true, true, true],
              ['Create tickets', true, true, true],
              ['Assign tickets', 'own only', true, true],
              ['View contacts', true, true, true],
              ['Edit contacts', false, true, true],
              ['View team section', false, true, true],
              ['Invite members', false, true, true],
              ['Remove members / set roles', false, false, true],
              ['Billing & plan', false, false, true],
              ['Integrations & API keys', false, false, true],
            ].map(([perm, agent, manager, admin]) => (
              <tr key={perm} className="hover:bg-cream-50">
                <td className="px-5 py-2.5 text-slate-700">{perm}</td>
                {[agent, manager, admin].map((val, i) => (
                  <td key={i} className="px-5 py-2.5 text-center">
                    {val === true ? <span className="text-green-500">✓</span> :
                     val === false ? <span className="text-slate-300">—</span> :
                     <span className="text-amber-600 text-xs">{val}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showInvite && <InviteModal teams={teams} onClose={() => setShowInvite(false)} />}
    </div>
  )
}
