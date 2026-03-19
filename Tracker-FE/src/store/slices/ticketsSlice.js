import { createSlice } from '@reduxjs/toolkit'

const now = Date.now()
const h = (n) => now - n * 3600000

const mockTickets = [
  { id: 'T-001', title: 'Login page throws 500 on mobile Safari', description: 'Users on iOS 17 Safari cannot log in. Console shows CORS error.', contact: 'c1', assignee: 'u1', priority: 'urgent', status: 'open', tags: ['bug', 'auth'], source: 'widget', createdAt: h(2), slaDeadline: h(-1), updatedAt: h(1) },
  { id: 'T-002', title: 'Export CSV missing last 30 days of data', description: 'The CSV export cuts off at 30 days regardless of date range selected.', contact: 'c2', assignee: 'u2', priority: 'high', status: 'inprogress', tags: ['export', 'data'], source: 'manual', createdAt: h(8), slaDeadline: h(4), updatedAt: h(3) },
  { id: 'T-003', title: 'Onboarding email not received', description: 'New user signed up but never received the welcome email.', contact: 'c3', assignee: 'u1', priority: 'medium', status: 'waiting', tags: ['email', 'onboarding'], source: 'widget', createdAt: h(24), slaDeadline: h(48), updatedAt: h(6) },
  { id: 'T-004', title: 'Dashboard charts not loading on Firefox', description: 'Recharts components fail silently on Firefox 120+.', contact: 'c4', assignee: 'u3', priority: 'medium', status: 'open', tags: ['bug', 'ui'], source: 'manual', createdAt: h(12), slaDeadline: h(36), updatedAt: h(10) },
  { id: 'T-005', title: 'Billing invoice shows wrong amount', description: 'Invoice for November shows $299 instead of $199.', contact: 'c1', assignee: 'u2', priority: 'high', status: 'open', tags: ['billing'], source: 'manual', createdAt: h(5), slaDeadline: h(3), updatedAt: h(4) },
  { id: 'T-006', title: 'API rate limit too aggressive', description: 'Hitting 429 errors at 80 req/min, well below the documented 200 limit.', contact: 'c5', assignee: 'u1', priority: 'high', status: 'inprogress', tags: ['api'], source: 'widget', createdAt: h(18), slaDeadline: h(14), updatedAt: h(7) },
  { id: 'T-007', title: 'Password reset link expired immediately', description: 'Reset link expires before user can click it.', contact: 'c2', assignee: 'u3', priority: 'urgent', status: 'resolved', tags: ['auth', 'bug'], source: 'manual', createdAt: h(48), slaDeadline: h(47), updatedAt: h(20) },
  { id: 'T-008', title: 'Webhook not firing on ticket.resolved', description: 'ticket.resolved event never reaches our endpoint.', contact: 'c4', assignee: 'u2', priority: 'low', status: 'waiting', tags: ['webhook', 'integration'], source: 'manual', createdAt: h(36), slaDeadline: h(108), updatedAt: h(12) },
]

const mockReplies = {
  'T-001': [
    { id: 'r1', author: 'Alex Morgan', type: 'internal', content: 'Reproduced on iPhone 14 Pro. Looks like the CORS header is missing on the /auth endpoint.', createdAt: h(1.5) },
    { id: 'r2', author: 'Sarah Chen', type: 'client', content: 'This is blocking our entire mobile team. Please prioritize.', createdAt: h(1) },
  ],
  'T-002': [
    { id: 'r3', author: 'Jordan Lee', type: 'internal', content: 'Traced to the date filter query — it hardcodes a 30-day window. Fix in progress.', createdAt: h(4) },
  ],
}

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState: {
    items: mockTickets,
    replies: mockReplies,
    selectedId: null,
    view: 'list',
    filters: { status: '', priority: '', assignee: '', search: '' },
    selectedIds: [],
  },
  reducers: {
    selectTicket(state, action) { state.selectedId = action.payload },
    closeTicket(state) { state.selectedId = null },
    setView(state, action) { state.view = action.payload },
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    createTicket(state, action) {
      state.items.unshift({ ...action.payload, id: `T-${String(state.items.length + 1).padStart(3, '0')}`, createdAt: Date.now(), updatedAt: Date.now() })
    },
    updateTicket(state, action) {
      const idx = state.items.findIndex(t => t.id === action.payload.id)
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload, updatedAt: Date.now() }
    },
    deleteTicket(state, action) {
      state.items = state.items.filter(t => t.id !== action.payload)
    },
    addReply(state, action) {
      const { ticketId, reply } = action.payload
      if (!state.replies[ticketId]) state.replies[ticketId] = []
      state.replies[ticketId].push({ ...reply, id: `r${Date.now()}`, createdAt: Date.now() })
    },
    toggleSelectTicket(state, action) {
      const id = action.payload
      if (state.selectedIds.includes(id)) state.selectedIds = state.selectedIds.filter(i => i !== id)
      else state.selectedIds.push(id)
    },
    clearSelection(state) { state.selectedIds = [] },
    bulkUpdate(state, action) {
      const { ids, changes } = action.payload
      state.items = state.items.map(t => ids.includes(t.id) ? { ...t, ...changes, updatedAt: Date.now() } : t)
      state.selectedIds = []
    },
    moveTicket(state, action) {
      const { id, status } = action.payload
      const idx = state.items.findIndex(t => t.id === id)
      if (idx !== -1) state.items[idx] = { ...state.items[idx], status, updatedAt: Date.now() }
    },
  },
})

export const { selectTicket, closeTicket, setView, setFilter, createTicket, updateTicket, deleteTicket, addReply, toggleSelectTicket, clearSelection, bulkUpdate, moveTicket } = ticketsSlice.actions
export default ticketsSlice.reducer
