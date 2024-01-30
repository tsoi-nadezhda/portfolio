let state ={
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
}
let renderEntireTree=()=>{
    console.log("state changed")
}
export let addPost=()=>{
    state.profilePage.postData.push({id:9,message:state.profilePage.newPostText,likeCount:1});
    renderEntireTree(state);
}
export let updatePostMessage=(text)=>{
    state.profilePage.newPostText=text;
    renderEntireTree(state);
}
export let sendMessage =()=>{
    state.messagesPage.messagesData.push({id:10,message:state.messagesPage.newMessage,me:"my"});
    renderEntireTree(state);
}
export let updateTextMessage=(message)=>{
    state.messagesPage.newMessage=message;
    renderEntireTree(state);
}
export const subscribe=(observer)=>{
    renderEntireTree=observer;
}
export default state
