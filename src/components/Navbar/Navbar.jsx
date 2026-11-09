import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import s from "./Navbar.module.css"

const fallbackPhoto = "./smile.jpg"

const Navbar = (props) => {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])
  let friendsData = props.friends.slice(0, 3).map(f => (<div key={f.id}>
    <NavLink className={({ isActive }) => isActive ? s.activeFriend : undefined} to={`/users/${f.id}`} onClick={() => props.setCurrentUserId(f.id)}>
      <img className={s.avatar} src={f.photos.small || fallbackPhoto} alt="" />
      {f.name}
    </NavLink>
  </div>))
  return (
    <>
    <button
      type="button"
      className={open ? `${s.burger} ${s.burgerOpen}` : s.burger}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
    {open ? <button type="button" className={s.backdrop} aria-label="Close menu" onClick={() => setOpen(false)}></button> : null}
    <nav className={open ? `${s.nav} ${s.open}` : s.nav} onClick={(event) => { if (event.target.closest("a")) setOpen(false) }}>
      <div className={s.item}>
        <NavLink className={({ isActive }) => isActive ? s.activeLink : 'none'} to="/profile">Profile</NavLink>
      </div>
      <div className={s.item}>
        <NavLink className={({ isActive }) => isActive ? s.activeLink : 'none'} to="/dialogs">Messages</NavLink>
      </div>
      <div className={s.item}>
        <NavLink className={({ isActive }) => isActive ? s.activeLink : 'none'} to="/news">News</NavLink>
      </div>
      <div className={s.item}>
        <NavLink className={({ isActive }) => isActive ? s.activeLink : 'none'} to="/music">Music</NavLink>
      </div>
      <div className={s.item}>
        <NavLink className={({ isActive }) => isActive ? s.activeLink : 'none'} to="/settings">Settings</NavLink>
      </div>
      <div className={s.item}>
        <NavLink className={({ isActive }) => isActive ? s.activeLink : undefined} end to="/users">Users</NavLink>
      </div>
      {props.isAuth ? <div className={s.sidebar}>
        <NavLink className={s.friends} to="/friends">Friends</NavLink>
        <div className={s.friendItems}>
          {friendsData.length ? friendsData : <div className={s.empty}>No friends yet</div>}
        </div>
      </div> : null}
    </nav>
    </>
  )
}

export default Navbar;
