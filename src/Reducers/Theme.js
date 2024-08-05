import { createSlice } from "@reduxjs/toolkit";
import { COLORS, MODES } from "../Helper/Helper";

const initialState={
    mode:MODES.LIGHT,
    colors:COLORS.LIGHT
}

export const Theme=createSlice({
    name:'Theme',
    initialState,
    reducers:{
        toggleLight:(state)=>{
            state.mode =MODES.LIGHT;
            state.colors=COLORS.LIGHT;
        },
        toggleDark:(state)=>{
            state.mode =MODES.DARK;
            state.colors=COLORS.DARK;
        }
       
    }
})

export const { toggleDark, toggleLight } = Theme.actions;
