import React, { Component } from 'react';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import InputNumber from 'react-input-number';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './SessionModal.css';

class SessionModal extends Component {
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

  handleAdd() {
    this.props.addTime(this.state.x);
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
        <Modal
          isOpen={this.props.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.props.closeModal}
          ariaHideApp={false}
          contentLabel="Example Modal"
          className="SessionModal"
          overlayClassName="SessionOverlay"
        >
          <div className="clearinfo">
            <h1 id="titlesess">Sessions</h1>
            <br />
            <div className="sessions">

            </div>
          </div>
        </Modal>
      </div>
    );

  }
}

export default SessionModal;
