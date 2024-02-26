import {createStore, combineReducers} from "redux"
import { configureStore } from '@reduxjs/toolkit'
import sidebarReducer from "./sidebar_reducer"
import profileReducer from "./profile_reducer"
import dialogsReducer from "./dialogs_reducer"
import usersReducer from "./users_reducer"

let reducers = combineReducers({
    profilePage:profileReducer,
    messagesPage:dialogsReducer,
    sidebar:sidebarReducer,
    usersPage:usersReducer

})

// let store = createStore(reducers);
let store = configureStore({ reducer: reducers })
window.store = store;
export default store