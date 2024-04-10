import axios from "axios"
const instance = axios.create({
    withCredentials: true,
    baseURL:"https://social-network.samuraijs.com/api/1.0/",
    headers:{
        "API-KEY":"6b1237c0-7db9-405d-9c62-5d1c76007f2f"
    }
})
export const usersAPI={
    getUsers(limit=10,currentPage=1){
        return instance.get(`users?count=${limit}&page=${currentPage}`)
        .then(response=>{return response.data})
    },
    unfollow(userId){
        return instance.delete(`follow/${userId}`)
    },
    follow(userId){
        return instance.post(`follow/${userId}`)
    }
}