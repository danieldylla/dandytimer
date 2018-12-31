import React, { Component } from 'react';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import InputNumber from 'react-input-number';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './DeleteModal.css';

class DeleteModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      x: 1
    }

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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

  handleDelete(id) {
    this.props.deleteEntry(id, this.state.x);
    this.closeModal();
  }


  render() {

    return (
      <div className="modal">
        <button onClick={this.openModal}>
          <span id="step">
            {this.props.id + 1}
          </span>
          <span id="delete">
            <FontAwesomeIcon icon="times" />
          </span>
      </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
          className="ArrowModal"
          overlayClassName="ArrowOverlay"
        >
          <div className="clearinfo">
            <h>Delete Time</h>
            <br />
            <p>
              How many results would you like to delete?
              <InputNumber
                className="input"
                onFocus={this.handleFocus}
                min={1}
                step={1}
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
                  tabindex="1"
                >
                  Cancel
                </Button>
              </div>
              <div className="confirm">
                <Button
                  onClick={() => this.handleDelete(this.props.id)}
                  id="clearconfirm"
                  variant="contained"
                  color="secondary"
                  className="confirm"
                  tabindex="2"
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

export default DeleteModal;
