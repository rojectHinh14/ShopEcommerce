import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
      state.user = null
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },
    restoreAuth: (state) => {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user'))
      state.isAuthenticated = !!token
      state.user = user
    }
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, updateUser, restoreAuth } = userSlice.actions
export default userSlice.reducer
