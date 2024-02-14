import { connect } from 'react-redux'
import Navbar from './Navbar'

const mapStateToProps = (state) => {
  return {
    friendsData: state.sidebar.friendsData
  }
}

const NavbarContainer = connect(mapStateToProps)(Navbar)
export default NavbarContainer;