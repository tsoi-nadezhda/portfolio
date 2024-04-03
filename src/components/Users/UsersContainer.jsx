import { connect } from 'react-redux'
import Users from './Users'
import axios from "axios"
import React from "react";
import { setLoader, setCurrentPage, setTotalCount, follow, unfollow, setUsers } from "../../redux/users_reducer"
import Spinner from '../Spinner/Spinner';
import { usersAPI } from "../../api/api"

class UserContainer extends React.Component {
    constructor(props) {
        super(props);
        this.onPageChanged = this.onPageChanged.bind(this);
    }
    componentDidMount() {
        this.props.setLoader(true)
        usersAPI.getUsers(this.props.limit, this.props.currentPage).then((data) => {
            this.props.setTotalCount(data.totalCount);
            this.props.setUsers(data.items)
            this.props.setLoader(false)
        })
    }
    // onUserChosen(userId) {
    //     axios.get(`https://social-network.samuraijs.com/api/1.0/profile/${userId}`).then((response) => {
    //         console.log("cho", response.data)
    //         this.props.setProfilePage(response.data)
    //     })

    // }
    onPageChanged(pageNumber) {
        this.props.setLoader(true)
        console.log(this.props)
        this.props.setCurrentPage(pageNumber);
        axios.get(`https://social-network.samuraijs.com/api/1.0/users?count=${this.props.limit}&page=${pageNumber}`, {
            withCredentials: true
        }).then((response) => {
            this.props.setUsers(response.data.items)
            this.props.setLoader(false)
        })
    }
    render() {
        return <>
            {this.props.isLoading ? <Spinner></Spinner> : null}
            <Users users={this.props.users}
                totalCount={this.props.totalCount}
                limit={this.props.limit}
                onPageChanged={this.onPageChanged}
                follow={this.props.follow}
                unfollow={this.props.unfollow}
                currentPage={this.props.currentPage}
            />
        </>
    }
}
const mapStateToProps = (state) => {
    return {
        users: state.usersPage.users,
        totalCount: state.usersPage.totalCount,
        limit: state.usersPage.limit,
        currentPage: state.usersPage.currentPage,
        isLoading: state.usersPage.isLoading
    }
}
// const mapDispatchToProps = (dispatch) => {
//     return {
//         follow: (id) => dispatch(followActionCreator(id)),
//         unfollow: (id) => dispatch(unfollowActionCreator(id)),
//         setUsers: (users) => dispatch(setUsersActionCreator(users)),
//         setTotalCount: (total) => dispatch(setTotalCountAC(total)),
//         setCurrentPage: (currentPage) => dispatch(setCurrentPageAC(currentPage)),
//         setLoader: (isLoading) => dispatch(setLoaderAC(isLoading))
//     }
// }
const UsersContainer = connect(mapStateToProps, {
    follow, unfollow, setUsers, setTotalCount, setCurrentPage, setLoader,
})(UserContainer)

export default UsersContainer