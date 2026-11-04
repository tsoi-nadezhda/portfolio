import React from 'react'
import s from "./MyPosts.module.css"
import Post from './Posts/Post'
const MyPosts = (props) => {

  let newEl = React.createRef()
  const handleclick = () => {
    props.handleclick();
  }
  const onPostChange = (e) => {
    let text = e.target.value;
    props.onPostChange(text);
  }
  return <div className={s.content}>
    <div className={s.postsBlock}>
      {props.isOwner ? "My posts" : "Posts"}

      {props.isOwner ? <div>
        <div>
          <textarea ref={newEl} value={props.newPostText} onChange={onPostChange}></textarea>
        </div>
        <div>
          <button onClick={handleclick}>Add post</button>
        </div>
      </div> : null}
      <div className={s.posts}>

        {props.postData.map(p => <Post key={p.id} id={p.id} message={p.message} likeCount={p.likeCount} liked={p.liked} canDelete={props.isOwner} onDelete={props.onDelete} onLike={props.onLike} photo={props.profile.photos.small || 'https://t4.ftcdn.net/jpg/05/29/35/03/360_F_529350362_FmyXL7uFrHmqbH5o3qaLxM68dHg6Pqdx.jpg'}></Post>)}
      </div>
    </div>
  </div>
}
export default MyPosts;