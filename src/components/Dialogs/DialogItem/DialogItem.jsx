import React from 'react'
import s from "../Dialogs.module.css"
import { NavLink } from 'react-router-dom'
const DialogItem = (props) => {
    return (
        <div className={s.dialog}>
            <NavLink className={({ isActive }) => isActive ? s.active : undefined} to={`/dialogs/${props.id}`}>
                <span>{props.name}</span>
                {props.lastMessage ? <small>{props.lastMessage}</small> : <small>No messages yet</small>}
            </NavLink>
        </div>
    )
}
export default DialogItem;
