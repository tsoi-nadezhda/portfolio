import React from 'react'
import s from "./MySidebar.module.css"
import { NavLink } from 'react-router-dom'

const MySidebar = (props) => {
    let friendsData = props.friendsData.map(f => (<div key={f.id}><NavLink className={s.friend} to={`/friends/profile/${f.name}`}>{f.name}</NavLink></div>))
    return (
        <div className={s.sidebar}>
            Friends
            <div className={s.friends}>
                {friendsData}
            </div>

        </div>
    )
}
export default MySidebar