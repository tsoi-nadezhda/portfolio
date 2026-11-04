import { usersAPI } from "../api/api"

const SET_RELATIONS = "SET_RELATIONS"
export const setRelations = (data) => ({ type: SET_RELATIONS, data })
export const getRelations = () => (dispatch) => {
    return usersAPI.getRelations().then((data) => {
        if (data.resultCode === 0) {
            dispatch(setRelations(data.data))
        }
    })
}

let initialState = {
    friends: [],
    following: [],
    followers: [],
}
const sidebarReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_RELATIONS: {
            return {
                ...state,
                friends: action.data.friends,
                following: action.data.following,
                followers: action.data.followers,
            }
        }
        default: return state
    }
}
export default sidebarReducer
