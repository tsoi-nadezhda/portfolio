import React from 'react'
import s from "./MyPosts.module.css"
import Post from './Posts/Post'
import { addPostActionCreator, updatePostMessageCreator } from "../../../redux/profile_reducer"
const MyPosts = (props) => {
  // debugger

  let newEl = React.createRef()
  { console.log("mypost", props) }
  const handleclick = () => {
    props.dispatch(addPostActionCreator());
    props.dispatch(updatePostMessageCreator(""));
  }
  const onPostChange = () => {
    let text = newEl.current.value;
    props.dispatch(updatePostMessageCreator(text));
  }
  return <div className={s.content}>
    <div className={s.postsBlock}>
      My posts

      <div>
        <div>
          <textarea ref={newEl} value={props.newPostText} onChange={onPostChange}></textarea>
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