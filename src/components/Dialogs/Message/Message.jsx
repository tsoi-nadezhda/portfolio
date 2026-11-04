import React from 'react'
import s from "../Dialogs.module.css"
const Message = (props) => {
    return (
        <div className={`${s.message} ${props.me ? s.mine : s.theirs}`}>
            <div>{props.message}</div>
            {props.me ? <div className={s.meta}>
                <span>{props.viewed ? "Seen" : "Sent"}</span>
                <button type="button" className={s.delete} onClick={() => props.onDelete(props.id)}>Delete</button>
            </div> : null}
        </div>
    )
}
export default Message;
