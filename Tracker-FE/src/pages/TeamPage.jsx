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

function InviteModal({ teams, roles, onClose }) {
  const dispatch = useDispatch()
  const [form, setForm] = useState({ name: '', email: '', role: roles[0]?.id || '', team: teams[0] || '' })

  function submit(e) {
    e.preventDefault()
    if (!form.email || !form.role) return
    
    const name = form.name || form.email.split('@')[0]
    dispatch(inviteMember({ ...form, name }))
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Name</label>
              <input className="input-base" type="text" placeholder="John Doe" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Email *</label>
              <input className="input-base" type="email" placeholder="teammate@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Role</label>
              <select className="input-base" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
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

import { User, Eye, ThumbsUp, Share2, MoreHorizontal, Paperclip, Mail, Link as LinkIcon, ChevronDown } from 'lucide-react'

function MemberDetailModal({ member, roleName, onClose }) {
  const dispatch = useDispatch()
  const currentUser = useSelector(s => s.auth.user)
  if (!member) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-5xl h-[85vh] bg-white rounded-xl shadow-2xl flex flex-col animate-fade-up overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <User size={16} className="text-amber-600" />
            <span className="hover:underline cursor-pointer">EMP-{member.id.substring(0, 4)}</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"><Eye size={16}/></button>
            <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"><ThumbsUp size={16}/></button>
            <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"><Share2 size={16}/></button>
            <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"><MoreHorizontal size={16}/></button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"><X size={18} /></button>
          </div>
        </div>
        
        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Content (Left) */}
          <div className="flex-1 overflow-y-auto p-8 pr-10">
            <h1 className="font-display text-2xl text-slate-900 mb-6">{member.name}</h1>
            
            <div className="flex items-center gap-2 mb-8">
              <button className="btn-secondary py-1.5 px-3 mb-1 text-sm font-medium flex items-center gap-1.5 bg-slate-100 border-none hover:bg-slate-200 text-slate-700"><Paperclip size={14}/> Attach</button>
              <button className="btn-secondary py-1.5 px-3 mb-1 text-sm font-medium flex items-center gap-1.5 bg-slate-100 border-none hover:bg-slate-200 text-slate-700"><Mail size={14}/> Send Email</button>
              <button className="btn-secondary py-1.5 px-3 mb-1 text-sm font-medium flex items-center gap-1.5 bg-slate-100 border-none hover:bg-slate-200 text-slate-700"><LinkIcon size={14}/> Link item <ChevronDown size={14} className="ml-1 opacity-50"/></button>
              <button className="btn-secondary py-1.5 px-2 mb-1 text-sm font-medium flex items-center justify-center bg-slate-100 border-none hover:bg-slate-200 text-slate-700"><MoreHorizontal size={16}/></button>
            </div>

            <h3 className="text-sm font-semibold text-slate-800 mb-2">Description / Bio</h3>
            <p className="text-sm text-slate-500 mb-8 whitespace-pre-wrap hover:bg-slate-50 p-2 -mx-2 rounded cursor-text transition-colors">{member.bio || 'Add a description...'}</p>

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
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold shrink-0 text-sm">{(currentUser?.fullname || 'U').charAt(0)}</div>
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

            <div className="border border-[var(--border)] rounded bg-white">
               <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors font-medium text-sm text-slate-800">
                 Details
                 <ChevronDown size={16} className="text-slate-400" />
               </div>
               <div className="p-4 space-y-5">
                 <div>
                   <p className="text-xs text-slate-500 mb-1.5 font-medium">Role</p>
                   <div className="flex items-center gap-2 p-1 bg-slate-50 border border-slate-200 rounded max-w-max shadow-sm">
                     <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${roleColors[member.role] || 'bg-slate-200 text-slate-700'}`}>{roleName.charAt(0)}</span>
                     <span className="text-sm font-medium text-slate-700 pr-2">{roleName}</span>
                   </div>
                 </div>
                 
                 <div>
                   <p className="text-xs text-slate-500 mb-1.5 font-medium">Team</p>
                   <div className="flex items-center gap-2 p-1 bg-slate-50 border border-slate-200 rounded max-w-max shadow-sm">
                     <span className="w-6 h-6 rounded flex items-center justify-center text-xs bg-slate-200 text-slate-600">T</span>
                     <span className="text-sm text-slate-700 pr-2">{member.team}</span>
                   </div>
                 </div>

                 <div>
                   <p className="text-xs text-slate-500 mb-1 font-medium">Email</p>
                   <span className="text-sm text-slate-700 flex items-center gap-2"><Mail size={14} className="text-slate-400"/> {member.email}</span>
                 </div>
                 <div>
                   <p className="text-xs text-slate-500 mb-1 font-medium">Last Active</p>
                   <span className="text-sm text-slate-700 flex items-center gap-2"><Clock size={14} className="text-slate-400"/> {timeAgo(member.lastActive)}</span>
                 </div>

                 <div className="border-t border-slate-100 pt-5 mt-5">
                    <p className="text-xs text-slate-500 mb-2 font-medium">Performance Metrics</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                        <p className="text-xs text-slate-500 mb-0.5 font-medium">Resolved</p>
                        <p className="text-base font-semibold text-slate-800 flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500"/> {member.resolved}</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                        <p className="text-xs text-slate-500 mb-0.5 font-medium">Avg Reply</p>
                        <p className="text-base font-semibold text-slate-800 flex items-center gap-1.5"><Clock size={14} className="text-amber-500"/> {member.avgResponse}</p>
                      </div>
                    </div>
                 </div>
               </div>
            </div>

            {member.id !== currentUser?.id && (
              <div className="mt-8">
                <button 
                  onClick={() => { dispatch(removeMember(member.id)); onClose() }}
                  className="w-full px-4 py-2 hover:bg-slate-100 text-red-600 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={16} className="opacity-70" /> Remove Employee
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TeamPage() {
  const dispatch = useDispatch()
  const { members, teams } = useSelector(s => s.team)
  const { roles } = useSelector(s => s.settings)
  const currentUser = useSelector(s => s.auth.user)
  const [showInvite, setShowInvite] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)

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
            {members.map(m => {
              const rName = roles.find(r => r.id === m.role)?.name || m.role
              return (
              <tr key={m.id} className="hover:bg-cream-50 transition-colors cursor-pointer" onClick={() => setSelectedMember(m)}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-semibold shrink-0 uppercase">{m.name.charAt(0)}</div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{m.name}</p>
                      <p className="text-xs text-slate-400">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                  {currentUser?.role === 'admin' && m.id !== currentUser?.id ? (
                    <select
                      className="text-xs border border-[var(--border)] rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                      value={m.role}
                      onChange={e => dispatch(updateMemberRole({ id: m.id, role: e.target.value }))}
                    >
                      {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  ) : (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[m.role] || 'bg-slate-100 text-slate-700'}`}>{rName}</span>
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
                <td className="px-5 py-3.5 text-right">
                   <button
                     className="text-xs font-medium text-amber-600 hover:text-amber-700"
                   >
                     View Profile
                   </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

     
      {showInvite && <InviteModal teams={teams} roles={roles} onClose={() => setShowInvite(false)} />}
      
      {selectedMember && (
        <MemberDetailModal 
          member={selectedMember} 
          roleName={roles.find(r => r.id === selectedMember.role)?.name || selectedMember.role}
          onClose={() => setSelectedMember(null)} 
        />
      )}
    </div>
  )
}
