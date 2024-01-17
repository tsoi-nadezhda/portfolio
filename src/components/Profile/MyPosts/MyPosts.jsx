import React from 'react'
import s from "./MyPosts.module.css"
import Post from './Posts/Post'
const MyPosts = (props) => {
  // debugger
  { console.log("mypost", props.postData) }
  return <div className={s.content}>
    <div className={s.postsBlock}>
      My posts

      <div>
        <div>
          <textarea></textarea>
        </div>
        <div>
          <button>Add post</button>
        </div>
      </div>
      <div className={s.posts}>
        {props.postData.map(p => <Post message={p.message} likeCount={p.likeCount}></Post>)}
      </div>
    </div>
  </div>
}
export default MyPosts;