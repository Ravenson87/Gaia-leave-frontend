import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    validationMessage: null,
    profileData: null,
    courier: [],
    client: [],
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            console.log("loginUser", state, action)
            state.currentUser = action.payload
        },
        logoutUser: (state, action) => {
            state.currentUser = action.payload
        }
    },
})

export const {
    loginUser,
    logoutUser
} = userSlice.actions;

export default userSlice.reducer
