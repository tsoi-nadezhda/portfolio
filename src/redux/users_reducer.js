import { usersAPI } from "../api/api"
const SET_USERS="SET_USERS"
const FOLLOW = "FOLLOW"
const UNFOLLOW = "UNFOLLOW"
const TOTAL_COUNT = "TOTAL_COUNT"
const SET_CURRENT_PAGE= "SET_CURRENT_PAGE"
const SET_LOADER = "SET_LOADER"
const TOGGLE_IS_FOLLOWING = "TOGGLE_IS_FOLLOWING"
export const setUsers = (users) => ({ type: SET_USERS,users })
export const followSuccess = (userId) => ({ type: FOLLOW, userId })
export const unfollowSuccess = (userId) => ({ type: UNFOLLOW,userId })
export const setCurrentPage = (currentPage) => ({ type: SET_CURRENT_PAGE,currentPage })
export const setTotalCount = (total) => ({ type: TOTAL_COUNT,total })
export const setLoader = (isLoading) => ({ type: SET_LOADER,isLoading })
export const toggleFollowingProgress = (isLoading,userId) => ({ type: TOGGLE_IS_FOLLOWING,isLoading,userId})
export const getUsers=(limit,currentPage)=>
     (dispatch)=>{
        dispatch(setCurrentPage(currentPage))
        dispatch(setLoader(true))
        
        usersAPI.getUsers(limit, currentPage).then((data) => {
            console.log("jyhjc",data)
            dispatch(setTotalCount(data.totalCount));
            dispatch(setUsers(data.items));
            dispatch(setLoader(false))
        })
    
}
export const unfollow=(userId)=>{
    return (dispatch)=>{
        dispatch(toggleFollowingProgress(true, userId))
        usersAPI.unfollow(userId).then(response => {

            if (response.data.resultCode === 0) {
                dispatch(unfollowSuccess(userId))
            }
            dispatch(toggleFollowingProgress(false, userId))
        })
    }
}
export const follow=(userId)=>{
    return (dispatch)=>{
        dispatch(toggleFollowingProgress(true, userId))
        usersAPI.follow(userId).then(response => {
            if (response.data.resultCode === 0) {
                dispatch(followSuccess(userId))
            }
            dispatch(toggleFollowingProgress(false, userId))
        })
    }
}
let initialState = {
    users:[],
    totalCount:0,
    limit:30,
    currentPage:1,
    isLoading:true,
    followingInProgress:[]
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
        case TOGGLE_IS_FOLLOWING:{
            return{
                ...state, 
                followingInProgress:action.isLoading?
                [...state.followingInProgress,action.userId]
                :state.followingInProgress.filter(id=>id!==action.userId)
            }
        }
    default: return state;
 }}
 export default usersReducer