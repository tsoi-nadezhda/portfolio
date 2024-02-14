import React from 'react'
import s from "./MyPosts.module.css"
import MyPosts from './MyPosts'
import { addPostActionCreator, updatePostMessageCreator } from "../../../redux/profile_reducer"
import StoreContext from "../../../StoreContext"
import { connect } from 'react-redux'
const MyPostsContainer1 = () => {
  return (
    <StoreContext.Consumer>
      {store => {
        const handleclick = () => {
          store.dispatch(addPostActionCreator());
        }
        const onPostChange = (text) => {
          store.dispatch(updatePostMessageCreator(text));
        }
        return (
          <MyPosts handleclick={handleclick} onPostChange={onPostChange} newPostText={store.getState().profilePage.newPostText} postData={store.getState().profilePage.postData} />
        )
      }}
    </StoreContext.Consumer>
  )
}
const mapStateToProps = (state) => {
  return {
    newPostText: state.profilePage.newPostText,
    postData: state.profilePage.postData
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    handleclick: () => dispatch(addPostActionCreator()),
    onPostChange: (text) => dispatch(updatePostMessageCreator(text))
  }
}
const MyPostsContainer = connect(mapStateToProps, mapDispatchToProps)(MyPosts)
export default MyPostsContainer