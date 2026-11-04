import { connect } from 'react-redux'
import { sendMessage, updateTextMessageActionCreator, getDialogs, getMessages, deleteMessage } from "../../redux/dialogs_reducer"
import Dialogs from "./Dialogs"
import { WithAuthRedirect } from "../../hoc/WithAuthRedirect"
import { compose } from 'redux'
const mapStateToProps = (state) => {
    return {
        state: state.messagesPage
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        sendMessage: (userId) => dispatch(sendMessage(userId)),
        updateTextMessage: (message) => dispatch(updateTextMessageActionCreator(message)),
        getDialogs: () => dispatch(getDialogs()),
        getMessages: (userId) => dispatch(getMessages(userId)),
        refreshMessages: (userId) => dispatch(getMessages(userId, true)),
        deleteMessage: (userId, messageId) => dispatch(deleteMessage(userId, messageId))
    }
}

export default compose(connect(mapStateToProps, mapDispatchToProps),
    WithAuthRedirect)(Dialogs);
