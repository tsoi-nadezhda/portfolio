import React from 'react'
import s from "./MyPosts.module.css"
import Post from './Posts/Post'
import { useRef } from 'react';
import { addPost } from '../../../redux/state';
const MyPosts = (props) => {
  // debugger

  let newEl = React.createRef()
  { console.log("mypost", props) }
  const handleclick = () => {
    let text = newEl.current.value;
    props.addPost(text);
    newEl.current.value = "";
  }
  return <div className={s.content}>
    <div className={s.postsBlock}>
      My posts

      <div>
        <div>
          <textarea ref={newEl}></textarea>
        </div>
        <div>
          <button onClick={handleclick}>Add post</button>
        </div>
      </div>
      <div className={s.posts}>

        {props.postData.map(p => <Post key={p.id} message={p.message} likeCount={p.likeCount}></Post>)}
      </div>
    </div>
  </div>
}
export default MyPosts;