import s from "./Users.module.css"
import React from "react";
let Users = (props) => {
    let countPages = Math.ceil(props.totalCount / props.limit)
    let pages = []
    for (let i = 1; i <= countPages; i++) {
        pages.push(i)
    }
    console.log(props)
    return (<div className={s.users}>
        {pages.map(p => <span key={p} className={p === props.currentPage ? s.currentPage : s.page} onClick={() => props.onPageChanged(p)}>{p}</span>)}
        {props.users.map(u => <div key={u.id} className={s.user} >
            <div><img src={u.photos.small != null ? u.photos.small != null : "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Face-smile.svg/1024px-Face-smile.svg.png"} alt="" className={s.imgUser} />
                <div className={s.fullName}><span>{u.name}, {u.status}</span></div>
                {u.followed ? <button onClick={() =>
                    props.unfollow(u.id)}>Unfollow</button> :
                    <button onClick={() => props.follow(u.id)}>Follow</button>
                }
            </div>

            <div className={s.location}><span>{"u.city"}, {"u.country"}</span></div>
        </div>)}

    </div>)
}



export default Users