import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { sendOtp, verifyOtp, login } from '../store/slices/authSlice'

export default function AuthPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') 
  const [form, setForm] = useState({ name: '', email: '', password: '', workspace: '' })
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const otpRefs = useRef([])

  function handleOtpChange(i, val) {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) otpRefs.current[i + 1]?.focus()
    if (next.every(d => d !== '') && i === 5) handleOtpSubmit(next.join(''))
  }

  function handleOtpSubmit(code) {
    if (code.length === 6) {
      dispatch(verifyOtp())
      navigate('/dashboard')
    }
  }

  function handleLogin(e) {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill all fields'); return }
    dispatch(login())
    navigate('/dashboard')
  }

  function handleSignup(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError('Please fill all fields'); return }
    dispatch(sendOtp(form.email))
    setMode('otp')
    setError('')
  }

  function handleWorkspace(e) {
    e.preventDefault()
    if (!form.workspace) { setError('Enter your organisation name'); return }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-[420px] shrink-0 bg-slate-950 flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #d97706 0%, transparent 60%), radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 50%)' }} />
        <div className="relative">
          <span className="font-display text-2xl text-white tracking-tight">Tracker</span>
          <p className="text-slate-400 text-sm mt-1">Customer Success Platform</p>
        </div>
        <div className="relative space-y-6">
          {[
            { stat: '99.2%', label: 'SLA compliance rate' },
            { stat: '< 2h', label: 'Average first response' },
            { stat: '4.8★', label: 'Customer satisfaction' },
          ].map(({ stat, label }) => (
            <div key={label} className="border-l-2 border-amber-500 pl-4">
              <p className="font-display text-3xl text-white">{stat}</p>
              <p className="text-slate-400 text-sm">{label}</p>
            </div>
          ))}
        </div>
        <p className="relative text-slate-500 text-xs">© 2025 Tracker. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-8">
            <h2 className="font-display text-3xl text-slate-900">
              {mode === 'login' && 'Welcome back'}
              {mode === 'signup' && 'Create account'}
              {mode === 'otp' && 'Check your email'}
              {mode === 'workspace' && 'Name your workspace'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {mode === 'login' && 'Sign in to your workspace'}
              {mode === 'signup' && 'Start your free trial'}
              {mode === 'otp' && `We sent a code to ${form.email}`}
              {mode === 'workspace' && 'One last step'}
            </p>
          </div>

          {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">{error}</div>}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Work email</label>
                <input className="input-base" type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Password</label>
                <input className="input-base" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <button type="submit" className="btn-primary w-full py-2.5 text-sm">Sign in</button>
              <p className="text-center text-xs text-slate-500">
                No account?{' '}
                <button type="button" onClick={() => { setMode('signup'); setError('') }} className="text-amber-600 font-medium hover:text-amber-700">Sign up</button>
              </p>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Full name</label>
                <input className="input-base" placeholder="Alex Morgan" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Work email</label>
                <input className="input-base" type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Password</label>
                <input className="input-base" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <button type="submit" className="btn-primary w-full py-2.5 text-sm">Continue</button>
              <p className="text-center text-xs text-slate-500">
                Have an account?{' '}
                <button type="button" onClick={() => { setMode('login'); setError('') }} className="text-amber-600 font-medium hover:text-amber-700">Sign in</button>
              </p>
            </form>
          )}

          {mode === 'otp' && (
            <div className="space-y-6">
              <div className="flex gap-2 justify-center">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    className="w-11 h-12 text-center text-lg font-semibold border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white text-slate-900 transition-all"
                    maxLength={1}
                    value={d}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => { if (e.key === 'Backspace' && !d && i > 0) otpRefs.current[i - 1]?.focus() }}
                  />
                ))}
              </div>
              <button onClick={() => handleOtpSubmit(otp.join(''))} className="btn-primary w-full py-2.5 text-sm">Verify code</button>
              <p className="text-center text-xs text-slate-500">
                Didn't receive it?{' '}
                <button type="button" className="text-amber-600 font-medium hover:text-amber-700">Resend</button>
              </p>
            </div>
          )}

          {mode === 'workspace' && (
            <form onSubmit={handleWorkspace} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Organisation name</label>
                <input className="input-base" placeholder="Acme Corp" value={form.workspace} onChange={e => setForm(f => ({ ...f, workspace: e.target.value }))} />
              </div>
              <button type="submit" className="btn-primary w-full py-2.5 text-sm">Enter workspace</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
