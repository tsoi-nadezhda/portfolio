import React from 'react'
import s from "./MySidebar.module.css"
import { NavLink } from 'react-router-dom'

const fallbackPhoto = "./smile.jpg"

const Person = ({ user, setCurrentUserId }) => (
    <NavLink className={s.friend} to={`/users/${user.id}`} onClick={() => setCurrentUserId(user.id)}>
        <img src={user.photos.small || fallbackPhoto} alt="" />
        <span>
            <strong>{user.name}</strong>
            <small>{user.status || "No status"}</small>
        </span>
    </NavLink>
)

const List = ({ title, text, users, setCurrentUserId }) => (
    <section className={s.section}>
        <h2>{title}</h2>
        <p>{text}</p>
        {users.length
            ? users.map(user => <Person key={user.id} user={user} setCurrentUserId={setCurrentUserId} />)
            : <div className={s.empty}>Nobody here yet</div>}
    </section>
)

const MySidebar = (props) => {
    return (
        <div className={s.page}>
            <List title="Friends" text="You follow each other" users={props.friends} setCurrentUserId={props.setCurrentUserId} />
            <List title="Following" text="People you follow" users={props.following} setCurrentUserId={props.setCurrentUserId} />
            <List title="Followers" text="People who follow you" users={props.followers} setCurrentUserId={props.setCurrentUserId} />
        </div>
    )
}
export default MySidebar
