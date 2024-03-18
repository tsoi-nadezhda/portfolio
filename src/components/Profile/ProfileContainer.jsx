import React from 'react'
import Profile from './Profile'
import { connect } from 'react-redux'
import { setProfilePage } from "../../redux/profile_reducer"
import { setLoader } from "../../redux/users_reducer"

import Spinner from '../Spinner/Spinner'
import axios from "axios"
class ProfileContainer extends React.Component {

  componentDidMount() {
    axios.get(`https://social-network.samuraijs.com/api/1.0/profile/2`).then((response) => {
      console.log(response.data)
      this.props.setProfilePage(response.data)

    })
  }
  render() {
    if (!this.props.profile) {
      return <Spinner></Spinner>
    }
    return <div >
      <Profile state={this.props.profile} />
    </div>

  }

}
const mapStateToProps = (state) => {
  return {
    profile: state.profilePage.profile
  }
}
export default connect(mapStateToProps, { setProfilePage, setLoader })(ProfileContainer);