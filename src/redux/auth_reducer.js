import { authAPI } from "../api/api"
const SET_USER_DATA = "SET_USER_DATA";
const UNSET_USER_DATA = "UNSET_USER_DATA";
export const setAuthUserData = (userId, email, login) => ({ type: SET_USER_DATA, data: { userId, email, login } });
export const unsetAuthUserData = () => ({ type: UNSET_USER_DATA, data: {} });
export const logIn = (email, password, rememberMe) => (dispatch) => {
   authAPI.logIn(email, password, rememberMe).then((response) => {
      // debugger
      if (response.data.resultCode === 0) {
         dispatch(getAuthUserData())
      }
   })
}
export const logOut = () => (dispatch) => {
   authAPI.logOut().then((response) => {
      // debugger
      if (response.data.resultCode === 0) {
         dispatch(unsetAuthUserData({}))
      }
   })
}
export const getAuthUserData = () => (dispatch) => {
   return authAPI.me().then((response) => {
      // debugger
      if (response.data.resultCode === 0) {
         let { email, id, login } = { ...response.data.data }
         dispatch(setAuthUserData(id, email, login))
      }
   })
}
let initialState = {
   userId: null,
   email: null,
   login: null,
   isAuth: false
};
const authReducer = (state = initialState, action) => {
   switch (action.type) {
      case SET_USER_DATA: {
         return {
            ...state,
            ...action.data,
            isAuth: true
         };
      }
      case UNSET_USER_DATA: {
         return {
            userId: null,
            email: null,
            login: null,
            isAuth: false
         };
      }
      default: return state;
   }
};
export default authReducer;
