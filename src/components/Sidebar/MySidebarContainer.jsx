import React from 'react'
import MySidebar from './MySidebar'
import StoreContext from "../../StoreContext"
const MySidebarContainer = () => {
    return (
        <StoreContext.Consumer>
            {store => {
                return <MySidebar friendsData={store.getState().sidebar.friendsData} />
            }}
        </StoreContext.Consumer>
    )
}
export default MySidebarContainer