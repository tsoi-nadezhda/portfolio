import React from 'react'
import s from "./Profile.module.css"
import MyPostsContainer from './MyPosts/MyPostsContainer'
import ProfileInfo from './ProfileInfo/ProfileInfo'
const Profile = (props) => {
  return (
    <div className={s.profile}>
      <ProfileInfo profile={props.state} isOwner={props.isOwner} status={props.status} updateStatus={props.updateStatus} saveProfile={props.saveProfile} savePhoto={props.savePhoto} deletePhoto={props.deletePhoto} follow={props.follow} unfollow={props.unfollow} followingInProgress={props.followingInProgress} />
      <MyPostsContainer profile={props.state} />
    </div>
  )
}
export default Profile;