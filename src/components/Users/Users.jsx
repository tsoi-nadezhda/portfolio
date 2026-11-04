import s from "./Users.module.css"
import React from "react";

import { NavLink } from 'react-router-dom'

let Users = (props) => {
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
            <NavLink to={`/users/${u.id}`}><img onClick={() => { props.setCurrentUserId(u.id) }} src={u.photos.small != null ? u.photos.small : "https://t4.ftcdn.net/jpg/05/29/35/03/360_F_529350362_FmyXL7uFrHmqbH5o3qaLxM68dHg6Pqdx.jpg"} alt="" className={s.imgUser} />
            </NavLink>
            <div className={s.fullName}><span>{u.name}</span></div>
            <div className={s.location}>{u.status || "No status"}</div>
            <div className={s.location}>{u.aboutMe}</div>
            <div className={s.location}>{u.lookingForAJob ? "Looking for a job" : "Not looking for a job"}</div>
            {!u.isFriend && u.followsMe ? <div className={s.location}>Follows you</div> : null}
            <div className={s.actions}>
                {u.followed ? <button disabled={props.followingInProgress.some(id => id === u.id)} onClick={() => {
                    props.unfollow(u.id)
                }}>Unfollow</button> :
                    <button disabled={props.followingInProgress.some(id => id === u.id)} onClick={() => {
                        props.follow(u.id)
                    }}>Follow</button>
                }
                {u.id !== props.authorizedUserId ? <NavLink className={s.message} to={`/dialogs/${u.id}`}>Message</NavLink> : null}
            </div>
        </div>
        )}

    </div>)
}



export default Users