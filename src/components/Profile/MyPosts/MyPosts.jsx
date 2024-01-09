import React from 'react'
import s from "./MyPosts.module.css"
import Post from './Posts/Post'
const MyPosts = (props) =>{
  debugger
    return <div className={s.content}>
    <div>
      My posts 
      <div>
        <textarea></textarea>
        <button>Add post</button>
        <button>Remove</button>
      </div>
      <div className={s.posts}>
        <Post message="Hi! How are you?" likecount="15" />
        <Post message="It's my first post" likecount="20"/>
      </div>
    </div>
  </div>
}
export default MyPosts; 