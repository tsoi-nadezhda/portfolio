import profileReducer from "./profile_reducer"
import sidebarReducer from "./sidebar_reducer"
import dialogsReducer from "./dialogs_reducer"
var store={
    _state:{
        profilePage:{
            newPostText:"IT",
            postData :[
                { id: 1, message: "Hi! How are you?", likeCount: 15 },
                { id: 2, message: "It's my first post", likeCount: 20 }
            ]
        },
        messagesPage:{
            newMessage:"",
            messagesData:[
                { id: 1, message: "Hi", me:"my"},
                { id: 2, message: "How are you?", me:"my" },
                { id: 3, message: "Good! Thank you", me:"notmy" },
                { id: 4, message: "Bye", me:"notmy" },
                { id: 5, message: "Bye", me:"my" },
            ],
            dialogsData: [
                { id: 1, name: "Tsoi" },
                { id: 2, name: "Jek" },
                { id: 3, name: "Lubava" },
                { id: 4, name: "Verka" },
                { id: 5, name: "Viktor" },
            ]
    
        },
        sidebar:{
            friendsData:[
                { id: 1, name: "Nadya", img:"https://i.imgur.com/dmRcOOI.png" },
                { id: 2, name: "Evgenii", img:"https://i.imgur.com/dmRcOOI.png" },
                { id: 3, name: "Lubov", img:"https://i.imgur.com/dmRcOOI.png"},
                { id: 4, name: "Oleg", img:""},
                { id: 5, name: "Vinni", img:""},
                { id: 6, name: "Puh", img:""}
            ]
        }
    },
    _callSubscriber(){
        console.log("state changed")
    },
    dispatch(action){
        this._state.profilePage = profileReducer(this._state.profilePage,action);
        this._state.messagesPage = dialogsReducer(this._state.messagesPage,action);
        this._state.sidebar = sidebarReducer(this._state.sidebar,action);
        this._callSubscriber(this._state)
    },
    getState(){
        return this._state
    },
    subscribe(observer){
        this._callSubscriber=observer;
    },
    
}


export default store
