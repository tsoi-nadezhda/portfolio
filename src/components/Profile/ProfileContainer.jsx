import React from 'react'
import { useParams } from 'react-router-dom'
import Profile from './Profile'
import { connect } from 'react-redux'
import { setLoader } from "../../redux/users_reducer"
import Spinner from '../Spinner/Spinner'
import { WithAuthRedirect } from "../../hoc/WithAuthRedirect"
import { compose } from 'redux'

import { setProfilePage, setUserId, getProfile, getStatus, updateStatus, saveProfile, savePhoto, deletePhoto, getPosts } from "../../redux/profile_reducer"
import { follow, unfollow } from "../../redux/users_reducer"


class ProfileContainer extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  profileUserId(props = this.props) {
    const fromUrl = Number(props.params && props.params.userId)
    if (fromUrl) return fromUrl
    return props.authorizedUserId
  }

  loadProfile() {
    const userId = this.profileUserId()
    if (!userId) return
    this.props.getProfile(userId)
    this.props.getStatus(userId)
    this.props.getPosts(userId)
  }

  componentDidMount() {
    this.loadProfile()
  }

  componentDidUpdate(prevProps) {
    if (this.profileUserId(prevProps) !== this.profileUserId()) {
      this.loadProfile()
    }
  }


  render() {
    const requestedId = this.profileUserId()
    if (!this.props.profile || this.props.profile.userId !== requestedId) {
      return <Spinner></Spinner>
    }

    const isOwner = Number(this.props.authorizedUserId) === requestedId
    return <div >
      <Profile state={this.props.profile} isOwner={isOwner} setUserId={this.props.setUserId} status={this.props.status} updateStatus={this.props.updateStatus} saveProfile={this.props.saveProfile} savePhoto={this.props.savePhoto} deletePhoto={this.props.deletePhoto} follow={this.props.follow} unfollow={this.props.unfollow} followingInProgress={this.props.followingInProgress} />
    </div>

  }

}



const mapStateToProps = (state) => {
  return {
    profile: state.profilePage.profile,
    authorizedUserId: state.auth.userId,
    status: state.profilePage.status,
    profilePhoto: state.profilePage.profilePhoto,
    followingInProgress: state.usersPage.followingInProgress
  }
}

const withRouter = (Component) => (props) => {
  const params = useParams()
  return <Component {...props} params={params} />
}

export default compose(connect(mapStateToProps, { setProfilePage, setLoader, setUserId, getProfile, getStatus, updateStatus, saveProfile, savePhoto, deletePhoto, getPosts, follow, unfollow }), WithAuthRedirect, withRouter)(ProfileContainer)