import React from 'react'
import Header from "./Header"
import { getAuthUserData, logOut } from "../../redux/auth_reducer"
import { connect } from 'react-redux'
class HeaderContainer extends React.Component {

    render() {
        return <Header state={this.props} />

    }
}
const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.isAuth,
        login: state.auth.login
    }
}


export default connect(mapStateToProps, { getAuthUserData, logOut })(HeaderContainer);