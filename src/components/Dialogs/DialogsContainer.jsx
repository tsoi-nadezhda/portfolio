import React from 'react'
import Dialogs from "./Dialogs"
import { sendMessageActionCreator, updateTextMessageActionCreator } from "../../redux/dialogs_reducer"
import StoreContext from "../../StoreContext"
const DialogsContainer = () => {
    return (
        <StoreContext.Consumer>
            {
                store => {
                    const sendMessage = () => {
                        store.dispatch(sendMessageActionCreator());
                    }

                    const updateTextMessage = (message) => {
                        store.dispatch(updateTextMessageActionCreator(message));
                    }
                    return <Dialogs sendMessage={sendMessage} updateTextMessage={updateTextMessage}
                        state={store.getState().messagesPage}>
                    </Dialogs>
                }
            }
        </StoreContext.Consumer>

    )
}
export default DialogsContainer;