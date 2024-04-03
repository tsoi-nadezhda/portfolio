const UPDATE_POST_MESSAGE="UPDATE-POST-MESSAGE"
const ADD_POST="ADD-POST"
const SET_PROFILE_PAGE="SET_PROFILE_PAGE"
const SET_USER_ID="SET_USER_ID"
export const addPostActionCreator = () => ({ type: ADD_POST })
export const updatePostMessageCreator = (text) => ({ type: UPDATE_POST_MESSAGE,  text })
export const setProfilePage = (profile) => ({ type: SET_PROFILE_PAGE,  profile })
export const setUserId = (userId) => ({ type: SET_USER_ID,  userId })

let initialState = {
    newPostText:"IT",
    postData :[
        { id: 1, message: "Hi! How are you?", likeCount: 15 },
        { id: 2, message: "It's my first post", likeCount: 20 }
    ],
    profile:null,
    userId:2
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
            
        default: return state;
    }
}
export default profileReducer;