import React from 'react'
import Login from "./Login"
import { logIn } from "../../redux/auth_reducer"
import { connect } from 'react-redux'
class LoginContainer extends React.Component {
    componentDidMount() {
        console.log(this.props)
    }
    render() {
        return <Login state={this.props} />

    }
}
const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.isAuth,
        login: state.auth.login
    }
}


export default connect(mapStateToProps, { logIn })(LoginContainer);