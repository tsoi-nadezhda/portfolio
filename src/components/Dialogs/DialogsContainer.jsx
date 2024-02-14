import Dialogs from "./Dialogs"
import { sendMessageActionCreator, updateTextMessageActionCreator } from "../../redux/dialogs_reducer"
import { connect } from 'react-redux'
const mapStateToProps = (state) => {
    return {
        state: state.messagesPage
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        sendMessage: () => dispatch(sendMessageActionCreator()),
        updateTextMessage: (message) => dispatch(updateTextMessageActionCreator(message))
    }
}
const DialogsContainer = connect(mapStateToProps, mapDispatchToProps)(Dialogs)
export default DialogsContainer;