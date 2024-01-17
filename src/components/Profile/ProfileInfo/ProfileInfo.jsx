import React from 'react'
import s from "./ProfileInfo.module.css"
const ProfileInfo = (props) => {
  return (
    <div>
      <div>
        <img src="https://ichef.bbci.co.uk/news/976/cpsprodpb/6D5A/production/_119449972_10.jpg"></img>
      </div>
      <div className={s.descriptionBlock}>
        ava+description
      </div>
    </div>
  )
}
export default ProfileInfo;