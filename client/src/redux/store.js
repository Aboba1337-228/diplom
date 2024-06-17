import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import regSlice from "./regSlice";
import mainSlice from "./mainSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        reg: regSlice,
        main: mainSlice
    }
})

// Использовать слайс мэин только там, где в запросе проверка роли