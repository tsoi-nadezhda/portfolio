import {  profileAPI } from "../api/api"
const UPDATE_POST_MESSAGE = "UPDATE-POST-MESSAGE"
const ADD_POST = "ADD-POST"
const SET_PROFILE_PAGE = "SET_PROFILE_PAGE"
const SAVE_PROFILE_PAGE = "SAVE_PROFILE_PAGE"
const SET_USER_ID = "SET_USER_ID"
const SET_PROFILE_STATUS = "SET_PROFILE_STATUS"
const SET_PROFILE_PHOTO = "SET_PROFILE_PHOTO"
const SET_PROFILE_POST = "SET_PROFILE_POST"
const SET_POSTS = "SET_POSTS"
const DELETE_POST = "DELETE_POST"
const LIKE_POST = "LIKE_POST"
export const addPostActionCreator = () => ({ type: ADD_POST })
export const updatePostMessageCreator = (text) => ({ type: UPDATE_POST_MESSAGE, text })
export const setProfilePage = (profile) => ({ type: SET_PROFILE_PAGE, profile })
export const setProfilePost = (post) => ({ type: SET_PROFILE_POST, post })
export const setPosts = (posts) => ({ type: SET_POSTS, posts })
export const saveProfilePage = (data) => ({ type: SAVE_PROFILE_PAGE, data })
export const setProfileStatus = (status) => ({ type: SET_PROFILE_STATUS, status })
export const setProfilePhoto = (photo) => ({ type: SET_PROFILE_PHOTO, photo })
export const setUserId = (userId) => ({ type: SET_USER_ID, userId })

export const getProfile = (userId) => (dispatch) => {
    profileAPI.getProfile(userId)
        .then((response) => {
            dispatch(setProfilePage(response.data))
        })
}
export const saveProfile = (data) => (dispatch, getState) => {
    return profileAPI.saveProfile(data).then((response) => {
        if (response.data.resultCode === 0) {
            const profile = getState().profilePage.profile
            dispatch(setProfilePage({ ...profile, ...data, photos: profile.photos }))
        }
    })
}
export const savePhoto = (file) => (dispatch) => {
    return profileAPI.savePhoto(file).then((response) => {
        if (response.data.resultCode === 0) {
            dispatch(setProfilePhoto(response.data.data.photos))
        }
    })
}
export const deletePhoto = () => (dispatch) => {
    return profileAPI.deletePhoto().then((response) => {
        if (response.data.resultCode === 0) {
            dispatch(setProfilePhoto({ small: null, large: null }))
        }
    })
}
export const getStatus = (userId) => (dispatch) => {
    profileAPI.getStatus(userId)
        .then((response) => {
            dispatch(setProfileStatus(response.data))
        })
}
export const updateStatus = (status) => (dispatch) => {
    profileAPI.updateStatus(status)
        .then((response) => {
            if (response.data.resultCode === 0) {
                dispatch(setProfileStatus(response.data.status))
            }
        })
}
let postsRequest = 0
export const getPosts = (userId) => (dispatch) => {
    const requestId = ++postsRequest
    dispatch(setPosts([]))
    return profileAPI.getPosts(userId).then((response) => {
        if (requestId !== postsRequest) return
        dispatch(setPosts(response.data))
    })
}
export const likePost = (postId) => (dispatch, getState) => {
    const userId = getState().profilePage.profile && getState().profilePage.profile.userId
    if (!userId) return
    return profileAPI.likePost(userId, postId).then((response) => {
        if (response.data.resultCode === 0) {
            dispatch({ type: LIKE_POST, post: response.data.data.post })
        }
    })
}
export const deletePost = (postId) => (dispatch, getState) => {
    const userId = getState().profilePage.profile && getState().profilePage.profile.userId
    if (!userId) return
    return profileAPI.deletePost(userId, postId).then((response) => {
        if (response.data.resultCode === 0) {
            dispatch({ type: DELETE_POST, postId })
        }
    })
}
export const savePost = () => (dispatch, getState) => {
    const state = getState().profilePage
    const message = state.newPostText
    const userId = state.profile && state.profile.userId
    if (!message || !message.trim() || !userId) return
    return profileAPI.savePost(userId, message.trim()).then((response) => {
        if (response.data.resultCode === 0) {
            dispatch(setProfilePost(response.data.data.post))
        }
    })
}
let initialState = {
    newPostText: "IT",
    postData: [],
    profile: null,
    userId: null,
    status: ""
}
const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST: {
            return {
                ...state,
                newPostText: "",
                postData: [...state.postData, { id: 31017, message: state.newPostText, likeCount: 0 }]
            };
        }
        case SET_POSTS: {
            return {
                ...state,
                postData: action.posts
            };
        }
        case SET_PROFILE_POST: {
            return {
                ...state,
                newPostText: "",
                postData: [...state.postData, action.post]
            };
        }
        case DELETE_POST: {
            return {
                ...state,
                postData: state.postData.filter(post => post.id !== action.postId)
            };
        }
        case LIKE_POST: {
            return {
                ...state,
                postData: state.postData.map(post => post.id === action.post.id
                    ? { ...post, likeCount: action.post.likeCount, liked: action.post.liked }
                    : post)
            };
        }

        case UPDATE_POST_MESSAGE: {
            return {
                ...state,
                newPostText: action.text
            };
        }
        case SET_PROFILE_PAGE: {
            return {
                ...state,
                profile: { ...action.profile }
            };
        }
        case SET_PROFILE_PHOTO: {
            const photos = typeof action.photo === "string"
                ? { small: action.photo, large: action.photo }
                : action.photo
            return {
                ...state,
                profile: {
                    ...state.profile,
                    photos: {
                        ...state.profile.photos,
                        ...photos
                    }
                }
            };
        }

        case SET_USER_ID: {
            return {
                ...state,
                userId: action.userId
            };
        }
        case SET_PROFILE_STATUS: {
            return {
                ...state,
                status: action.status
            };
        }

        default: return state;
    }
}
export default profileReducer;