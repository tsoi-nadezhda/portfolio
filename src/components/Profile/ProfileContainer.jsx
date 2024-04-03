import React from 'react'
import Profile from './Profile'
import { connect } from 'react-redux'
import { setLoader } from "../../redux/users_reducer"
import Spinner from '../Spinner/Spinner'

import { setProfilePage, setUserId } from "../../redux/profile_reducer"
import axios from "axios"

class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    // this.onUserChosen = this.onUserChosen.bind(this);
  }

  componentDidMount() {
    console.log("dvvvfd", this.props.userId)
    axios.get(`https://social-network.samuraijs.com/api/1.0/profile/${this.props.userId}`, {
      withCredentials: true
    }).then((response) => {
      // console.log(response.data)
      this.props.setProfilePage(response.data)
    })
  }
  componentDidUpdate() {
    axios.get(`https://social-network.samuraijs.com/api/1.0/profile/${this.props.userId}`, {
      withCredentials: true
    }).then((response) => {
      // console.log("data", response.data)
      this.props.setProfilePage(response.data)
    })
  }
  // onUserChosen(userId) {
  //   // this.props.setUserId(userId)
  //   axios.get(`https://social-network.samuraijs.com/api/1.0/profile/${userId}`).then((response) => {
  //     this.props.setProfilePage(response.data)
  //   })

  // }

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

export default connect(mapStateToProps, { setProfilePage, setLoader, setUserId })(ProfileContainer);