import React from 'react'
import s from "./Dialogs.module.css"
import DialogItem from "./DialogItem/DialogItem"
import Message from "./Message/Message"
const Dialogs = (props) => {
    console.log(props)
    let el = React.createRef();
    let messagesElements = props.state.messagesData.map(m => (<Message key={m.id} message={m.message} me={m.me}></Message>))
    let dialogsElements = props.state.dialogsData.map(d => (<DialogItem key={d.id} id={d.id} name={d.name}></DialogItem>))
    const sendMessage = () => {
        props.sendMessage();
    }

    const updateTextMessage = (e) => {
        let message = e.target.value;
        props.updateTextMessage(message);
    }
    return (
        <div  >
            <div className={s.dialogs}>
                <div className={s.dialogs_items}>
                    {dialogsElements}
                </div>
                <div className={s.messages}>
                    <div className={s.messagesArea}>
                        {messagesElements}
                    </div>

                    <div className={s.textArea}>
                        <textarea value={props.state.newMessage} onChange={updateTextMessage}></textarea>
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Dialogs;