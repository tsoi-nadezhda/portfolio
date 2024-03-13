const SET_USERS="SET_USERS"
const FOLLOW = "FOLLOW"
const UNFOLLOW = "UNFOLLOW"
const TOTAL_COUNT = "TOTAL_COUNT"
const SET_CURRENT_PAGE= "SET_CURRENT_PAGE"
const SET_LOADER = "SET_LOADER"
export const setUsersActionCreator = (users) => ({ type: SET_USERS,users })
export const followActionCreator = (userId) => ({ type: FOLLOW, userId })
export const unfollowActionCreator = (userId) => ({ type: UNFOLLOW,userId })
export const setCurrentPageAC = (currentPage) => ({ type: SET_CURRENT_PAGE,currentPage })
export const setTotalCountAC = (total) => ({ type: TOTAL_COUNT,total })
export const setLoaderAC = (isLoading) => ({ type: SET_LOADER,isLoading })
let initialState = {
    users:[],
    totalCount:0,
    limit:30,
    currentPage:1,
    isLoading:true
 }
 const usersReducer =(state=initialState,action)=>{
    switch(action.type){
        case FOLLOW:{
            return{
                ...state,
                users:state.users.map(u=>{
                    if(u.id===action.userId){
                        return {...u,followed:true}
                    }
                    return u;
                })
            }
        }
        case UNFOLLOW:{
            return{
                ...state,
                users:state.users.map(u=>{
                    if(u.id===action.userId){
                        return {...u,followed:false}
                    }
                    return u;
                })
            }
        }
        case SET_USERS:{
            return {
                ...state,
                users:[...action.users]
            }
        }
        case TOTAL_COUNT:{
            return{
                ...state, 
                totalCount:action.total
            }
        }
        case SET_CURRENT_PAGE:{
            return{
                ...state, 
                currentPage:action.currentPage
            }
        }
        case SET_LOADER:{
            return{
                ...state, 
                isLoading:action.isLoading
            }
        }
    default: return state;
 }}
 export default usersReducer