import React, { Component } from 'react';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import './DeleteSessionModal.css';

class DeleteSessionModal extends Component {
  constructor(props) {
    super(props);

    this.afterOpenModal = this.afterOpenModal.bind(this);
  };

  afterOpenModal() {
    document.getElementById('clearconfirm').focus();
  }

  handleFocus(event) {
    event.target.select();
  }

  handleDeleteSession(i) {
    this.props.deleteSession(i);
    this.props.closeModal();
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
      {this.props.modalIsOpen ?
        <Modal
          isOpen={this.props.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.props.closeModal}
          ariaHideApp={false}
          contentLabel="Example Modal"
          className="DeleteSessionModal"
          overlayClassName="DeleteSessionOverlay"
        >
          <div className="deletesessinfo">
            <h1 id="dstitle">Delete Session</h1>
            <br />
            <p className="dsinfo">
              Are you sure that you want to delete this session?
              This cannot be undone.
            </p>
            <div className="sesschoose">
              <MuiThemeProvider theme={theme}>
                <div className="sesscancel">
                  <Button
                    onClick={this.props.closeModal}
                    variant="outlined"
                    color="primary"
                    className="confirm"
                    tabIndex="1"
                  >
                    Cancel
                  </Button>
                </div>
                <div className="sessconfirm">
                  <Button
                    onClick={() => this.handleDeleteSession(this.props.id)}
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
        : null}
      </div>
    );

  }
}

export default DeleteSessionModal;
