import axios from "axios"
const instance = axios.create({
    withCredentials: true,
    baseURL: "https://social-network.samuraijs.com/api/1.0/",
    headers: {
        "API-KEY": "6b1237c0-7db9-405d-9c62-5d1c76007f2f"
    }
})
export const usersAPI = {
    getUsers(limit = 10, currentPage = 1) {
        return instance.get(`users?count=${limit}&page=${currentPage}`)
            .then(response => { return response.data })
    },
    unfollow(userId) {
        return instance.delete(`follow/${userId}`)
    },
    follow(userId) {
        return instance.post(`follow/${userId}`)
    },
    getProfile(userId) {
        console.warn("The function is deprecated, use profileAPI")
        return profileAPI.getProfile(userId)
    }
}
export const profileAPI = {
    getProfile(userId) {
        return instance.get(`profile/${userId}`)
    },
    getStatus(userId) {
        return instance.get(`profile/status/${userId}`)
    },
    updateStatus(status) {
        return instance.put(`profile/status`, { status: status })
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
    logOut() {
        return instance.delete(`auth/login`)
    },
    me() {
        return instance.get(`auth/me`)
    }
}