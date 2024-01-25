import React from 'react'
import s from "../Dialogs.module.css"
const Message = (props) => {
    return (
        <div key={props.id} id={props.me} className={s.message}>{props.message}</div>
    )
}
export default Message;