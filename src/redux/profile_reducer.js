const UPDATE_POST_MESSAGE="UPDATE-POST-MESSAGE"
const ADD_POST="ADD-POST"
export const addPostActionCreator = () => ({ type: ADD_POST })
export const updatePostMessageCreator = (text) => ({ type: UPDATE_POST_MESSAGE, text: text })
let initialState = {
    newPostText:"IT",
    postData :[
        { id: 1, message: "Hi! How are you?", likeCount: 15 },
        { id: 2, message: "It's my first post", likeCount: 20 }
    ]
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
            
        default: return state;
    }
}
export default profileReducer;