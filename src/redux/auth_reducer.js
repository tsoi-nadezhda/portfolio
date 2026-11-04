import { authAPI } from "../api/api"
import { setCurrentUserId } from "./users_reducer"
const SET_USER_DATA = "SET_USER_DATA";
const UNSET_USER_DATA = "UNSET_USER_DATA";
const SET_AUTH_ERROR = "SET_AUTH_ERROR";
const SET_PENDING_EMAIL = "SET_PENDING_EMAIL";
export const setAuthUserData = (userId, email, login, name) => ({ type: SET_USER_DATA, data: { userId, email, login, name } });
export const unsetAuthUserData = () => ({ type: UNSET_USER_DATA, data: {} });
export const clearAuthError = () => ({ type: SET_AUTH_ERROR, error: null });
export const clearPendingEmail = () => ({ type: SET_PENDING_EMAIL, email: null });
const authError = (response) => (response.data.messages && response.data.messages[0]) || "Something went wrong"
export const logIn = (email, password, rememberMe) => (dispatch) => {
   dispatch({ type: SET_AUTH_ERROR, error: null })
   return authAPI.logIn(email, password, rememberMe).then((response) => {
      if (response.data.resultCode === 0) {
         return dispatch(getAuthUserData())
      }
      dispatch({ type: SET_AUTH_ERROR, error: authError(response) })
   }).catch(() => {
      dispatch({ type: SET_AUTH_ERROR, error: "Cannot reach the server" })
   })
}
export const signUp = (name, email, password) => (dispatch) => {
   dispatch({ type: SET_AUTH_ERROR, error: null })
   return authAPI.signUp(name, email, password).then((response) => {
      if (response.data.resultCode === 0 && response.data.data.pending) {
         dispatch({
            type: SET_PENDING_EMAIL,
            email: response.data.data.email,
            mailed: response.data.data.mailed
         })
         return
      }
      dispatch({ type: SET_AUTH_ERROR, error: authError(response) })
   }).catch(() => {
      dispatch({ type: SET_AUTH_ERROR, error: "Cannot reach the server" })
   })
}
export const confirmEmail = (email, code) => (dispatch) => {
   dispatch({ type: SET_AUTH_ERROR, error: null })
   return authAPI.confirmEmail(email, code).then((response) => {
      if (response.data.resultCode === 0) {
         dispatch({ type: SET_PENDING_EMAIL, email: null })
         return dispatch(getAuthUserData())
      }
      dispatch({ type: SET_AUTH_ERROR, error: authError(response) })
   }).catch(() => {
      dispatch({ type: SET_AUTH_ERROR, error: "Cannot reach the server" })
   })
}
export const confirmToken = (token) => (dispatch) => {
   dispatch({ type: SET_AUTH_ERROR, error: null })
   return authAPI.confirmToken(token).then((response) => {
      if (response.data.resultCode === 0) {
         return dispatch(getAuthUserData())
      }
      dispatch({ type: SET_AUTH_ERROR, error: authError(response) })
   }).catch(() => {
      dispatch({ type: SET_AUTH_ERROR, error: "Cannot reach the server" })
   })
}
export const logOut = () => (dispatch) => {
   authAPI.logOut().then((response) => {
      // debugger
      if (response.data.resultCode === 0) {
         dispatch(unsetAuthUserData({}))
         dispatch(setCurrentUserId(null))
      }
   })
}
export const getAuthUserData = () => (dispatch) => {
   return authAPI.me().then((response) => {
      // debugger
      if (response.data.resultCode === 0) {
         let { email, id, login, name } = { ...response.data.data }
         dispatch(setAuthUserData(id, email, login, name))
      }
   })
}
let initialState = {
   userId: null,
   email: null,
   login: null,
   name: null,
   isAuth: false,
   error: null,
   pendingEmail: null,
   mailSent: false
};
const authReducer = (state = initialState, action) => {
   switch (action.type) {
      case SET_USER_DATA: {
         return {
            ...state,
            ...action.data,
            isAuth: true,
            error: null
         };
      }
      case UNSET_USER_DATA: {
         return {
            userId: null,
            email: null,
            login: null,
            name: null,
            isAuth: false,
            error: null,
            pendingEmail: null,
            mailSent: false
         };
      }
      case SET_PENDING_EMAIL: {
         return {
            ...state,
            pendingEmail: action.email,
            mailSent: Boolean(action.mailed),
            error: null
         };
      }
      case SET_AUTH_ERROR: {
         return {
            ...state,
            error: action.error
         };
      }
      default: return state;
   }
};
export default authReducer;
