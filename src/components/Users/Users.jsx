import s from "./Users.module.css"
import React from "react";
import axios from "axios"
import { NavLink } from 'react-router-dom'
let Users = (props) => {
    // const params = useParams();
    // console.log("USEEEER", params)
    // props.onUserChosen(params.userId)
    // props.setUserId(params.userId)
    let countPages = Math.ceil(props.totalCount / props.limit)
    let pages = []
    for (let i = 1; i <= countPages; i++) {
        pages.push(i)
    }
    return (<div className={s.users}>
        <div className={s.pages}>
            {pages.map(p => <span key={p} className={p === props.currentPage ? s.currentPage : s.page} onClick={() => props.onPageChanged(p)}>{p}</span>)}
        </div>
        {props.users.map(u => <div key={u.id} className={s.user} >
            <NavLink to={`/users/${u.id}`}><img src={u.photos.small != null ? u.photos.small != null : "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Face-smile.svg/1024px-Face-smile.svg.png"} alt="" className={s.imgUser} />
            </NavLink>
            <div className={s.fullName}><span>{u.name}, {u.status}</span></div>
            {u.followed ? <button onClick={() => axios.delete(`https://social-network.samuraijs.com/api/1.0/follow/${u.id}`, {
                withCredentials: true
            }).then(response => {
                console.log('gigiyg', response)
                if (response.data.resultCode === 0) {
                    props.unfollow(u.id)
                }
            })
            }>Unfollow</button> :
                <button onClick={() => axios.post(`https://social-network.samuraijs.com/api/1.0/follow/${u.id}`, {
                    "API-KEY": "6b1237c0-7db9-405d-9c62-5d1c76007f2f"
                }, {
                    withCredentials: true
                }).then(response => {
                    console.log('igiyyi', response)
                    if (response.data.resultCode === 0) {
                        props.follow(u.id)
                    }
                })
                }>Follow</button>
            }


            <div className={s.location}><span>{"u.city"}, {"u.country"}</span></div>
        </div>
        )}

    </div>)
}



export default Users