import { configureStore } from "@reduxjs/toolkit";
import { configReducer } from "./configSlice";

const store = configureStore({
    reducer:{
        configSlice:configReducer
    }
})

export default store

export type portConfigState = ReturnType<typeof store.getState>