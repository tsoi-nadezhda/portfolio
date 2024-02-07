import React from 'react'
import s from "./MyPosts.module.css"
import MyPosts from './MyPosts'
import { addPostActionCreator, updatePostMessageCreator } from "../../../redux/profile_reducer"
const MyPostsContainer = (props) => {
  // debugger
  let state = props.store.getState().profilePage

  { console.log("mypost", props) }
  const handleclick = () => {
    props.store.dispatch(addPostActionCreator());
  }
  const onPostChange = (text) => {
    props.store.dispatch(updatePostMessageCreator(text));
  }
  return <MyPosts handleclick={handleclick} onPostChange={onPostChange} newPostText={state.newPostText} postData={state.postData} />
}
export default MyPostsContainer;