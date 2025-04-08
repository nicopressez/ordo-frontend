import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import navReducer from "./nav"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        nav: navReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;