import MyPosts from './MyPosts'
import { savePost, deletePost, likePost, updatePostMessageCreator } from "../../../redux/profile_reducer"
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    newPostText: state.profilePage.newPostText,
    postData: state.profilePage.postData,
    isOwner: state.profilePage.profile != null && state.auth.userId === state.profilePage.profile.userId
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    handleclick: () => dispatch(savePost()),
    onDelete: (postId) => dispatch(deletePost(postId)),
    onLike: (postId) => dispatch(likePost(postId)),
    onPostChange: (text) => dispatch(updatePostMessageCreator(text))
  }
}
const MyPostsContainer = connect(mapStateToProps, mapDispatchToProps)(MyPosts)
export default MyPostsContainer