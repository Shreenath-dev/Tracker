import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const BASE = 'http://localhost:5000/api/auth/users'

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe }),
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Sign in failed')
      return data
    } catch {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Session expired')
      return data
    } catch {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

export const fetchAdminProfile = createAsyncThunk(
  'auth/fetchAdminProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth
      const res = await fetch('http://localhost:5000/api/v1/users/get-admin-info', {
        method: 'GET',
        headers: { Authorization: accessToken },
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch profile')
      return data.data
    } catch {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth
      const res = await fetch(`${BASE}/signout`, {
        method: 'POST',
        headers: { Authorization: accessToken },
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Sign out failed')
      return data
    } catch {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

export const createPassword = createAsyncThunk(
  'auth/createPassword',
  async ({ token, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/create-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token, password, confirmPassword }),
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Failed to create password')
      return data
    } catch {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ token, otp }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token, otp }),
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Verification failed')
      return data
    } catch {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({ name, email, orgName }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, orgName }),
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Signup failed')
      return data
    } catch {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    bootstrapping: true,
    signupToken: null,
    accessToken: null,
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
      state.isAuthenticated = true
      state.otpSent = false
    },
    login(state, action) {
      state.user = action.payload ?? null
      state.isAuthenticated = true
      state.error = null
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      state.signupToken = null
      state.accessToken = null
    },
    setError(state, action) {
      state.error = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false
        state.signupToken = action.payload.token
        state.otpSent = true
        state.otpEmail = action.meta.arg.email
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false
        state.signupToken = action.payload.token
        state.otpSent = false
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPassword.fulfilled, (state, action) => {
        state.loading = false
        state.accessToken = action.payload.accessToken
        state.isAuthenticated = true
        state.signupToken = null
      })
      .addCase(createPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(signIn.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false
        state.accessToken = action.payload.accessToken
        state.isAuthenticated = true
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken
        state.isAuthenticated = true
        state.bootstrapping = false
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.isAuthenticated = false
        state.accessToken = null
        state.bootstrapping = false
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.accessToken = null
      })
      .addCase(signOut.rejected, (state) => {
        // force local logout even if API fails
        state.user = null
        state.isAuthenticated = false
        state.accessToken = null
      })
  },
})

export const { sendOtp, verifyOtp, login, logout, setError, clearError } = authSlice.actions
export default authSlice.reducer
