import { connect } from 'react-redux'
import Users from './Users'
import { setCurrentPageAC, setTotalCountAC, followActionCreator, unfollowActionCreator, setUsersActionCreator } from "../../redux/users_reducer"
const mapStateToProps = (state) => {
    return {
        users: state.usersPage.users,
        totalCount: state.usersPage.totalCount,
        limit: state.usersPage.limit,
        currentPage: state.usersPage.currentPage
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        follow: (id) => dispatch(followActionCreator(id)),
        unfollow: (id) => dispatch(unfollowActionCreator(id)),
        setUsers: (users) => dispatch(setUsersActionCreator(users)),
        setTotalCount: (total) => dispatch(setTotalCountAC(total)),
        setCurrentPage: (currentPage) => dispatch(setCurrentPageAC(currentPage))
    }
}
const UsersContainer = connect(mapStateToProps, mapDispatchToProps)(Users)

export default UsersContainer