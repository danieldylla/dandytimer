import React, { Component } from 'react';
import Modal from 'react-modal';
import Switch from "react-switch";
import Button from '@material-ui/core/Button';
import { ChromePicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './DeleteModal.css';

class DeleteModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
    }

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  };

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    document.getElementById('clearconfirm').focus();
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleDelete(id) {
    this.props.deleteEntry(id, x);
    this.closeModal();
  }


  render() {

    return (
      <div class="modal">
        <button id="clear" onClick={this.openModal}>
          <FontAwesomeIcon icon="times-circle" />
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
              Delete Time?
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
                  onClick={this.handleClearAll}
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
