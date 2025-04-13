import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  validationMessage: null,
  profileData: null,
  courier: [],
  client: [],
  user: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.currentUser = action.payload
    },
    logoutUser: (state, action) => {
      state.currentUser = action.payload
    },
    setValidationMessage: (state, action) => {
      state.validationMessage = action.payload
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    }
  },
})

export const {
  loginUser,
  logoutUser,
  setValidationMessage,
  setUser,
} = userSlice.actions;

export default userSlice.reducer
