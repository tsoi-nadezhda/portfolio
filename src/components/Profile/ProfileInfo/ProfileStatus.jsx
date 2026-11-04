import React, { Component } from 'react';

class ProfileStatus extends Component {
  // constructor(props) {
  //   super(props);
  state = {
    editMode: false,
    status: this.props.status || ""
  };
  // }

  activateEditMode = () => {
    if (!this.props.isOwner) return
    this.setState({
      editMode: true
    });
  }

  deactivateEditMode = () => {
    this.setState({
      editMode: false
    });
    // Вызов метода из props для обновления статуса в родительском компоненте
    if (this.props.updateStatus) {
      this.props.updateStatus(this.state.status);
    }
  }

  onStatusChange = (e) => {
    this.setState({
      status: e.currentTarget.value
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Обновление состояния, если пропс изменился
    if (prevProps.status !== this.props.status) {
      this.setState({
        status: this.props.status
      });
    }
    if (!this.props.isOwner && this.state.editMode) {
      this.setState({
        editMode: false
      });
    }
  }

  render() {
    return (
      <div>
        {!this.state.editMode && (
          <div>
            <span onDoubleClick={this.props.isOwner ? this.activateEditMode : undefined}>
              {this.state.status || "No status"}
            </span>
          </div>
        )}
        {this.state.editMode && (
          <div>
            <input
              onChange={this.onStatusChange}
              autoFocus={true}
              onBlur={this.deactivateEditMode}
              value={this.state.status}
              maxLength={100}
            />
          </div>
        )}
      </div>
    );
  }
}

export default ProfileStatus;
