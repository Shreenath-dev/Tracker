import { useState } from 'react'
import { Copy, Check, Plus, Trash2, Globe, Webhook, Key, Code2 } from 'lucide-react'

const mockWebhooks = [
  { id: 'wh1', url: 'https://hooks.zapier.com/hooks/catch/abc123', events: ['ticket.created', 'ticket.resolved'], active: true },
  { id: 'wh2', url: 'https://api.myapp.com/webhooks/tracker', events: ['ticket.assigned'], active: false },
]

const mockApiKeys = [
  { id: 'k1', name: 'Production', key: 'trk_live_••••••••••••••••••••••••••••••••', scope: 'read-write', created: '2025-01-10' },
  { id: 'k2', name: 'Analytics Dashboard', key: 'trk_live_••••••••••••••••••••••••••••••••', scope: 'read-only', created: '2025-02-03' },
]

const EVENTS = ['ticket.created', 'ticket.updated', 'ticket.resolved', 'ticket.assigned']

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="text-slate-400 hover:text-amber-600 transition-colors">
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
    </button>
  )
}

export default function IntegrationsPage() {
  const [webhooks, setWebhooks] = useState(mockWebhooks)
  const [apiKeys, setApiKeys] = useState(mockApiKeys)
  const [domains, setDomains] = useState(['acme.com', 'app.acme.com'])
  const [newDomain, setNewDomain] = useState('')
  const [newWebhook, setNewWebhook] = useState({ url: '', events: [] })
  const [showWebhookForm, setShowWebhookForm] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyScope, setNewKeyScope] = useState('read-only')
  const [showKeyForm, setShowKeyForm] = useState(false)

  const scriptTag = `<script src="https://cdn.tracker.io/widget.js" data-workspace="ws_acme_corp"></script>`

  function addDomain() {
    if (newDomain.trim()) { setDomains(d => [...d, newDomain.trim()]); setNewDomain('') }
  }

  function addWebhook() {
    if (!newWebhook.url || newWebhook.events.length === 0) return
    setWebhooks(w => [...w, { id: `wh${Date.now()}`, ...newWebhook, active: true }])
    setNewWebhook({ url: '', events: [] })
    setShowWebhookForm(false)
  }

  function generateKey() {
    if (!newKeyName) return
    setApiKeys(k => [...k, { id: `k${Date.now()}`, name: newKeyName, key: `trk_live_${'x'.repeat(32)}`, scope: newKeyScope, created: new Date().toISOString().slice(0, 10) }])
    setNewKeyName('')
    setShowKeyForm(false)
  }

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="card p-6 space-y-4 xl:col-span-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center"><Code2 size={17} className="text-amber-600" /></div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Embed Widget</h3>
            <p className="text-xs text-slate-500">Add a contact form to your website</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-600 mb-2">Script tag</p>
          <div className="flex items-center gap-2 bg-slate-950 rounded-lg px-4 py-3">
            <code className="text-xs text-green-400 flex-1 font-mono break-all">{scriptTag}</code>
            <CopyButton text={scriptTag} />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-600 mb-2">Whitelisted domains</p>
          <div className="space-y-2">
            {domains.map(d => (
              <div key={d} className="flex items-center gap-2 px-3 py-2 bg-cream-50 border border-[var(--border)] rounded-lg">
                <Globe size={13} className="text-slate-400" />
                <span className="text-sm text-slate-700 flex-1">{d}</span>
                <button onClick={() => setDomains(ds => ds.filter(x => x !== d))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
              </div>
            ))}
            <div className="flex gap-2">
              <input className="input-base flex-1" placeholder="yourdomain.com" value={newDomain} onChange={e => setNewDomain(e.target.value)} onKeyDown={e => e.key === 'Enter' && addDomain()} />
              <button onClick={addDomain} className="btn-secondary flex items-center gap-1"><Plus size={13} /> Add</button>
            </div>
          </div>
        </div>
      </div>

      {/* Webhooks */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center"><Webhook size={17} className="text-violet-600" /></div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Webhooks</h3>
              <p className="text-xs text-slate-500">Receive real-time event notifications</p>
            </div>
          </div>
          <button onClick={() => setShowWebhookForm(v => !v)} className="btn-secondary flex items-center gap-1.5 text-xs"><Plus size={13} /> Add</button>
        </div>

        {showWebhookForm && (
          <div className="border border-[var(--border)] rounded-lg p-4 space-y-3 bg-cream-50 animate-fade-up">
            <input className="input-base" placeholder="https://your-endpoint.com/webhook" value={newWebhook.url} onChange={e => setNewWebhook(w => ({ ...w, url: e.target.value }))} />
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Events</p>
              <div className="flex flex-wrap gap-2">
                {EVENTS.map(ev => (
                  <label key={ev} className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newWebhook.events.includes(ev)}
                      onChange={e => setNewWebhook(w => ({ ...w, events: e.target.checked ? [...w.events, ev] : w.events.filter(x => x !== ev) }))}
                      className="rounded"
                    />
                    <span className="text-slate-700">{ev}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={addWebhook} className="btn-primary text-xs">Save webhook</button>
              <button onClick={() => setShowWebhookForm(false)} className="btn-secondary text-xs">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {webhooks.map(wh => (
            <div key={wh.id} className="flex items-center gap-3 px-4 py-3 border border-[var(--border)] rounded-lg">
              <div className={`w-2 h-2 rounded-full shrink-0 ${wh.active ? 'bg-green-400' : 'bg-slate-300'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 truncate font-mono">{wh.url}</p>
                <div className="flex gap-1.5 mt-0.5">
                  {wh.events.map(ev => <span key={ev} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{ev}</span>)}
                </div>
              </div>
              <button onClick={() => setWebhooks(w => w.filter(x => x.id !== wh.id))} className="text-slate-300 hover:text-red-500 transition-colors shrink-0"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center"><Key size={17} className="text-green-600" /></div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">API Keys</h3>
              <p className="text-xs text-slate-500">Authenticate programmatic access</p>
            </div>
          </div>
          <button onClick={() => setShowKeyForm(v => !v)} className="btn-secondary flex items-center gap-1.5 text-xs"><Plus size={13} /> Generate</button>
        </div>

        {showKeyForm && (
          <div className="border border-[var(--border)] rounded-lg p-4 space-y-3 bg-cream-50 animate-fade-up">
            <div className="grid grid-cols-2 gap-3">
              <input className="input-base" placeholder="Key name (e.g. Production)" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} />
              <select className="input-base" value={newKeyScope} onChange={e => setNewKeyScope(e.target.value)}>
                <option value="read-only">Read-only</option>
                <option value="read-write">Read-write</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={generateKey} className="btn-primary text-xs">Generate key</button>
              <button onClick={() => setShowKeyForm(false)} className="btn-secondary text-xs">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {apiKeys.map(k => (
            <div key={k.id} className="flex items-center gap-3 px-4 py-3 border border-[var(--border)] rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-slate-800">{k.name}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${k.scope === 'read-write' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{k.scope}</span>
                </div>
                <p className="text-xs font-mono text-slate-400">{k.key}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <CopyButton text={k.key} />
                <button onClick={() => setApiKeys(keys => keys.filter(x => x.id !== k.id))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
