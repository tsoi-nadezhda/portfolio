import axios from "axios"
import s from "./Users.module.css"
import React from "react";
class Users extends React.Component {
    constructor(props) {
        super(props);
        axios.get("https://social-network.samuraijs.com/api/1.0/users").then((response) => {
            this.props.setUsers(response.data.items)
        })
    }


    render() {
        return <div className={s.users}>
            {this.props.users.map(u => <div key={u.id} className={s.user} >
                <div><img src={u.photos.small != null ? u.photos.small != null : "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Face-smile.svg/1024px-Face-smile.svg.png"} alt="" className={s.imgUser} />
                    <div className={s.fullName}><span>{u.name}, {u.status}</span></div>
                    {u.followed ? <button onClick={() =>
                        this.props.unfollow(u.id)}>Unfollow</button> :
                        <button onClick={() => this.props.follow(u.id)}>Follow</button>
                    }
                </div>

                <div className={s.location}><span>{"u.city"}, {"u.country"}</span></div>
            </div>)}

        </div>
    }
}

export default Users