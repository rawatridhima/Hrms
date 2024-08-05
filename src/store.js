import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { authReducer } from './Reducers/AuthReducer'
import { Theme } from "./Reducers/Theme";

export default configureStore({
  reducer:persistReducer({
        key:'root',
        version:1,
        storage
    },combineReducers({
        auth:authReducer,
        theme:Theme.reducer
    }))
  
})

