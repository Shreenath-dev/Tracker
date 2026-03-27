import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signupUser, verifyEmail, createPassword, signIn, fetchAdminProfile } from '../store/slices/authSlice'
import { ArrowRight, Mail, Lock, User, Building2, AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react'

/* ── SVG Illustration ── */
function DashboardIllustration() {
  return (
    <svg viewBox="0 0 480 520" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
      <defs>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="barA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="barB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="barC" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="glowAmber" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* ── Monitor body ── */}
      <rect x="60" y="30" width="360" height="240" rx="14" fill="url(#screenGrad)" filter="url(#softShadow)" />
      <rect x="60" y="30" width="360" height="240" rx="14" stroke="#334155" strokeWidth="1.5" />
      {/* Screen bezel top bar */}
      <rect x="60" y="30" width="360" height="32" rx="14" fill="#1e293b" />
      <rect x="60" y="48" width="360" height="14" fill="#1e293b" />
      {/* Traffic lights */}
      <circle cx="84" cy="46" r="5" fill="#ef4444" opacity="0.8" />
      <circle cx="100" cy="46" r="5" fill="#f59e0b" opacity="0.8" />
      <circle cx="116" cy="46" r="5" fill="#22c55e" opacity="0.8" />
      {/* URL bar */}
      <rect x="148" y="38" width="180" height="16" rx="8" fill="#0f172a" />
      <text x="238" y="50" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="monospace">app.tracker.io/dashboard</text>

      {/* ── Sidebar inside screen ── */}
      <rect x="68" y="62" width="52" height="200" rx="4" fill="#0f172a" />
      {/* Sidebar logo */}
      <rect x="76" y="70" width="18" height="18" rx="4" fill="#d97706" />
      <text x="85" y="83" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">T</text>
      {/* Sidebar nav items */}
      {[90, 106, 122, 138, 154, 170].map((y, i) => (
        <g key={i}>
          <rect x="74" y={y + 8} width="36" height="10" rx="3"
            fill={i === 0 ? '#d97706' : '#1e293b'}
            opacity={i === 0 ? 1 : 0.6}
          />
          <rect x="76" y={y + 10} width="6" height="6" rx="1.5"
            fill={i === 0 ? '#fff' : '#475569'}
          />
          <rect x="85" y={y + 11} width="18" height="3" rx="1.5"
            fill={i === 0 ? '#fff' : '#334155'}
          />
        </g>
      ))}

      {/* ── Main content area ── */}
      {/* Stat cards row */}
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x={128 + i * 72} y="70" width="64" height="38" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
          <rect x={132 + i * 72} y="76" width="20" height="4" rx="2" fill="#334155" />
          <text x={132 + i * 72} y="100" fill={['#f59e0b','#6366f1','#ef4444','#10b981'][i]} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
            {['24','8','3','91%'][i]}
          </text>
        </g>
      ))}

      {/* ── Bar chart ── */}
      <rect x="128" y="116" width="140" height="80" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
      <text x="136" y="128" fill="#64748b" fontSize="6" fontFamily="sans-serif">Tickets by Status</text>
      {/* Bars */}
      {[
        { x: 140, h: 38, grad: 'url(#barA)' },
        { x: 163, h: 28, grad: 'url(#barB)' },
        { x: 186, h: 18, grad: 'url(#barC)' },
        { x: 209, h: 44, grad: 'url(#barA)' },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={188 - b.h} width="16" height={b.h} rx="2" fill={b.grad} opacity="0.9" />
        </g>
      ))}
      {/* X axis */}
      <line x1="136" y1="188" x2="262" y2="188" stroke="#334155" strokeWidth="0.5" />

      {/* ── Activity feed ── */}
      <rect x="276" y="116" width="136" height="80" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
      <text x="284" y="128" fill="#64748b" fontSize="6" fontFamily="sans-serif">Recent Activity</text>
      {[0,1,2,3,4].map(i => (
        <g key={i}>
          <circle cx="288" cy={138 + i * 12} r="3" fill={['#ef4444','#f59e0b','#6366f1','#10b981','#f59e0b'][i]} />
          <rect x="295" cy={135 + i * 12} y={135 + i * 12} width={[70,55,65,48,60][i]} height="4" rx="2" fill="#334155" />
          <rect x="295" y={141 + i * 12} width={[40,30,45,28,35][i]} height="2.5" rx="1" fill="#1e3a5f" />
        </g>
      ))}

      {/* ── Kanban preview strip ── */}
      <rect x="128" y="204" width="284" height="50" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
      <text x="136" y="216" fill="#64748b" fontSize="6" fontFamily="sans-serif">Kanban Board</text>
      {['Open','In Prog','Waiting','Resolved'].map((label, i) => (
        <g key={i}>
          <rect x={136 + i * 68} y="220" width="60" height="28" rx="3"
            fill={['#1e3a5f','#2d1b69','#3d2a00','#052e16'][i]}
            stroke={['#3b82f6','#6366f1','#d97706','#10b981'][i]}
            strokeWidth="0.8" strokeOpacity="0.6"
          />
          <text x={166 + i * 68} y="230" textAnchor="middle" fill={['#60a5fa','#818cf8','#fbbf24','#34d399'][i]} fontSize="5.5" fontFamily="sans-serif">{label}</text>
          {/* Mini ticket stubs */}
          {[0,1].map(j => (
            <rect key={j} x={138 + i * 68} y={233 + j * 6} width={[36,28,32,40][i]} height="4" rx="1.5"
              fill={['#1e40af','#3730a3','#92400e','#065f46'][i]} opacity="0.7"
            />
          ))}
        </g>
      ))}

      {/* Monitor stand */}
      <rect x="218" y="270" width="44" height="14" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <rect x="196" y="282" width="88" height="8" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />

      {/* ── Floating notification card (top right) ── */}
      <g className="auth-float-a" style={{ transformOrigin: '390px 20px' }}>
        <rect x="310" y="8" width="148" height="52" rx="10" fill="url(#cardGrad)" stroke="#334155" strokeWidth="1" filter="url(#softShadow)" />
        <circle cx="326" cy="28" r="8" fill="#d97706" opacity="0.2" />
        <circle cx="326" cy="28" r="4" fill="#d97706" />
        <rect x="340" y="20" width="60" height="5" rx="2.5" fill="#475569" />
        <rect x="340" y="29" width="90" height="4" rx="2" fill="#334155" />
        <rect x="340" y="37" width="50" height="4" rx="2" fill="#334155" />
        <rect x="396" y="36" width="28" height="12" rx="4" fill="#d97706" />
        <text x="410" y="45" textAnchor="middle" fill="white" fontSize="6" fontFamily="sans-serif">Reply</text>
      </g>

      {/* ── Floating SLA badge (left) ── */}
      <g className="auth-float-b" style={{ transformOrigin: '30px 200px' }}>
        <rect x="4" y="178" width="110" height="44" rx="10" fill="url(#cardGrad)" stroke="#334155" strokeWidth="1" filter="url(#softShadow)" />
        <rect x="12" y="186" width="8" height="28" rx="2" fill="#ef4444" opacity="0.8" />
        <text x="26" y="198" fill="#94a3b8" fontSize="6" fontFamily="sans-serif">SLA Breach</text>
        <text x="26" y="210" fill="#ef4444" fontSize="11" fontWeight="bold" fontFamily="sans-serif">T-042</text>
        <text x="26" y="218" fill="#475569" fontSize="5.5" fontFamily="sans-serif">Urgent · 2m ago</text>
      </g>

      {/* ── Floating avatar cluster (bottom right) ── */}
      <g className="auth-float-c" style={{ transformOrigin: '400px 390px' }}>
        <rect x="320" y="310" width="140" height="56" rx="10" fill="url(#cardGrad)" stroke="#334155" strokeWidth="1" filter="url(#softShadow)" />
        <text x="332" y="326" fill="#64748b" fontSize="6" fontFamily="sans-serif">Team online</text>
        {['#d97706','#6366f1','#10b981','#ef4444'].map((c, i) => (
          <g key={i}>
            <circle cx={332 + i * 18} cy="344" r="10" fill={c} opacity="0.2" />
            <circle cx={332 + i * 18} cy="344" r="8" fill={c} opacity="0.9" />
            <text x={332 + i * 18} y="348" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
              {['A','J','S','R'][i]}
            </text>
            <circle cx={332 + i * 18 + 6} cy="336" r="3" fill="#22c55e" stroke="#0f172a" strokeWidth="1" />
          </g>
        ))}
        <text x="408" y="348" fill="#475569" fontSize="6" fontFamily="sans-serif">+2 more</text>
      </g>

      {/* ── Floating mini chart (bottom left) ── */}
      <g className="auth-float-a" style={{ transformOrigin: '60px 400px' }}>
        <rect x="8" y="340" width="120" height="64" rx="10" fill="url(#cardGrad)" stroke="#334155" strokeWidth="1" filter="url(#softShadow)" />
        <text x="18" y="356" fill="#64748b" fontSize="6" fontFamily="sans-serif">Resolved today</text>
        <text x="18" y="372" fill="#10b981" fontSize="18" fontWeight="bold" fontFamily="sans-serif">91%</text>
        {/* Sparkline */}
        <polyline
          points="18,394 32,388 46,390 60,382 74,385 88,376 102,378 116,370"
          stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
        />
        <polyline
          points="18,394 32,388 46,390 60,382 74,385 88,376 102,378 116,370 116,400 18,400"
          fill="url(#glowAmber)" opacity="0.4"
        />
      </g>

      {/* ── Connecting dots / decorative ── */}
      {[[60,300],[120,420],[380,290],[440,180],[240,480]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="2" fill="#334155" opacity="0.5" />
      ))}
      {[[60,300],[120,420]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.3" />
      ))}
    </svg>
  )
}

