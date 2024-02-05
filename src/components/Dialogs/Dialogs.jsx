import React from 'react'
import s from "./Dialogs.module.css"
import DialogItem from "./DialogItem/DialogItem"
import Message from "./Message/Message"
import { sendMessageActionCreator, updateTextMessageActionCreator } from "../../redux/dialogs_reducer"
const Dialogs = (props) => {
    console.log(props.newMessage)
    let el = React.createRef();
    let messagesElements = props.messagesData.map(m => (<Message key={m.id} message={m.message} me={m.me}></Message>))
    let dialogsElements = props.dialogsData.map(d => (<DialogItem key={d.id} id={d.id} name={d.name}></DialogItem>))
    const sendMessage = () => {
        props.dispatch(sendMessageActionCreator());
        props.dispatch(updateTextMessageActionCreator(""));
    }

    const updateTextMessage = () => {
        let message = el.current.value;
        props.dispatch(updateTextMessageActionCreator(message));
    }
    return (
        <div  >
            <div className={s.dialogs}>
                <div className={s.dialogs_items}>
                    {dialogsElements}
                </div>
                <div className={s.messages}>
                    {messagesElements}
                    <div className={s.textArea}>
                        <textarea ref={el} value={props.newMessage} onChange={updateTextMessage}></textarea>
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Dialogs;