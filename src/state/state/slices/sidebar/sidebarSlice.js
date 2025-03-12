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
    }
  },
})

export const {
  setShowSidebar,
} = sidebarSlice.actions

export default sidebarSlice.reducer
