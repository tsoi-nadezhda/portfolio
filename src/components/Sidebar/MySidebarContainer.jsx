import React from 'react'
import MySidebar from './MySidebar'
import StoreContext from "../../StoreContext"
import { connect } from 'react-redux'
const MySidebarContainer1 = () => {
    return (
        <StoreContext.Consumer>
            {store => {
                return <MySidebar friendsData={store.getState().sidebar.friendsData} />
            }}
        </StoreContext.Consumer>
    )
}
const mapStateToProps = (state) => {
    return {
        friendsData: state.sidebar.friendsData,
    }
}
const MySidebarContainer = connect(mapStateToProps)(MySidebar)
export default MySidebarContainer