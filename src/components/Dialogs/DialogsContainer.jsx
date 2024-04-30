import { connect } from 'react-redux'
import { sendMessageActionCreator, updateTextMessageActionCreator } from "../../redux/dialogs_reducer"
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
        sendMessage: () => dispatch(sendMessageActionCreator()),
        updateTextMessage: (message) => dispatch(updateTextMessageActionCreator(message))
    }
}

export default compose(connect(mapStateToProps, mapDispatchToProps),
    WithAuthRedirect)(Dialogs);