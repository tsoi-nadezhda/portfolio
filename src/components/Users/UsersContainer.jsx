import { connect } from 'react-redux'
import Users from './Users'
import { followActionCreator, unfollowActionCreator, setUsersActionCreator } from "../../redux/users_reducer"
const mapStateToProps = (state) => {
    return {
        users: state.usersPage.users
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        follow: (id) => dispatch(followActionCreator(id)),
        unfollow: (id) => dispatch(unfollowActionCreator(id)),
        setUsers: (users) => dispatch(setUsersActionCreator(users))
    }
}
const UsersContainer = connect(mapStateToProps, mapDispatchToProps)(Users)

export default UsersContainer