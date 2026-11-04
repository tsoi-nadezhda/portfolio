import React from 'react'
import { connect } from 'react-redux'
import Navbar from './Navbar'
import { getRelations } from '../../redux/sidebar_reducer'
import { setCurrentUserId } from '../../redux/users_reducer'

class NavbarContainer extends React.Component {
  componentDidMount() {
    if (this.props.isAuth) this.props.getRelations()
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isAuth && this.props.isAuth) this.props.getRelations()
  }

  render() {
    return <Navbar {...this.props} />
  }
}

const mapStateToProps = (state) => {
  return {
    friends: state.sidebar.friends,
    isAuth: state.auth.isAuth,
  }
}

export default connect(mapStateToProps, { getRelations, setCurrentUserId })(NavbarContainer)
