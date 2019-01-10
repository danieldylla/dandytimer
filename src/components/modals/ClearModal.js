import React, { Component } from 'react';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './ClearModal.css';

class ClearModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
    }

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleClearAll = this.handleClearAll.bind(this);
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

  handleClearAll() {
    this.props.clearAll();
    this.closeModal();
  }


  render() {

    return (
      <div className="modal">
        <button id="clear" onClick={this.openModal}>
          <FontAwesomeIcon icon="times" />
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
            <h1>Clear All</h1>
            <br />
            <p>
              This will clear your entire history.
              Coninue?
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
                  onClick={this.handleClearAll}
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

export default ClearModal;
