import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import s from "./Header.module.css"
const Header = (props) => {
  const navigate = useNavigate()
  const onLogout = () => {
    props.state.logOut().then((left) => {
      if (left) navigate("/login")
    })
  }
  return <header className={s.header}>
    <img alt="header" src="https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg"></img>
    <div className={s.loginBlock}>
      {props.state.isAuth ?
        <div>{props.state.name || props.state.login} <button onClick={onLogout}> Logout </button></div>
        : <NavLink to={'/login'}>Sign in</NavLink>}

    </div>
  </header>;
}
export default Header;