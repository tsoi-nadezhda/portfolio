import React from 'react'
import { NavLink } from 'react-router-dom'
import s from "./Navbar.module.css"
import MySidebar from '../Sidebar/MySidebar';
// console.log(s)
const Navbar = (props) => {
  let friendsData = props.friendsData.slice(0, 3).map(f => (<div key={f.id}><NavLink to={`/friends/profile/${f.name}`}>{f.name}<img className={s.avatar} src={f.img} /></NavLink></div>))
  return <nav className={s.nav}>
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
    <div className={s.sidebar}>
      <NavLink className={s.friends} to="/friends">Friends</NavLink>
      <div className={s.friendItems}>
        {friendsData}
      </div>
    </div>


  </nav>
}
export default Navbar;