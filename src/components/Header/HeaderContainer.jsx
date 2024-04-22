import React from 'react'
import Header from "./Header"
import { setAuthUserData, getAuthUserData } from "../../redux/auth_reducer"
import { connect } from 'react-redux'
class HeaderContainer extends React.Component {
    componentDidMount() {
        this.props.getAuthUserData();
    }
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


export default connect(mapStateToProps, { setAuthUserData, getAuthUserData })(HeaderContainer);