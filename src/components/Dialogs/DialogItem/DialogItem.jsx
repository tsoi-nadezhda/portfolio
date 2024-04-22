import React from 'react'
import s from "../Dialogs.module.css"
import { NavLink } from 'react-router-dom'
const DialogItem = (props) => {
    return (
        <div className={s.dialog}>
            <NavLink key={props.id} to={props.name}>{props.name}</NavLink>
        </div>
    )
}
export default DialogItem;