import { createSlice } from '@reduxjs/toolkit'

const mockNotifications = [
  { id: 'n1', type: 'assignment', message: 'T-006 assigned to you by Jordan Lee', read: false, createdAt: Date.now() - 600000 },
  { id: 'n2', type: 'sla_warning', message: 'T-005 SLA breach in 30 minutes', read: false, createdAt: Date.now() - 1200000 },
  { id: 'n3', type: 'reply', message: 'Sarah Chen replied on T-001', read: false, createdAt: Date.now() - 3600000 },
  { id: 'n4', type: 'sla_breach', message: 'T-001 SLA breached — escalated', read: true, createdAt: Date.now() - 7200000 },
  { id: 'n5', type: 'status', message: 'T-007 resolved by Sarah Chen', read: true, createdAt: Date.now() - 86400000 },
]

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { items: mockNotifications },
  reducers: {
    markRead(state, action) {
      const n = state.items.find(n => n.id === action.payload)
      if (n) n.read = true
    },
    markAllRead(state) {
      state.items.forEach(n => { n.read = true })
    },
    addNotification(state, action) {
      state.items.unshift({ ...action.payload, id: `n${Date.now()}`, read: false, createdAt: Date.now() })
    },
  },
})

export const { markRead, markAllRead, addNotification } = notificationsSlice.actions
export default notificationsSlice.reducer
