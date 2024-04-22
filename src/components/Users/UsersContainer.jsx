import { connect } from 'react-redux'
import Users from './Users'
import React from "react";
import { follow, unfollow, getUsers, setCurrentUserId } from "../../redux/users_reducer"
import Spinner from '../Spinner/Spinner';

class UserContainer extends React.Component {
    constructor(props) {
        super(props);
        this.onPageChanged = this.onPageChanged.bind(this);
    }
    componentDidMount() {
        this.props.getUsers(this.props.limit, this.props.currentPage)
    }

    onPageChanged(pageNumber) {
        this.props.getUsers(this.props.limit, pageNumber)
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
                followingInProgress={this.props.followingInProgress}
                setCurrentUserId={this.props.setCurrentUserId}
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
        isLoading: state.usersPage.isLoading,
        followingInProgress: state.usersPage.followingInProgress
    }
}

const UsersContainer = connect(mapStateToProps, {
    follow, unfollow, getUsers, setCurrentUserId
})(UserContainer)

export default UsersContainer