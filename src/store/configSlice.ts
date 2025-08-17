import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    port :"",
    baud:0,
}


const configSlice = createSlice({
    name:"configSlice",
    initialState,
    reducers:{
        addConfig:(state,action)=>{
            state.baud = action.payload.baud;
            state.port = action.payload.port;
        }
    }
})

export const {addConfig} = configSlice.actions

export const configReducer = configSlice.reducer