import React from 'react'
import Dialogs from "./Dialogs"
import { sendMessageActionCreator, updateTextMessageActionCreator } from "../../redux/dialogs_reducer"
const DialogsContainer = (props) => {
    console.log(props.store.getState())
    let state = props.store.getState().messagesPage
    const sendMessage = () => {
        props.store.dispatch(sendMessageActionCreator());
    }

    const updateTextMessage = (message) => {
        props.store.dispatch(updateTextMessageActionCreator(message));
    }
    return (
        <Dialogs sendMessage={sendMessage} updateTextMessage={updateTextMessage}
            state={state}>
        </Dialogs>
    )
}
export default DialogsContainer;