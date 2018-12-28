import React, { Component } from 'react';
import Modal from 'react-modal';
import Switch from "react-switch";
import { ChromePicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Settings.css';



class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      checked: true
    }

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleCubeMode = this.handleCubeMode.bind(this);
  };

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleCubeMode(checked) {
    this.setState({ checked });
    this.props.handleCubeMode(checked);
  }



  render() {
    return (
      <div>
        <button id="icon" onClick ={this.openModal}>
          <FontAwesomeIcon icon="cog" />
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
          className="Modal"
          overlayClassName="Overlay"
        >
          <div className="modalinfo">
            <h>Settings</h>
            <br />
            <div className="switches">
              <Switch
                checked={this.state.checked}
                onChange={this.handleCubeMode}
                onColor="#86d3ff"
                onHandleColor="#2693e6"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="react-switch"
                id="material-switch"
              />
              <span>Cube Mode</span>
            </div>
            <div className="colors">
              <ChromePicker
                
              />
            </div>
          </div>
        </Modal>
      </div>
    );

  }
}

export default Settings;
