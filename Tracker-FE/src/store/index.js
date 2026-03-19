import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import ticketsReducer from './slices/ticketsSlice'
import contactsReducer from './slices/contactsSlice'
import teamReducer from './slices/teamSlice'
import notificationsReducer from './slices/notificationsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketsReducer,
    contacts: contactsReducer,
    team: teamReducer,
    notifications: notificationsReducer,
  },
})
