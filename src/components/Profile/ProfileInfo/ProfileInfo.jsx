import React from 'react'
import s from "./ProfileInfo.module.css"
const ProfileInfo = (props) => {
  return (
    <div>
      <div>
        <img src={props.profile.photos.large}></img>
      </div>
      <div className={s.descriptionBlock}>
        <div>{props.profile.fullName}</div>
        <div>{props.profile.aboutMe}</div>
      </div>
    </div>
  )
}
export default ProfileInfo;