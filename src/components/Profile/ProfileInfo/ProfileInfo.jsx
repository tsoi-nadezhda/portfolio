import React from 'react'
import s from "./ProfileInfo.module.css"
import ProfileStatus from './ProfileStatus'

const ProfileInfo = (props) => {
  return (
    <div>
      <div>
        {props.profile.photos.large ? (
          <img src={props.profile.photos.large} alt="User's Profile" />
        ) : (
          <img src="https://t4.ftcdn.net/jpg/05/29/35/03/360_F_529350362_FmyXL7uFrHmqbH5o3qaLxM68dHg6Pqdx.jpg" alt="Default Profile" />
        )}
      </div>
      <div className={s.descriptionBlock}>
        <div>{props.profile.fullName}</div>
        <div>{props.profile.aboutMe}</div>
      </div>
      <ProfileStatus status={"Helloooo"}></ProfileStatus>
    </div>
  )
}
export default ProfileInfo;