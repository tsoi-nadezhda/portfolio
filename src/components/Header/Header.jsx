import React from 'react'
import { NavLink } from 'react-router-dom';
import s from "./Header.module.css"
const Header = (props) => {
  console.log(props)
  return <header className={s.header}>
    <img src="https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg"></img>
    <div className={s.loginBlock}>
      {props.state.isAuth ?
        <div>{props.state.login} <button onClick={props.state.logOut}> Logout </button></div>
        : <NavLink to={'/login'}>Login</NavLink>}

    </div>
  </header>;
}
export default Header;