import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { X, Send, Lock, Globe, Clock, Bookmark, Eye, ThumbsUp, Share2, MoreHorizontal, Paperclip, Link as LinkIcon, ChevronDown, User, Tag } from 'lucide-react'
import { closeTicket, updateTicket, addReply } from '../../store/slices/ticketsSlice'
import { priorityBadge, statusBadge, statusLabel, timeAgo, slaLabel } from '../../utils'

const statuses = ['open', 'inprogress', 'waiting', 'resolved']
const priorities = ['urgent', 'high', 'medium', 'low']

export default function TicketDrawer() {
  const dispatch = useDispatch()
  const { selectedId, items, replies } = useSelector(s => s.tickets)
  const contacts = useSelector(s => s.contacts.items)
  const members = useSelector(s => s.team.members)
  const currentUser = useSelector(s => s.auth?.user)
  const ticket = items.find(t => t.id === selectedId)
  
  const [replyText, setReplyText] = useState('')
  const [replyType, setReplyType] = useState('client')
  const [activeTab, setActiveTab] = useState('comments')

  if (!ticket) return null

  const contact = contacts.find(c => c.id === ticket.contact)
  const assignee = members.find(m => m.id === ticket.assignee)
  const threadReplies = replies[ticket.id] || []
  const sla = slaLabel(ticket.slaDeadline)

  function sendReply() {
    if (!replyText.trim()) return
    dispatch(addReply({ ticketId: ticket.id, reply: { author: currentUser?.fullname || 'Alex Morgan', type: replyType, content: replyText } }))
    setReplyText('')
  }

  // Determine status color for dropdown
  const getStatusColor = (s) => {
    switch(s) {
      case 'open': return 'bg-slate-200 text-slate-800'
      case 'inprogress': return 'bg-blue-600 text-white'
      case 'waiting': return 'bg-amber-500 text-white'
      case 'resolved': return 'bg-green-600 text-white'
      default: return 'bg-slate-200 text-slate-800'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm" onClick={() => dispatch(closeTicket())}>
      <div className="w-full max-w-5xl h-[85vh] bg-white rounded-xl shadow-2xl flex flex-col animate-fade-up overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Bookmark size={15} className="text-green-600 fill-green-600" />
            <span className="hover:underline cursor-pointer">{ticket.id}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <button className="p-1.5 hover:bg-slate-100 rounded transition-colors flex items-center gap-1.5 text-xs font-medium"><Eye size={16}/><span className="w-1 border-b border-transparent">1</span></button>
            <button className="p-1.5 hover:bg-slate-100 rounded transition-colors"><ThumbsUp size={16}/></button>
            <button className="p-1.5 hover:bg-slate-100 rounded transition-colors"><Share2 size={16}/></button>
            <button className="p-1.5 hover:bg-slate-100 rounded transition-colors"><MoreHorizontal size={16}/></button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button onClick={() => dispatch(closeTicket())} className="p-1.5 hover:bg-slate-100 rounded transition-colors"><X size={18} /></button>
          </div>
        </div>

        {/* Body Layout */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Main Content (Left) */}
          <div className="flex-1 overflow-y-auto p-8 pr-10">
            <h1 className="font-display text-2xl text-slate-900 mb-6 leading-snug">{ticket.title}</h1>
            
            <div className="flex items-center gap-2 mb-8 flex-wrap">
              <button className="btn-secondary py-1.5 px-3 mb-1 text-sm font-medium flex items-center gap-1.5 bg-slate-100 border-none hover:bg-slate-200 text-slate-700"><Paperclip size={14}/> Attach</button>
              <button className="btn-secondary py-1.5 px-3 mb-1 text-sm font-medium flex items-center gap-1.5 bg-slate-100 border-none hover:bg-slate-200 text-slate-700"><Send size={14}/> Send Email</button>
              <button className="btn-secondary py-1.5 px-3 mb-1 text-sm font-medium flex items-center gap-1.5 bg-slate-100 border-none hover:bg-slate-200 text-slate-700"><LinkIcon size={14}/> Link issue <ChevronDown size={14} className="ml-1 opacity-50"/></button>
              <button className="btn-secondary py-1.5 px-2 mb-1 text-sm font-medium flex items-center justify-center bg-slate-100 border-none hover:bg-slate-200 text-slate-700"><MoreHorizontal size={16}/></button>
            </div>

            <h3 className="text-sm font-semibold text-slate-800 mb-2">Description</h3>
            <p className="text-sm text-slate-600 mb-8 whitespace-pre-wrap hover:bg-slate-50 p-2 -mx-2 rounded cursor-text transition-colors">
              {ticket.description || 'Add a description...'}
            </p>

            <h3 className="text-sm font-semibold text-slate-800 mb-4">Activity</h3>
            <div className="flex items-center justify-between border-b border-slate-200 mb-6 pb-0 text-sm">
               <div className="flex gap-4">
                 <span className="text-slate-500 py-1">Show:</span>
                 <button onClick={() => setActiveTab('all')} className={`px-2 py-1 font-medium transition-colors rounded-sm mb-1 ${activeTab === 'all' ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:text-slate-800 bg-slate-100'}`}>All</button>
                 <button onClick={() => setActiveTab('comments')} className={`px-2 py-1 font-medium transition-colors mb-[-1px] rounded-t-sm border-b-2 ${activeTab === 'comments' ? 'text-blue-600 border-blue-600 bg-blue-50/50' : 'text-slate-600 border-transparent hover:text-slate-800 bg-slate-100 mb-1'}`}>Comments</button>
                 <button onClick={() => setActiveTab('history')} className={`px-2 py-1 font-medium transition-colors rounded-sm mb-1 ${activeTab === 'history' ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:text-slate-800 bg-slate-100'}`}>History</button>
                 <button onClick={() => setActiveTab('work')} className={`px-2 py-1 font-medium transition-colors rounded-sm mb-1 ${activeTab === 'work' ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:text-slate-800 bg-slate-100'}`}>Work log</button>
               </div>
               <button className="text-slate-500 text-xs font-medium flex items-center gap-1">Newest first <ChevronDown size={12}/></button>
            </div>

            {/* Comment Box */}
            <div className="flex gap-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold shrink-0 text-sm mt-1">{(currentUser?.fullname || 'U').charAt(0)}</div>
              <div className="flex-1 border border-slate-200 rounded-lg overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-amber-400 focus-within:border-amber-400 transition-shadow bg-white">
                <textarea
                  className="w-full p-3 text-sm resize-none focus:outline-none placeholder-slate-400 font-sans"
                  rows={3}
                  placeholder="Add a comment... (Pro tip: press M)"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) sendReply() }}
                />
                <div className="bg-slate-50 border-t border-slate-200 px-3 py-2 flex items-center justify-between">
                   <div className="flex gap-2">
                     {['client', 'internal'].map(t => (
                       <button
                         key={t}
                         onClick={() => setReplyType(t)}
                         className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${replyType === t ? 'bg-slate-200 text-slate-800 font-semibold' : 'text-slate-600 hover:bg-slate-200'}`}
                       >
                         {t === 'client' ? '↗ Reply to customer' : '🔒 Internal Note'}
                       </button>
                     ))}
                   </div>
                   <button onClick={sendReply} disabled={!replyText.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium px-4 py-1.5 rounded transition-colors">
                     Save
                   </button>
                </div>
              </div>
            </div>

            {/* Threads content */}
            <div className="space-y-6">
               {threadReplies.length === 0 && <p className="text-sm text-slate-500 italic ml-12">No comments yet.</p>}
               {threadReplies.map(r => (
                 <div key={r.id} className="flex gap-4">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold shrink-0 text-sm mt-1 ${r.type === 'internal' ? 'bg-amber-500' : 'bg-slate-400'}`}>
                     {r.author.charAt(0)}
                   </div>
                   <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                       <span className="text-sm font-semibold text-slate-800">{r.author}</span>
                       <span className="text-xs text-slate-500">{timeAgo(r.createdAt)}</span>
                       {r.type === 'internal' ? <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold tracking-wider uppercase ml-1">Internal</span> : null}
                     </div>
                     <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{r.content}</p>
                     <div className="mt-2 flex gap-3 text-xs font-medium text-slate-500">
                       <button className="hover:text-slate-800 hover:underline">Edit</button>
                       <button className="hover:text-slate-800 hover:underline">Delete</button>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="w-[340px] bg-white border-l border-slate-200 overflow-y-auto p-6 scrollbar-thin">
            <div className="mb-6 flex gap-2">
               <div className="relative flex-1">
                 <select 
                   value={ticket.status} 
                   onChange={e => dispatch(updateTicket({ id: ticket.id, status: e.target.value }))}
                   className={`w-full appearance-none px-3 py-1.5 pr-8 rounded font-medium text-sm transition-colors shadow-sm cursor-pointer outline-none focus:ring-2 focus:ring-blue-400/50 ${getStatusColor(ticket.status)}`}
                 >
                   {statuses.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
                 </select>
                 <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-80" />
               </div>
               
               <button className="px-3 py-1.5 rounded text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1 shadow-sm shrink-0">
                 <span className="font-mono opacity-50 mr-0.5">⚡</span> Actions <ChevronDown size={14} className="ml-1"/>
               </button>
            </div>

            <div className="border border-[var(--border)] rounded bg-white overflow-hidden shadow-sm">
               <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors font-medium text-sm text-slate-800">
                 Details
                 <ChevronDown size={16} className="text-slate-400" />
               </div>
               
               <div className="p-4 space-y-5">
                 {/* Assignee */}
                 <div>
                   <p className="text-xs text-slate-500 mb-1.5 font-medium">Assignee</p>
                   {assignee ? (
                     <div className="flex items-center gap-2 p-1 pl-1.5 pr-3 bg-slate-50 border border-slate-200 rounded-md max-w-max shadow-sm hover:bg-slate-100 cursor-pointer transition-colors">
                       <span className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold text-white uppercase">{assignee.name.charAt(0)}</span>
                       <span className="text-sm text-blue-600 hover:underline cursor-pointer">{assignee.email.split('@')[0]}</span>
                     </div>
                   ) : (
                     <div className="flex items-center gap-1.5">
                       <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-400"><User size={14}/></div>
                       <span className="text-sm text-blue-600 cursor-pointer hover:underline">Assign to me</span>
                     </div>
                   )}
                 </div>

                 {/* Reporter */}
                 <div>
                   <p className="text-xs text-slate-500 mb-1.5 font-medium">Reporter / Contact</p>
                   {contact ? (
                     <div className="flex items-center gap-2 max-w-max">
                       <span className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">{contact.name.charAt(0)}</span>
                       <span className="text-sm text-slate-700 hover:underline cursor-pointer">{contact.name}</span>
                     </div>
                   ) : (
                     <span className="text-sm text-slate-500">None</span>
                   )}
                 </div>

                 {/* Priority */}
                 <div>
                   <p className="text-xs text-slate-500 mb-1.5 font-medium">Priority</p>
                   <select
                     className="text-sm bg-transparent border-none text-blue-600 hover:bg-slate-100 px-1 py-0.5 -ml-1 rounded cursor-pointer outline-none focus:ring-1 focus:ring-blue-400"
                     value={ticket.priority}
                     onChange={e => dispatch(updateTicket({ id: ticket.id, priority: e.target.value }))}
                   >
                     {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                   </select>
                 </div>

                 {/* Labels */}
                 <div>
                   <p className="text-xs text-slate-500 mb-1.5 font-medium">Labels</p>
                   {ticket.tags && ticket.tags.length > 0 ? (
                     <div className="flex flex-wrap gap-1.5">
                       {ticket.tags.map(tag => (
                         <span key={tag} className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded shadow-sm hover:bg-slate-200 cursor-pointer">{tag}</span>
                       ))}
                     </div>
                   ) : (
                     <span className="text-sm text-slate-500">None</span>
                   )}
                 </div>

                 {/* SLA */}
                 <div>
                   <p className="text-xs text-slate-500 mb-1.5 font-medium">SLA Deadline</p>
                   <div className={`flex items-center gap-1.5 text-sm ${sla.color} hover:underline cursor-pointer max-w-max bg-slate-50 px-2 py-0.5 rounded`}>
                     <Clock size={14} />
                     {sla.label}
                   </div>
                 </div>

                 {/* Create */}
                 <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-400">Created {timeAgo(ticket.createdAt)}</p>
                    <p className="text-xs text-slate-400 mt-1">Updated Just now</p>
                 </div>
                 
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
