import React from 'react'
import s from "./Dialogs.module.css"
import DialogItem from "./DialogItem/DialogItem"
import Message from "./Message/Message"

const Dialogs = (props) => {

    let messagesElements = props.messagesData.map(m => (<Message message={m.message}></Message>))
    let dialogsElements = props.dialogsData.map((d, i) => (<DialogItem id={d.id} name={d.name}></DialogItem>))
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