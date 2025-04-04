import { createSlice } from "@reduxjs/toolkit"
import { jwtDecode, JwtPayload } from "jwt-decode"

export interface User {
    name: string;
    email: string;
    password: string;
    schedules?: { _id: string}[];
    preferences: {
        sleep: {
            start: number;
            end: number;
        },
        fixedTasks: {
            name: string;
            day:  number[];
            start: number;
            end: number;
        }[];
    };
    tasks: { _id: string }[];
    createdAt: string,
    updatedAt: string,
    _id: string,
}

interface userJwtPayload extends JwtPayload {
    user: User;
}

interface initialState {
    isLoggedIn: boolean,
    user: User | null,
}

const initialState : initialState = {
    isLoggedIn: false,
    user: null,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess(state, action) {
            localStorage.setItem("token", action.payload);
            state.user = jwtDecode<userJwtPayload>(action.payload).user
            state.isLoggedIn = true
        },
        logout(state) {
            localStorage.removeItem("token");
            state.isLoggedIn = false;
            state.user = null;
        },
        refreshUserInfo(state, action) {
            state.user = jwtDecode<userJwtPayload>(action.payload).user
        }
    }
})

export const {
    loginSuccess,
    logout,
    refreshUserInfo
} = authSlice.actions 

export default authSlice.reducer