/* ── Step indicator ── */
const STEPS = { login: null, signup: 1, otp: 2, workspace: 3 }

function StepDots({ mode }) {
  const step = STEPS[mode]
  if (!step) return null
  return (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3].map(s => (
        <div key={s} className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold transition-all duration-300 ${
            s < step ? 'bg-amber-600 text-white' :
            s === step ? 'bg-amber-600 text-white ring-4 ring-amber-100' :
            'bg-slate-100 text-slate-400'
          }`}>
            {s < step ? <CheckCircle2 size={13} /> : s}
          </div>
          {s < 3 && <div className={`h-px w-8 transition-all duration-500 ${s < step ? 'bg-amber-400' : 'bg-slate-200'}`} />}
        </div>
      ))}
      <span className="ml-2 text-xs text-slate-400 font-medium">
        {step === 1 ? 'Account' : step === 2 ? 'Verify' : 'Password'}
      </span>
    </div>
  )
}

/* ── Input field ── */
function Field({ label, icon: Icon, error, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
      <div className={`relative flex items-center rounded-xl border transition-all duration-200 bg-white ${
        error ? 'border-red-300 ring-2 ring-red-100' :
        focused ? 'border-amber-400 ring-2 ring-amber-100 shadow-sm' :
        'border-slate-200 hover:border-slate-300'
      }`}>
        {Icon && (
          <div className={`pl-3.5 transition-colors ${focused ? 'text-amber-500' : 'text-slate-300'}`}>
            <Icon size={15} strokeWidth={1.8} />
          </div>
        )}
        <input
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 px-3 py-3 text-sm text-slate-800 placeholder-slate-300 bg-transparent focus:outline-none"
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  )
}

/* ── Main component ── */
export default function AuthPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading: apiLoading, error: apiError, signupToken } = useSelector(s => s.auth)
  const [rememberMe, setRememberMe] = useState(false)
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', org: '', email: '', password: '', confirmPassword: '' })
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [errors, setErrors] = useState({})
  const otpRefs = useRef([])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const clearErr = k => setErrors(e => ({ ...e, [k]: '' }))

  async function handleLogin(e) {
    e.preventDefault()
    const errs = {}
    if (!form.email) errs.email = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    const result = await dispatch(signIn({ email: form.email, password: form.password, rememberMe }))
    if (signIn.fulfilled.match(result)) {
      await dispatch(fetchAdminProfile())
      navigate('/dashboard')
    }
  }

  async function handleSignup(e) {
    e.preventDefault()
    const errs = {}
    if (!form.name) errs.name = 'Name is required'
    if (!form.org) errs.org = 'Organisation name is required'
    if (!form.email) errs.email = 'Email is required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    const result = await dispatch(signupUser({ name: form.name, email: form.email, orgName: form.org }))
    if (signupUser.fulfilled.match(result)) setMode('otp')
  }

  async function handleOtpChange(i, val) {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[i] = val; setOtp(next)
    if (val && i < 5) otpRefs.current[i + 1]?.focus()
    if (next.every(d => d !== '') && i === 5) {
      const result = await dispatch(verifyEmail({ token: signupToken, otp: next.join('') }))
      if (verifyEmail.fulfilled.match(result)) setMode('workspace')
    }
  }

  async function handleVerifyOtp() {
    if (otp.some(d => !d)) return
    const result = await dispatch(verifyEmail({ token: signupToken, otp: otp.join('') }))
    if (verifyEmail.fulfilled.match(result)) setMode('workspace')
  }

  async function handlePasswordSetup(e) {
    e.preventDefault()
    const errs = {}
    if (!form.password || form.password.length < 8) errs.password = 'Min. 8 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (Object.keys(errs).length) { setErrors(errs); return }
    const result = await dispatch(createPassword({ token: signupToken, password: form.password, confirmPassword: form.confirmPassword }))
    if (createPassword.fulfilled.match(result)) navigate('/dashboard')
  }

  const titles = {
    login: { h: 'Welcome back', sub: 'Sign in to your workspace' },
    signup: { h: 'Create your account', sub: 'Start your 14-day free trial' },
    otp: { h: 'Check your inbox', sub: `We sent a 6-digit code to ${form.email}` },
    workspace: { h: 'Set your password', sub: 'Almost there — one last step' },
  }

  return (
    <div className="min-h-screen flex bg-white">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex w-[480px] xl:w-[540px] shrink-0 flex-col relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a0f1c 0%, #0d1628 55%, #080d18 100%)' }}>

        {/* Subtle dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Amber glow top-left */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.18) 0%, transparent 65%)' }} />
        {/* Indigo glow bottom-right */}
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)' }} />

        <div className="relative flex flex-col h-full px-10 py-10 z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/40">
              <Zap size={17} className="text-white" fill="white" />
            </div>
            <div>
              <span className="font-display text-xl text-white tracking-tight leading-none">Tracker</span>
              <p className="text-xs text-white/30 mt-0.5">Customer Success Platform</p>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-3">Built for CS teams</p>
            <h2 className="font-display text-3xl xl:text-4xl text-white leading-tight">
              Resolve faster.<br />
              <span className="text-amber-400">Retain longer.</span>
            </h2>
          </div>

          {/* Illustration */}
          <div className="flex-1 flex items-center justify-center">
            <DashboardIllustration />
          </div>

          {/* Testimonial */}
          <div className="rounded-2xl border border-white/8 bg-white/4 p-5 backdrop-blur-sm mt-6">
            <div className="flex gap-1 mb-3">
              {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-xs">★</span>)}
            </div>
            <p className="text-sm text-white/60 leading-relaxed italic mb-4">
              "Tracker cut our average response time in half within the first month."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">P</div>
              <div>
                <p className="text-xs font-semibold text-white/80">Priya Sharma</p>
                <p className="text-xs text-white/30">Head of CS · TechCorp</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/20 mt-6 text-center">© 2025 Tracker · All rights reserved.</p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <span className="font-display text-lg text-slate-900">Tracker</span>
          </div>
          <div className="hidden lg:block" />
          <div className="text-xs text-slate-400">
            {mode === 'login' ? (
              <>No account?{' '}
                <button onClick={() => { setMode('signup'); setErrors({}) }} className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">Sign up free</button>
              </>
            ) : mode === 'signup' ? (
              <>Have an account?{' '}
                <button onClick={() => { setMode('login'); setErrors({}) }} className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">Sign in</button>
              </>
            ) : null}
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md animate-fade-up">

            <StepDots mode={mode} />

            {/* Heading */}
            <div className="mb-8">
              <h1 className="font-display text-3xl xl:text-4xl text-slate-900 leading-tight mb-2">
                {titles[mode].h}
              </h1>
              <p className="text-sm text-slate-400">{titles[mode].sub}</p>
            </div>

            {/* ── LOGIN ── */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <Field label="Work email" icon={Mail} type="email" placeholder="you@company.com"
                  value={form.email} error={errors.email}
                  onChange={e => { set('email', e.target.value); clearErr('email') }} />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                    <button type="button" className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors">Forgot password?</button>
                  </div>
                  <div className={`relative flex items-center rounded-xl border transition-all duration-200 bg-white ${
                    errors.password ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200 hover:border-slate-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100'
                  }`}>
                    <div className="pl-3.5 text-slate-300"><Lock size={15} strokeWidth={1.8} /></div>
                    <input type="password" placeholder="••••••••" value={form.password}
                      onChange={e => { set('password', e.target.value); clearErr('password') }}
                      className="flex-1 px-3 py-3 text-sm text-slate-800 placeholder-slate-300 bg-transparent focus:outline-none" />
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{errors.password}</p>}
                </div>

                <div className="flex items-center gap-2">
                  <input id="rememberMe" type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-amber-600 cursor-pointer" />
                  <label htmlFor="rememberMe" className="text-xs text-slate-500 cursor-pointer">Remember me</label>
                </div>

                {apiError && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle size={14} className="text-red-500 shrink-0" />
                    <p className="text-sm text-red-600">{apiError}</p>
                  </div>
                )}

                <button type="submit" disabled={apiLoading}
                  className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-70 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 hover:-translate-y-0.5 active:translate-y-0">
                  {apiLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><span>Sign in</span><ArrowRight size={15} /></>
                  )}
                </button>

                <div className="relative flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-xs text-slate-300 font-medium">or continue with</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                <button type="button"
                  className="w-full flex items-center justify-center gap-2.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-xl transition-all duration-200 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Sign in with Google
                </button>
              </form>
            )}

            {/* ── SIGNUP ── */}
            {mode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-5">
                <Field label="Full name" icon={User} placeholder="Alex Morgan"
                  value={form.name} error={errors.name}
                  onChange={e => { set('name', e.target.value); clearErr('name') }} />
                <Field label="Organisation name" icon={Building2} placeholder="Acme Corp"
                  value={form.org} error={errors.org}
                  onChange={e => { set('org', e.target.value); clearErr('org') }} />
                <Field label="Work email" icon={Mail} type="email" placeholder="you@company.com"
                  value={form.email} error={errors.email}
                  onChange={e => { set('email', e.target.value); clearErr('email') }} />

                {apiError && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle size={14} className="text-red-500 shrink-0" />
                    <p className="text-sm text-red-600">{apiError}</p>
                  </div>
                )}

                <button type="submit" disabled={apiLoading}
                  className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-70 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 hover:-translate-y-0.5 active:translate-y-0">
                  {apiLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Continue</span><ArrowRight size={15} /></>}
                </button>

                <p className="text-xs text-slate-400 text-center leading-relaxed">
                  By signing up you agree to our{' '}
                  <span className="text-amber-600 cursor-pointer hover:underline">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-amber-600 cursor-pointer hover:underline">Privacy Policy</span>
                </p>
              </form>
            )}

            {/* ── OTP ── */}
            {mode === 'otp' && (
              <div className="space-y-8">
                <div className="flex gap-3 justify-center">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={el => otpRefs.current[i] = el}
                      maxLength={1}
                      value={d}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => { if (e.key === 'Backspace' && !d && i > 0) otpRefs.current[i - 1]?.focus() }}
                      className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none bg-white text-slate-900
                        ${d ? 'border-amber-500 bg-amber-50 shadow-md shadow-amber-100' : 'border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100'}`}
                    />
                  ))}
                </div>

                {apiError && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle size={14} className="text-red-500 shrink-0" />
                    <p className="text-sm text-red-600">{apiError}</p>
                  </div>
                )}

                {apiLoading && (
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                    <span className="w-4 h-4 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
                    Verifying…
                  </div>
                )}

                <button
                  onClick={handleVerifyOtp}
                  disabled={apiLoading || otp.some(d => !d)}
                  className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-amber-600/20">
                  {apiLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Verify code</span><ArrowRight size={15} /></>}
                </button>

                <div className="text-center space-y-2">
                  <p className="text-xs text-slate-400">Didn't receive the code?</p>
                  <button type="button" className="text-sm text-amber-600 font-semibold hover:text-amber-700 transition-colors">
                    Resend code
                  </button>
                </div>

                <div className="flex items-center gap-2 justify-center text-xs text-slate-400">
                  <Clock size={12} />
                  Code expires in <span className="font-semibold text-slate-600">10:00</span>
                </div>
              </div>
            )}

            {/* ── PASSWORD SETUP ── */}
            {mode === 'workspace' && (
              <form onSubmit={handlePasswordSetup} className="space-y-5">
                <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  <p className="text-sm text-green-700 font-medium">Email verified successfully</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                  <div className={`relative flex items-center rounded-xl border transition-all duration-200 bg-white ${
                    errors.password ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200 hover:border-slate-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100'
                  }`}>
                    <div className="pl-3.5 text-slate-300"><Lock size={15} strokeWidth={1.8} /></div>
                    <input type="password" placeholder="Min. 8 characters" value={form.password}
                      onChange={e => { set('password', e.target.value); clearErr('password') }}
                      className="flex-1 px-3 py-3 text-sm text-slate-800 placeholder-slate-300 bg-transparent focus:outline-none" />
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{errors.password}</p>}
                  {form.password.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {[1,2,3,4].map(n => (
                        <div key={n} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          form.password.length >= n * 3
                            ? n <= 1 ? 'bg-red-400' : n <= 2 ? 'bg-amber-400' : n <= 3 ? 'bg-yellow-400' : 'bg-green-400'
                            : 'bg-slate-100'
                        }`} />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Confirm Password</label>
                  <div className={`relative flex items-center rounded-xl border transition-all duration-200 bg-white ${
                    errors.confirmPassword ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200 hover:border-slate-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100'
                  }`}>
                    <div className="pl-3.5 text-slate-300"><Lock size={15} strokeWidth={1.8} /></div>
                    <input type="password" placeholder="Re-enter password" value={form.confirmPassword}
                      onChange={e => { set('confirmPassword', e.target.value); clearErr('confirmPassword') }}
                      className="flex-1 px-3 py-3 text-sm text-slate-800 placeholder-slate-300 bg-transparent focus:outline-none" />
                  </div>
                  {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{errors.confirmPassword}</p>}
                </div>

                {apiError && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle size={14} className="text-red-500 shrink-0" />
                    <p className="text-sm text-red-600">{apiError}</p>
                  </div>
                )}

                <button type="submit" disabled={apiLoading}
                  className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-70 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 hover:-translate-y-0.5 active:translate-y-0">
                  {apiLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Create account</span><ArrowRight size={15} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
