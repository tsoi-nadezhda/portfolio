import React from 'react'
import { connect } from 'react-redux'
import MySidebar from './MySidebar'
import { getRelations } from '../../redux/sidebar_reducer'
import { setCurrentUserId } from '../../redux/users_reducer'

class MySidebarContainer extends React.Component {
    componentDidMount() {
        this.props.getRelations()
    }

    render() {
        return <MySidebar {...this.props} />
    }
}

const mapStateToProps = (state) => {
    return {
        friends: state.sidebar.friends,
        following: state.sidebar.following,
        followers: state.sidebar.followers,
    }
}

export default connect(mapStateToProps, { getRelations, setCurrentUserId })(MySidebarContainer)
