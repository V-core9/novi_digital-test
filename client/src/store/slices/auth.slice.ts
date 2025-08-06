import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import fetchWrapper from '../../utils/fetchWrapper'
import apiLocation from '../../configs/apiLocation'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: any
  isLoading: boolean
}

const initialState: AuthState = JSON.parse(localStorage.getItem('user') || '{}') || {
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoading: false
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await fetchWrapper.post(apiLocation + '/auth/login', credentials, { auth: false })
      return res
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null
      state.refreshToken = null
      state.user = null
      localStorage.removeItem('user')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.user = action.payload.user
        state.isLoading = false

        localStorage.setItem('user', JSON.stringify(state))
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false
      })
  }
})

export const authActions = { ...authSlice.actions, login }
export default authSlice.reducer
