import React from 'react'
import s from "./Dialogs.module.css"
import DialogItem from "./DialogItem/DialogItem"
import Message from "./Message/Message"

const Dialogs = (props) => {

    let messagesElements = props.messagesData.map(m => (<Message key={m.id} message={m.message} me={m.me}></Message>))
    let dialogsElements = props.dialogsData.map(d => (<DialogItem key={d.id} id={d.id} name={d.name}></DialogItem>))
    return (
        <div  >
            <div className={s.dialogs}>
                <div className={s.dialogs_items}>
                    {dialogsElements}
                </div>
                <div className={s.messages}>
                    {messagesElements}
                </div>
            </div>
        </div>
    )
}
export default Dialogs;