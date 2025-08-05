import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'

// import { toast } from 'react-toastify'

import { history, fetchWrapper } from '../../helpers'

// create slice
const name = 'auth'

const initialState = {
  user: JSON.parse(localStorage.getItem('user')),
  loading: null,
  error: null
}

const slice = createSlice({
  name,
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      localStorage.removeItem('user')
      // toast('User Logged Out!', { type: 'info' })
      //window.location.reload();
    }
  },
  extraReducers(builder) {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.error = null
        // toast("Login Attempted", { type: "info" });
      })
      .addCase(login.fulfilled, (state, action) => {
        let user = action.payload

        const { accessToken, refreshToken } = user

        user = jwtDecode(refreshToken)
        user.accessToken = jwtDecode(accessToken)
        user.accessToken.token = accessToken
        user.refreshToken = jwtDecode(refreshToken)
        user.refreshToken.token = refreshToken

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user))
        state.user = user

        // get return url from location state or default to home page
        history.navigate('/')
        // toast('Login Successful!', { type: 'success' })
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error
        // toast(state.error.message, { type: 'error' })
      })

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        // get return url from location state or default to home page
        const { from } = history.location.state || { from: { pathname: '/login' } }
        history.navigate(from)
        // toast('Register Successful!', { type: 'success' })
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.error
        // toast(state.error.message, { type: 'error' })
      })

    // Refresh Auth Tokens
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        let user = action.payload

        const { accessToken, refreshToken } = user

        user = jwtDecode(refreshToken)
        user.accessToken = jwtDecode(accessToken)
        user.accessToken.token = accessToken
        user.refreshToken = jwtDecode(refreshToken)
        user.refreshToken.token = refreshToken

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user))
        state.user = user
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.error = action.error
      })
  }
})

const login = createAsyncThunk(
  `${name}/login`,
  async ({ email, password }) => await fetchWrapper.post(`http://localhost/api/auth/login`, { email, password })
)

const register = createAsyncThunk(
  `${name}/register`,
  async ({ username, email, password }) =>
    await fetchWrapper.post(`http://localhost/api/auth/register`, { username, email, password })
)

const refreshToken = createAsyncThunk(
  `${name}/refreshToken`,
  async ({ refreshToken }) => await fetchWrapper.post(`http://localhost/api/auth/refreshToken`, { refreshToken })
)

// ACTUAL EXPORTS
export const authActions = { ...slice.actions, login, register, refreshToken }
export default slice.reducer
