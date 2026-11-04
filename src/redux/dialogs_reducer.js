import { dialogsAPI } from "../api/api"
const SEND_MESSAGE = "SEND-MESSAGE"
const UPDATE_TEXT_MESSAGE = "UPDATE-TEXT-MESSAGE"
const SET_DIALOGS = "SET_DIALOGS"
const SET_MESSAGES = "SET_MESSAGES"
const DELETE_MESSAGE = "DELETE-MESSAGE"

export const updateTextMessageActionCreator = (text) => ({ type: UPDATE_TEXT_MESSAGE, message: text })
export const getDialogs = () => (dispatch) => {
    return dialogsAPI.getDialogs().then((response) => {
        if (response.data.resultCode === 0) {
            dispatch({ type: SET_DIALOGS, dialogs: response.data.data.dialogs })
        }
    })
}
let messagesRequest = 0
export const getMessages = (userId, silent = false) => (dispatch) => {
    const requestId = ++messagesRequest
    if (!silent) dispatch({ type: SET_MESSAGES, messages: [], user: null })
    return dialogsAPI.getMessages(userId).then((response) => {
        if (requestId !== messagesRequest) return
        if (response.data.resultCode === 0) {
            dispatch({
                type: SET_MESSAGES,
                messages: response.data.data.messages,
                user: response.data.data.user
            })
        }
    })
}
export const sendMessage = (userId) => (dispatch, getState) => {
    const message = getState().messagesPage.newMessage
    if (!userId || !message || !message.trim()) return
    messagesRequest += 1
    return dialogsAPI.sendMessage(userId, message.trim()).then((response) => {
        if (response.data.resultCode === 0) {
            dispatch({ type: SEND_MESSAGE, userId: Number(userId), message: response.data.data.message })
            dispatch(getDialogs())
        }
    })
}
export const deleteMessage = (userId, messageId) => (dispatch) => {
    messagesRequest += 1
    return dialogsAPI.deleteMessage(messageId).then((response) => {
        if (response.data.resultCode === 0) {
            dispatch({ type: DELETE_MESSAGE, userId: Number(userId), messageId })
            dispatch(getDialogs())
        }
    })
}

let initialState = {
    newMessage: "",
    messagesData: [],
    dialogsData: [],
    chatUser: null
}
const dialogReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEND_MESSAGE: {
            const exists = state.dialogsData.some(dialog => dialog.id === action.userId)
            const dialogsData = exists
                ? state.dialogsData.map(dialog => dialog.id === action.userId
                    ? { ...dialog, lastMessage: action.message.message }
                    : dialog)
                : [{
                    id: action.userId,
                    name: state.chatUser && state.chatUser.id === action.userId ? state.chatUser.name : "User",
                    photo: null,
                    lastMessage: action.message.message
                }, ...state.dialogsData]
            return {
                ...state,
                newMessage: "",
                messagesData: [...state.messagesData, action.message],
                dialogsData
            };
        }
        case DELETE_MESSAGE: {
            const messagesData = state.messagesData.filter(message => message.id !== action.messageId)
            const last = messagesData[messagesData.length - 1]
            return {
                ...state,
                messagesData,
                dialogsData: state.dialogsData.map(dialog => dialog.id === action.userId
                    ? { ...dialog, lastMessage: last ? last.message : null }
                    : dialog)
            }
        }
        case SET_DIALOGS: {
            return { ...state, dialogsData: action.dialogs }
        }
        case SET_MESSAGES: {
            return { ...state, messagesData: action.messages, chatUser: action.user }
        }
        case UPDATE_TEXT_MESSAGE: {
            return { ...state, newMessage: action.message }
        }
        default: return state;
    }
}
export default dialogReducer;
