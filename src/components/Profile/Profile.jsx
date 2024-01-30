import React from 'react'
import s from "./Profile.module.css"
import MyPosts from './MyPosts/MyPosts'
import ProfileInfo from './ProfileInfo/ProfileInfo'
const Profile = (props) => {
  { console.log("profile", props) }
  return (
    <div >
      <ProfileInfo />
      <MyPosts postData={props.postData} addPost={props.addPost} newPostText={props.newPostText} updatePostMessage={props.updatePostMessage} />
    </div>
  )
}
export default Profile;