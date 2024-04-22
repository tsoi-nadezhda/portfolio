import React from 'react'
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux'
const mapStateToPropsForRedirect = (state) => {
    return {
      isAuth: state.auth.isAuth
    }
  }
export const WithAuthRedirect=(Component)=>{
    class RedirectComponent extends React.Component{
        render(){
            if (this.props.isAuth === false) return <Navigate to={"/login"}></Navigate>
            return <Component {...this.props} />
        }
        
    }
    
    let ConnectedAuthRedirectComponent = connect(mapStateToPropsForRedirect)(RedirectComponent)
    return ConnectedAuthRedirectComponent
}