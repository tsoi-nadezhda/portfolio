import React from 'react'
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux'
const mapStateToPropsForRedirect = (state) => {
  return {
    isAuth: state.auth.isAuth
  }
}
export const WithAuthRedirect = (Component) => {
  let RedirectComponent = (props) => {

    if (!props.isAuth) return <Navigate to={"/login"}></Navigate>
    return <Component {...props} />
  }
  let ConnectedAuthRedirectComponent = connect(mapStateToPropsForRedirect)(RedirectComponent)
  return ConnectedAuthRedirectComponent
}