import React from 'react'
import s from "./Profile.module.css"
import MyPosts from './MyPosts/MyPosts'
import ProfileInfo from './ProfileInfo/ProfileInfo'
const Profile = (props) => {
  { console.log("profile", props) }
  return (
    <div >
      <ProfileInfo />
      <MyPosts postData={props.postData} dispatch={props.dispatch} newPostText={props.newPostText} />
    </div>
  )
}
export default Profile;