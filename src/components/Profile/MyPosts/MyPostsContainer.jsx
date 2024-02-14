import MyPosts from './MyPosts'
import { addPostActionCreator, updatePostMessageCreator } from "../../../redux/profile_reducer"
import { connect } from 'react-redux'

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