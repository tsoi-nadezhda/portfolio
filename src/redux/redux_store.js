import { combineReducers, applyMiddleware } from "redux"
import { configureStore } from '@reduxjs/toolkit'
import sidebarReducer from "./sidebar_reducer"
import profileReducer from "./profile_reducer"
import dialogsReducer from "./dialogs_reducer"
import usersReducer from "./users_reducer"
import authReducer from "./auth_reducer"
import { thunk as thunkMiddleware } from "redux-thunk"
import appReducer from "./app_reducer"

let reducers = combineReducers({
    profilePage: profileReducer,
    messagesPage: dialogsReducer,
    sidebar: sidebarReducer,
    usersPage: usersReducer,
    auth: authReducer,
    app: appReducer
})

// let store = createStore(reducers);
let store = configureStore({ reducer: reducers }, applyMiddleware(thunkMiddleware))
window.store = store;
export default store