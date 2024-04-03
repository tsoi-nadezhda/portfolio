import React from 'react'
import s from "./Profile.module.css"
import { useParams } from 'react-router-dom'
import MyPostsContainer from './MyPosts/MyPostsContainer'
import ProfileInfo from './ProfileInfo/ProfileInfo'
const Profile = (props) => {
  const params = useParams();
  console.log("Prooofile", props.state)
  // props.onUserChosen(params.userId)
  props.setUserId(params.userId)

  return (
    <div >
      <ProfileInfo profile={props.state} />
      <MyPostsContainer profile={props.state} />
    </div>
  )
}
export default Profile;