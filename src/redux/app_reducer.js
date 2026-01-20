
import { getAuthUserData } from "./auth_reducer"
const INITIALIZED_SUCCESS = "INITIALIZED_SUCCESS";
export const initializedSuccess = () => ({ type: INITIALIZED_SUCCESS });
export const initialize = () => (dispatch) => {
    let promise = dispatch(getAuthUserData());
    Promise.all([promise]).then(() => {
        dispatch(initializedSuccess())
    })
}


let initialState = {
    isInitialized: false
};
const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case INITIALIZED_SUCCESS: {
            return {
                ...state,
                isInitialized: true
            };
        }

        default: return state;
    }
};
export default appReducer;
