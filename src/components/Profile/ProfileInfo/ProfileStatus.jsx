import React from 'react'
import s from "./ProfileInfo.module.css"

class ProfileStatus extends React.Component {
  state = {
    editMode: false
  };
  activateMode() {
    debugger
    this.setState({
      editMode: true
    })
  }
  deactivateEditMode() {
    this.setState({
      editMode: false
    })
  }
  render() {
    return (
      <div>
        {this.state.editMode ?
          <div >
            <input value={this.props.status} autoFocus={true} onBlur={this.deactivateEditMode.bind(this)}></input>
          </div>
          :
          <div>
            <span onDoubleClick={this.activateMode.bind(this)}>{this.props.status}</span>
          </div>
        }

      </div>
    )
  }


}
export default ProfileStatus;