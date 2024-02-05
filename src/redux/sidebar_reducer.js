let initialState = {
   friendsData:[
       { id: 1, name: "Nadya", img:"https://i.imgur.com/dmRcOOI.png" },
       { id: 2, name: "Evgenii", img:"https://i.imgur.com/dmRcOOI.png" },
       { id: 3, name: "Lubov", img:"https://i.imgur.com/dmRcOOI.png"},
       { id: 4, name: "Oleg", img:""},
       { id: 5, name: "Vinni", img:""},
       { id: 6, name: "Puh", img:""}
   ]
}
const sidebarReducer =(state=initialState,action)=>{
   return state;
}
export default sidebarReducer;