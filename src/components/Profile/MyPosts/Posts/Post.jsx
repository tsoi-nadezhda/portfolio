import React from 'react'
import s from "./Post.module.css"
const Post = (props) => {
  return <div className={s.item}>
    <img alt="post" src={props.photo}></img>
    <span className={s.message}>{props.message}</span>
    <div>
      <button type="button" className={props.liked ? s.liked : s.like} onClick={() => props.onLike(props.id)}>
        ♥ {props.likeCount}
      </button>
      {props.canDelete ? <button type="button" onClick={() => props.onDelete(props.id)}>❌</button> : null}
    </div>
  </div>
}
export default Post;