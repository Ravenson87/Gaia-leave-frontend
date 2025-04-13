import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  sidebarShow: false,
  data: null,
  notification: [],
  oldMessage: []
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setShowSidebar: (state, action) => {
      state.sidebarShow = action.payload
    },
    setData: (state, action) => {
      state.data = action.payload
    },
    setNotification: (state, action) => {
      state.notification = action.payload
    },
    setOldMessage: (state, action) => {
      state.oldMessage = action.payload
    },
  },
})

export const {
  setShowSidebar,
  setData,
  setNotification,
  setOldMessage
} = sidebarSlice.actions

export default sidebarSlice.reducer
