import React from 'react'
import s from "./MyPosts.module.css"
import MyPosts from './MyPosts'
import { addPostActionCreator, updatePostMessageCreator } from "../../../redux/profile_reducer"
import StoreContext from "../../../StoreContext"
const MyPostsContainer = () => {
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
export default MyPostsContainer