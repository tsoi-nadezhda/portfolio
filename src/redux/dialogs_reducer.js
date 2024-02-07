const SEND_MESSAGE="SEND-MESSAGE"
const UPDATE_TEXT_MESSAGE="UPDATE-TEXT-MESSAGE"
export const sendMessageActionCreator = () => ({ type: SEND_MESSAGE })
export const updateTextMessageActionCreator = (text) => ({ type: UPDATE_TEXT_MESSAGE, message: text })
let initialState = {
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

}
const dialogReducer =(state = initialState,action)=>{
    switch(action.type){
        case SEND_MESSAGE:
            state.messagesData.push({id:10,message:state.newMessage,me:"my"});
            state.newMessage=""
            return state;
        case UPDATE_TEXT_MESSAGE:
            state.newMessage=action.message;
            return state;
        default: return state;
    }
}
export default dialogReducer;