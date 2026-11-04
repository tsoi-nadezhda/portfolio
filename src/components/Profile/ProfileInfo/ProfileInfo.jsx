import React, { useState, useEffect, useRef } from 'react'
import s from "./ProfileInfo.module.css"
import ProfileStatus from './ProfileStatus'
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';

const ProfileInfo = (props) => {
  const { register, handleSubmit,  reset } = useForm();
  useEffect(() => {
    if (props.profile) {
      reset(props.profile);
    }
  }, [props.profile, reset]);
  const renderField = (name, value, type = "text") => {
    if (!isEditMode) {
      if (type === "checkbox") {
        return value ? "Yes" : "No";
      }
      return value || "—";
    }

    if (type === "checkbox") {
      return <input type="checkbox" {...register(name)} />;
    }

    if (type === "textarea") {
      return <textarea {...register(name)} />;
    }

    return <input type="text" {...register(name)} />;
  };
  const photoInput = useRef(null);
  const hasPhoto = Boolean(props.profile.photos && props.profile.photos.large);
  const onPhotoSelected = (e) => {
    const next = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!next || !props.isOwner) return;
    props.savePhoto(next);
  };
  const [isEditMode, setEditMode] = useState(false);
  useEffect(() => {
    if (!props.isOwner) setEditMode(false)
  }, [props.isOwner]);
  const handleEditForm = () => {
    setEditMode(true)
  }
  const handleSaveForm = (data) => {
    if (!props.isOwner) return
    props.saveProfile(data)
    setEditMode(false)
  }
  const photoSrc = hasPhoto
    ? props.profile.photos.large
    : "https://t4.ftcdn.net/jpg/05/29/35/03/360_F_529350362_FmyXL7uFrHmqbH5o3qaLxM68dHg6Pqdx.jpg"
  return (
    <div className={s.card}>
      <form onSubmit={handleSubmit(handleSaveForm)}>
      <div className={s.header}>
        <div className={s.avatarWrap}>
          <img className={s.avatar} src={photoSrc} alt="" />
          {props.isOwner ? <div className={s.avatarMenu}>
            <button type="button" onClick={() => photoInput.current && photoInput.current.click()}>
              {hasPhoto ? "Edit photo" : "Upload photo"}
            </button>
            {hasPhoto ? <button type="button" onClick={props.deletePhoto}>Delete photo</button> : null}
            <input ref={photoInput} className={s.photoInput} type="file" accept=".jpg, .jpeg, .png" onChange={onPhotoSelected} />
          </div> : null}
        </div>
        <div className={s.headerText}>
          {isEditMode
            ? <input className={s.nameInput} type="text" {...register("fullName")} />
            : <div className={s.headerName}>
              <h1 className={s.name}>{props.profile.fullName}</h1>
          {!props.isOwner ? <div className={s.personActions}>
            <NavLink className={s.messageLink} to={`/dialogs/${props.profile.userId}`}>Message</NavLink>
            <button className={s.follow} type="button" disabled={props.followingInProgress.some(id => id === props.profile.userId)} onClick={() => props.profile.followed ? props.unfollow(props.profile.userId) : props.follow(props.profile.userId)}>{props.profile.followed ? "Unfollow" : "Follow"}</button>
          </div> : null}
          </div>}
          <div className={s.status}>
            <ProfileStatus status={props.status} isOwner={props.isOwner} updateStatus={props.updateStatus}></ProfileStatus>
          </div>
          {props.profile.isFriend ? <div className={s.relation}>Friend</div> : null}
          {!props.profile.isFriend && props.profile.followsMe ? <div className={s.relation}>Follows you</div> : null}
          {!props.profile.isFriend && props.profile.followed ? <div className={s.relation}>You follow</div> : null}
        </div>
      </div>
      <div className={s.form}>
        <div className={s.inputField}>
          <label>About Me</label>
          {renderField("aboutMe", props.profile.aboutMe, "textarea")}
        </div>
        <div className={s.inputField}>
          <label>Looking for a job</label>
          {renderField("lookingForAJob", props.profile.lookingForAJob, "checkbox")}
        </div>

        <div className={s.inputField}>
          <label>Looking for a job description</label>
          {renderField(
            "lookingForAJobDescription",
            props.profile.lookingForAJobDescription,
            "textarea"
          )}
        </div>

        {Object.keys(props.profile.contacts).map((c) => (
          <div key={c} className={s.inputField}>
            <label>{c}</label>
            {renderField(
              `contacts.${c}`,
              props.profile.contacts[c]
            )}
          </div>
        ))}
        {props.isOwner ? <div className={s.actions}>
        {isEditMode ? <button type="submit">Save</button> : null}
        {isEditMode ? null : <button type="button" onClick={handleEditForm}>Edit</button>}
        </div> : null}

      </div>
      </form>

    </div>
  )
}
export default ProfileInfo;