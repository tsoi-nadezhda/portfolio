import { usersAPI,profileAPI } from "../api/api"
const UPDATE_POST_MESSAGE="UPDATE-POST-MESSAGE"
const ADD_POST="ADD-POST"
const SET_PROFILE_PAGE="SET_PROFILE_PAGE"
const SET_USER_ID="SET_USER_ID"
const SET_PROFILE_STATUS="SET_PROFILE_STATUS"
export const addPostActionCreator = () => ({ type: ADD_POST })
export const updatePostMessageCreator = (text) => ({ type: UPDATE_POST_MESSAGE,  text })
export const setProfilePage = (profile) => ({ type: SET_PROFILE_PAGE,  profile })
export const setProfileStatus = (status) => ({ type: SET_PROFILE_STATUS,  status })
export const setUserId = (userId) => ({ type: SET_USER_ID,  userId })
export const getProfile=(userId)=>(dispatch)=>{
    usersAPI.getProfile(userId)
    .then((response) => {
      dispatch(setProfilePage(response.data))
    })
}
export const getStatus=(userId)=>(dispatch)=>{
    profileAPI.getStatus(userId)
    .then((response) => {
      dispatch(setProfileStatus(response.data))
    })
}
export const updateStatus=(status)=>(dispatch)=>{
    profileAPI.updateStatus(status)
    .then((response) => {
        if(response.data.resultCode===0){
            dispatch(setProfileStatus(response.data.status))
        }
    })
}
let initialState = {
    newPostText:"IT",
    postData :[
        { id: 1, message: "Hi! How are you?", likeCount: 15 },
        { id: 2, message: "It's my first post", likeCount: 20 }
    ],
    profile:null,
    userId:31017,
    status:"Nadya"
}
const profileReducer =(state=initialState,action)=>{
    switch(action.type){
        case ADD_POST:{
            return {
                ...state,
                newPostText:"",
                postData:[...state.postData,{id:9,message:state.newPostText,likeCount:1}]
            };
        }
            
        case UPDATE_POST_MESSAGE:{
            return {...state,
                newPostText:action.text
            };
        }
        case SET_PROFILE_PAGE:{
            return {
                ...state,
                profile:{...action.profile}
            };
        }
        case SET_USER_ID:{
            return {
                ...state,
                userId:action.userId
            };
        }
        case SET_PROFILE_STATUS:{
            return {
                ...state,
                status:action.status
            };
        }
        
        default: return state;
    }
}
export default profileReducer;