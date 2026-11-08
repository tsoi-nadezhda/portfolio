import axios from "axios"
const TOKEN_KEY = "sessionToken"
const instance = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_API_URL || "https://tsoi.duckdns.org/api/1.0/",
    headers: {
        "API-KEY": "6b1237c0-7db9-405d-9c62-5d1c76007f2f"
    }
})

function storage() {
    try {
        return window.localStorage && window.sessionStorage ? window : null
    } catch (error) {
        return null
    }
}

export const sessionToken = {
    read() {
        const store = storage()
        if (!store) return ""
        return store.localStorage.getItem(TOKEN_KEY) || store.sessionStorage.getItem(TOKEN_KEY) || ""
    },
    save(token, rememberMe) {
        const store = storage()
        if (!store || !token) return
        store.localStorage.removeItem(TOKEN_KEY)
        store.sessionStorage.removeItem(TOKEN_KEY)
        const target = rememberMe ? store.localStorage : store.sessionStorage
        target.setItem(TOKEN_KEY, token)
    },
    clear() {
        const store = storage()
        if (!store) return
        store.localStorage.removeItem(TOKEN_KEY)
        store.sessionStorage.removeItem(TOKEN_KEY)
    }
}

instance.interceptors.request.use((config) => {
    const token = sessionToken.read()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
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
export const musicAPI = {
    getTracks(search = "", offset = 0) {
        const query = new URLSearchParams({ offset: String(offset) })
        if (search) query.set("search", search)
        return instance.get(`music/tracks?${query}`, { headers: { "Cache-Control": "no-cache" } })
    },
    getAlbum() {
        return instance.get("music/album")
    },
    saveTrack(track) {
        return instance.post("music/album", track)
    },
    removeTrack(trackId) {
        return instance.delete(`music/album/${trackId}`)
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