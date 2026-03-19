import { createSlice } from '@reduxjs/toolkit'

const mockUser = {
  id: 'u1',
  name: 'Alex Morgan',
  email: 'alex@acme.com',
  role: 'admin',
  avatar: null,
  workspace: 'Acme Corp',
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    otpSent: false,
    otpEmail: '',
    loading: false,
    error: null,
  },
  reducers: {
    sendOtp(state, action) {
      state.otpSent = true
      state.otpEmail = action.payload
      state.error = null
    },
    verifyOtp(state) {
      state.user = mockUser
      state.isAuthenticated = true
      state.otpSent = false
    },
    login(state) {
      state.user = mockUser
      state.isAuthenticated = true
      state.error = null
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
    },
    setError(state, action) {
      state.error = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
})

export const { sendOtp, verifyOtp, login, logout, setError, clearError } = authSlice.actions
export default authSlice.reducer
