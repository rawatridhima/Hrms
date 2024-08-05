import { createSlice } from "@reduxjs/toolkit";


const Auth=createSlice({
    name:'Auth',
    initialState:{
        isAuth:false,
        user:null,
        isRemember:false,
        remember_token: null
    },
    reducers:{
        login:(state,action)=>{
            state.isAuth=true
            state.user=action.payload.user
            state.isRemember=action.payload.isRemember
            state.remember_token = action.payload.isRemember ? null : (new Date(Date.now() + 1* 60 * 60 * 1000)).getTime();
        },
        logout:(state)=>{
            state.isAuth=false
            state.user=null
            state.isRemember=false
            state.remember_token = null;
        }
    }
})
export const {login,logout} =Auth.actions;
export const authReducer=Auth.reducer;