import {createStore, combineReducers, applyMiddleware} from "redux"
import { configureStore } from '@reduxjs/toolkit'
import sidebarReducer from "./sidebar_reducer"
import profileReducer from "./profile_reducer"
import dialogsReducer from "./dialogs_reducer"
import usersReducer from "./users_reducer"
import authReducer from "./auth_reducer"
import {thunk as thunkMiddleware} from "redux-thunk"

let reducers = combineReducers({
    profilePage:profileReducer,
    messagesPage:dialogsReducer,
    sidebar:sidebarReducer,
    usersPage:usersReducer,
    auth:authReducer

})

// let store = createStore(reducers);
let store = configureStore({ reducer: reducers },applyMiddleware(thunkMiddleware))
window.store = store;
export default store