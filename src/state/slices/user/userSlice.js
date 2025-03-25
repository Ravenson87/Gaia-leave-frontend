import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  validationMessage: null,
  user: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.currentUser = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    logoutUser: (state, action) => {
      state.currentUser = action.payload
    }
  },
})

export const {
  loginUser,
  logoutUser,
  setUser
} = userSlice.actions;

export default userSlice.reducer
