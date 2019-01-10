import React, { Component } from 'react';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import InputNumber from 'react-input-number';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './AddModal.css';

class AddModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      x: 1
    }

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  };

  openModal() {
    this.setState({modalIsOpen: true});
    this.props.handleModal();
  }

  afterOpenModal() {
    document.getElementById('clearconfirm').focus();
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    this.props.handleModal();
  }

  handleChange(value) {
    this.setState({
      x: value
    });
  }

  handleFocus(event) {
    event.target.select();
  }

  handleAdd() {
    this.props.addTime(this.state.x);
    this.closeModal();
  }


  render() {
    return (
      <div className="modal">
        <button id="clear" onClick={this.openModal}>
          <FontAwesomeIcon icon="plus" />
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          ariaHideApp={false}
          contentLabel="Example Modal"
          className="ArrowModal"
          overlayClassName="ArrowOverlay"
        >
          <div className="clearinfo">
            <h1>Add Time</h1>
            <br />
            <p>
              Enter your time in seconds:
              <InputNumber
                className="input"
                onFocus={this.handleFocus}
                min={0}
                step={.001}
                value={this.state.x}
                onChange={value => this.handleChange(value)}
              />
            </p>
            <div className="choose">
              <div className="cancel">
                <Button
                  onClick={this.closeModal}
                  variant="contained"
                  color="primary"
                  className="confirm"
                  tabIndex="1"
                >
                  Cancel
                </Button>
              </div>
              <div className="confirm">
                <Button
                  onClick={this.handleAdd}
                  id="clearconfirm"
                  variant="contained"
                  color="secondary"
                  className="confirm"
                  tabIndex="2"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );

  }
}

export default AddModal;
