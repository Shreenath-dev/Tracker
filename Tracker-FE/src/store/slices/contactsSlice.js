import { createSlice } from '@reduxjs/toolkit'

const mockContacts = [
  { id: 'c1', name: 'Priya Sharma', email: 'priya@techcorp.io', company: 'TechCorp', phone: '+1 555-0101', notes: 'Enterprise client, high priority.' },
  { id: 'c2', name: 'Marcus Webb', email: 'marcus@startupxyz.com', company: 'StartupXYZ', phone: '+1 555-0102', notes: '' },
  { id: 'c3', name: 'Lena Fischer', email: 'lena@globalinc.de', company: 'Global Inc', phone: '+49 30 555-0103', notes: 'German timezone, prefers async.' },
  { id: 'c4', name: 'James Okafor', email: 'james@devstudio.ng', company: 'DevStudio', phone: '+234 555-0104', notes: '' },
  { id: 'c5', name: 'Sofia Reyes', email: 'sofia@cloudbase.mx', company: 'CloudBase', phone: '+52 55 555-0105', notes: 'API-heavy integration customer.' },
]

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: { items: mockContacts, search: '' },
  reducers: {
    setSearch(state, action) { state.search = action.payload },
    createContact(state, action) {
      state.items.push({ ...action.payload, id: `c${state.items.length + 1}` })
    },
    updateContact(state, action) {
      const idx = state.items.findIndex(c => c.id === action.payload.id)
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload }
    },
  },
})

export const { setSearch, createContact, updateContact } = contactsSlice.actions
export default contactsSlice.reducer
