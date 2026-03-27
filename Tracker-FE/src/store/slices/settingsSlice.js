import { createSlice } from '@reduxjs/toolkit'

const permissionModules = [
  { id: 'tickets', label: 'Tickets' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'team', label: 'Team Members' },
  { id: 'roles', label: 'Roles & Policies' },
  { id: 'canned', label: 'Canned Responses' },
  { id: 'sla', label: 'SLA Rules' },
  { id: 'settings', label: 'Billing & Integrations' },
]

const adminPerms = permissionModules.flatMap(m => [`${m.id}_view`, `${m.id}_create`, `${m.id}_edit`, `${m.id}_delete`])
const managerPerms = [...adminPerms.filter(p => !p.startsWith('settings_') && !p.startsWith('roles_'))]
const agentPerms = ['tickets_view', 'tickets_create', 'tickets_edit', 'contacts_view', 'canned_view']

const mockPolicies = [
  { id: 'pol_1', name: 'Full Admin Access', permissions: adminPerms },
  { id: 'pol_2', name: 'Basic Support', permissions: agentPerms },
  { id: 'pol_3', name: 'Manager Access', permissions: managerPerms },
]

const mockRoles = [
  { id: 'admin', name: 'Admin', policies: ['pol_1'] },
  { id: 'manager', name: 'Manager', policies: ['pol_3'] },
  { id: 'agent', name: 'Agent', policies: ['pol_2'] },
]

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    permissions: permissionModules, // Renamed from flat list to the modular matrix view
    policies: mockPolicies,
    roles: mockRoles,
  },
  reducers: {
    addPolicy(state, action) {
      state.policies.push({ id: `pol_${Date.now()}`, ...action.payload })
    },
    removePolicy(state, action) {
      state.policies = state.policies.filter(p => p.id !== action.payload)
    },
    updatePolicy(state, action) {
      const idx = state.policies.findIndex(p => p.id === action.payload.id)
      if (idx !== -1) state.policies[idx] = action.payload
    },
    addRole(state, action) {
      state.roles.push({ id: `role_${Date.now()}`, ...action.payload })
    },
    removeRole(state, action) {
      state.roles = state.roles.filter(r => r.id !== action.payload)
    },
    updateRole(state, action) {
      const idx = state.roles.findIndex(r => r.id === action.payload.id)
      if (idx !== -1) state.roles[idx] = action.payload
    },
  },
})

export const { addPolicy, removePolicy, updatePolicy, addRole, removeRole, updateRole } = settingsSlice.actions
export default settingsSlice.reducer
