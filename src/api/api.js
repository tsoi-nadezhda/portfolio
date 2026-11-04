import axios from "axios"
const apiHost = typeof window !== "undefined" ? window.location.hostname : "127.0.0.1"
const instance = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_API_URL || `http://${apiHost}:3001/api/1.0/`,
    headers: {
        "API-KEY": "6b1237c0-7db9-405d-9c62-5d1c76007f2f"
    }
})
export const usersAPI = {
    getUsers(limit = 10, currentPage = 1) {
        return instance.get(`users?count=${limit}&page=${currentPage}`)
            .then(response => { return response.data })
    },
    getRelations() {
        return instance.get("users/relations").then(response => response.data)
    },
    unfollow(userId) {
        return instance.delete(`follow/${userId}`)
    },
    follow(userId) {
        return instance.post(`follow/${userId}`)
    }
}
export const profileAPI = {
    getProfile(userId) {
        return instance.get(`profile/${userId}`)
    },
    saveProfile(data) {
        return instance.put("profile", { ...data })
    },
    savePhoto(file) {
        const formData = new FormData()
        formData.append("image", file)
        return instance.put("profile/photo", formData)
    },
    deletePhoto() {
        return instance.delete("profile/photo")
    },
    getStatus(userId) {
        return instance.get(`profile/status/${userId}`)
    },
    updateStatus(status) {
        return instance.put(`profile/status`, { status: status })
    },
    getPosts(userId) {
        return instance.get(`profile/${userId}/posts`)
    },
    savePost(userId, message) {
        return instance.post(`profile/${userId}/posts`, { message })
    },
    deletePost(userId, postId) {
        return instance.delete(`profile/${userId}/posts/${postId}`)
    },
    likePost(userId, postId) {
        return instance.put(`profile/${userId}/posts/${postId}/like`)
    }
}
export const dialogsAPI = {
    getDialogs() {
        return instance.get("dialogs")
    },
    getMessages(userId) {
        return instance.get(`dialogs/${userId}/messages`)
    },
    sendMessage(userId, message) {
        return instance.post(`dialogs/${userId}/messages`, { message })
    },
    deleteMessage(messageId) {
        return instance.delete(`dialogs/messages/${messageId}`)
    }
}
export const authAPI = {
    logIn(email, password, rememberMe) {
        return instance.post(`auth/login`, {
            email: email,
            password: password,
            rememberMe: rememberMe
        })
    },
    signUp(name, email, password) {
        return instance.post(`auth/register`, { name, email, password })
    },
    confirmEmail(email, code) {
        return instance.post(`auth/confirm`, { email, code })
    },
    confirmToken(token) {
        return instance.post(`auth/confirm/${token}`)
    },
    logOut() {
        return instance.delete(`auth/login`)
    },
    me() {
        return instance.get(`auth/me`)
    }
}