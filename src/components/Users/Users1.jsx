import axios from "axios"
import s from "./Users.module.css"
const Users = (props) => {
    // debugger
    let users = () => {
        if (props.users.length === 0) {
            axios.get("https://social-network.samuraijs.com/api/1.0/users").then((response) => {
                props.setUsers(response.data.items)
            })
        }
    }


    return <div className={s.users}>
        <button onClick={users}>Get users</button>
        {props.users.map(u => <div key={u.id} className={s.user} >
            <div><img src={u.photos.small != null ? u.photos.small != null : "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Face-smile.svg/1024px-Face-smile.svg.png"} alt="" className={s.imgUser} />
                <div className={s.fullName}><span>{u.name}, {u.status}</span></div>
                {u.followed ? <button onClick={() => props.unfollow(u.id)}>Unfollow</button> : <button onClick={() => props.follow(u.id)}>Follow</button>}
            </div>

            <div className={s.location}><span>{"u.city"}, {"u.country"}</span></div>
        </div>)}

    </div>
}

export default Users