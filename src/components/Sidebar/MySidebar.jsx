import React from 'react'
import s from "./MySidebar.module.css"
import { NavLink } from 'react-router-dom'

const MySidebar = (props) => {
    { console.log(props.friendsData) }
    let friendsData = props.friendsData.map(f => (<div key={f.id}><NavLink className={s.friend} to={f.id}>{f.name}</NavLink></div>))
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