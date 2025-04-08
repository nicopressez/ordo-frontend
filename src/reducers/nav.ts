import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showNav: false,
}

const navSlice = createSlice({
    name: "nav",
    initialState,
    reducers: {
        toggleNav(state) {
            const newState = !state.showNav
            state.showNav = newState;
        }
    }
})

export const { toggleNav } = navSlice.actions;

export default navSlice.reducer;
