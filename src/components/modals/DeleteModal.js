import React, { Component } from 'react';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
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
    this.handleChange(1);
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

  colorLuminance(hex, lum) {
  	// validate hex string
  	hex = String(hex).replace(/[^0-9a-f]/gi, '');
  	if (hex.length < 6) {
  		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  	}
  	lum = lum || 0;
  	// convert to decimal and change luminosity
  	var rgb = "#", c, i;
  	for (i = 0; i < 3; i++) {
  		c = parseInt(hex.substr(i*2,2), 16);
  		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
  		rgb += ("00"+c).substr(c.length);
  	}
  	return rgb;
  }

  render() {
    const theme = createMuiTheme({
      typography: {
        useNextVariants: true,
      },
      palette: {
        primary: {
          main: this.props.theme.accent,
          contrastText: this.props.theme.primary,
          dark: this.colorLuminance(this.props.theme.accent, -.2),
          light: this.colorLuminance(this.props.theme.accent, .2)
        },
        secondary: {
          main: this.colorLuminance(this.props.theme.accent, -.3),
          contrastText: this.props.theme.primary,
          dark: this.colorLuminance(this.props.theme.accent, -.5),
          light: this.colorLuminance(this.props.theme.accent, -.1)
        }
      },
      shadows: Array(25).fill('none')
    });

    return (
      <div className="modal">
        <button onClick={this.openModal}>
          <span id="step">
            {this.props.id}
          </span>
          <span id="delete">
            <FontAwesomeIcon icon="times" />
          </span>
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
            <h1 id="title">Delete Time</h1>
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
              <MuiThemeProvider theme={theme}>
                <div className="cancel">
                  <Button
                    onClick={this.closeModal}
                    variant="outlined"
                    color="primary"
                    className="confirm"
                    tabIndex="1"
                  >
                    Cancel
                  </Button>
                </div>
                <div className="confirm">
                  <Button
                    onClick={() => this.handleDelete(this.props.id)}
                    id="clearconfirm"
                    variant="contained"
                    color="primary"
                    className="confirm"
                    tabIndex="2"
                  >
                    Confirm
                  </Button>
                </div>
              </MuiThemeProvider>
            </div>
          </div>
        </Modal>
      </div>
    );

  }
}

export default DeleteModal;
