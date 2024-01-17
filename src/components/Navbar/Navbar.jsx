import React from 'react'
import { NavLink } from 'react-router-dom'
import s from "./Navbar.module.css"
// console.log(s)
const Navbar = () => {
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
  </nav>
}
export default Navbar;