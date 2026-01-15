import React from 'react'
import Profile from './Profile'
import { connect } from 'react-redux'
import { setLoader } from "../../redux/users_reducer"
import Spinner from '../Spinner/Spinner'
import { WithAuthRedirect } from "../../hoc/WithAuthRedirect"
import { compose } from 'redux'

import { setProfilePage, setUserId, getProfile, getStatus, updateStatus } from "../../redux/profile_reducer"


class ProfileContainer extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    this.props.getProfile(this.props.userId)
    this.props.getStatus(this.props.userId)
  }


  render() {
    console.log(this.props, "PROFILE")
    if (!this.props.profile) {
      return <Spinner></Spinner>
    }

    return <div >
      <Profile state={this.props.profile} setUserId={this.props.setUserId} status={this.props.status} updateStatus={this.props.updateStatus} />
    </div>

  }

}



const mapStateToProps = (state) => {
  return {
    profile: state.profilePage.profile,
    userId: state.usersPage.currentUserId,
    status: state.profilePage.status
  }
}

export default compose(connect(mapStateToProps, { setProfilePage, setLoader, setUserId, getProfile, getStatus, updateStatus }), WithAuthRedirect)(ProfileContainer)