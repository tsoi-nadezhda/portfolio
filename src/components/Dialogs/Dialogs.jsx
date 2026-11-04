import React, { useEffect, useRef } from 'react'
import s from "./Dialogs.module.css"
import DialogItem from "./DialogItem/DialogItem"
import Message from "./Message/Message"
import { useParams } from 'react-router-dom';

const Dialogs = (props) => {
    const params = useParams()
    const userId = Number(params.userId)
    const messagesArea = useRef(null)
    useEffect(() => {
        props.getDialogs()
    }, [])
    useEffect(() => {
        if (!userId) return
        props.getMessages(userId)
        const timer = setInterval(() => props.refreshMessages(userId), 3000)
        return () => clearInterval(timer)
    }, [userId])
    const lastMessageId = props.state.messagesData.length
        ? props.state.messagesData[props.state.messagesData.length - 1].id
        : null
    useEffect(() => {
        if (messagesArea.current) {
            messagesArea.current.scrollTop = messagesArea.current.scrollHeight
        }
    }, [lastMessageId])
    const sendMessage = () => {
        if (userId) props.sendMessage(userId)
    }
    const updateTextMessage = (e) => {
        props.updateTextMessage(e.target.value)
    }
    const chatUser = props.state.chatUser
    return (
        <div>
            <div className={s.dialogs}>
                <div className={s.dialogs_items}>
                    {props.state.dialogsData.length
                        ? props.state.dialogsData.map(d => <DialogItem key={d.id} id={d.id} name={d.name} lastMessage={d.lastMessage}></DialogItem>)
                        : <div className={s.empty}>No dialogs yet</div>}
                </div>
                <div className={s.messages}>
                    {userId && chatUser ? <div className={s.chatHeader}>
                        <div className={s.chatName}>{chatUser.name}</div>
                    </div> : null}
                    <div className={s.messagesArea} ref={messagesArea}>
                        {userId
                            ? props.state.messagesData.length
                                ? props.state.messagesData.map(m => <Message key={m.id} id={m.id} message={m.message} me={m.me} viewed={m.viewed} onDelete={(messageId) => props.deleteMessage(userId, messageId)}></Message>)
                                : <div className={s.empty}>No messages yet</div>
                            : <div className={s.empty}>Choose a person to write to</div>}
                    </div>
                    <div className={s.textArea}>
                        <input type="text" value={props.state.newMessage} onChange={updateTextMessage} placeholder="Write a message"></input>
                        <button onClick={sendMessage} disabled={!userId || !props.state.newMessage.trim()}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Dialogs;
