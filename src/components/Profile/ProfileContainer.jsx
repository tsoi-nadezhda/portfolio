import React from 'react'
import Profile from './Profile'
import { connect } from 'react-redux'
import { setLoader } from "../../redux/users_reducer"
import Spinner from '../Spinner/Spinner'

import { setProfilePage, setUserId, getProfile } from "../../redux/profile_reducer"


class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getProfile(this.props.userId)
  }
  componentDidUpdate() {
    this.props.getProfile(this.props.userId)
  }


  render() {
    console.log("props render", this.props)
    if (!this.props.profile) {
      return <Spinner></Spinner>
    }

    return <div >
      <Profile state={this.props.profile} onUserChosen={this.onUserChosen} setUserId={this.props.setUserId} />
    </div>

  }

}
const mapStateToProps = (state) => {
  return {
    profile: state.profilePage.profile,
    userId: state.profilePage.userId
  }
}

export default connect(mapStateToProps, { setProfilePage, setLoader, setUserId, getProfile })(ProfileContainer);