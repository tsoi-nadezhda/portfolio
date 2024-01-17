import React from 'react'
import s from "../Dialogs.module.css"
import { NavLink } from 'react-router-dom'
const DialogItem = (props) => {
    return (
        <div className={s.dialog}>
            <NavLink to={props.id}>{props.name}</NavLink>
        </div>
    )
}
export default DialogItem;