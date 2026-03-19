import { createSlice } from '@reduxjs/toolkit'

const mockMembers = [
  { id: 'u1', name: 'Alex Morgan', email: 'alex@acme.com', role: 'admin', team: 'Support', lastActive: Date.now() - 300000, resolved: 42, avgResponse: '1h 12m', open: 3 },
  { id: 'u2', name: 'Jordan Lee', email: 'jordan@acme.com', role: 'manager', team: 'Enterprise', lastActive: Date.now() - 3600000, resolved: 28, avgResponse: '2h 05m', open: 5 },
  { id: 'u3', name: 'Sarah Chen', email: 'sarah@acme.com', role: 'agent', team: 'Support', lastActive: Date.now() - 7200000, resolved: 19, avgResponse: '3h 40m', open: 7 },
  { id: 'u4', name: 'Ravi Patel', email: 'ravi@acme.com', role: 'agent', team: 'Onboarding', lastActive: Date.now() - 86400000, resolved: 11, avgResponse: '4h 20m', open: 2 },
]

const teamSlice = createSlice({
  name: 'team',
  initialState: { members: mockMembers, teams: ['Support', 'Enterprise', 'Onboarding'] },
  reducers: {
    inviteMember(state, action) {
      state.members.push({ ...action.payload, id: `u${state.members.length + 1}`, lastActive: null, resolved: 0, avgResponse: '—', open: 0 })
    },
    removeMember(state, action) {
      state.members = state.members.filter(m => m.id !== action.payload)
    },
    updateMemberRole(state, action) {
      const m = state.members.find(m => m.id === action.payload.id)
      if (m) m.role = action.payload.role
    },
  },
})

export const { inviteMember, removeMember, updateMemberRole } = teamSlice.actions
export default teamSlice.reducer
