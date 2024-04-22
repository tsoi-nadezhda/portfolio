import { connect } from 'react-redux'
import { sendMessageActionCreator, updateTextMessageActionCreator } from "../../redux/dialogs_reducer"
import Dialogs from "./Dialogs"
import { WithAuthRedirect } from "../../hoc/WithAuthRedirect"
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
let AuthRedirectComponent = WithAuthRedirect(Dialogs)
const DialogsContainer = connect(mapStateToProps, mapDispatchToProps)(AuthRedirectComponent)
export default DialogsContainer;