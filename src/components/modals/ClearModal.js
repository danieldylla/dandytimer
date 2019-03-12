import React, { Component } from 'react';
import Modal from 'react-modal';
import ReactGA from 'react-ga';
import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
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
    this.colorLuminance = this.colorLuminance.bind(this);
  };

  openModal() {
    this.setState({modalIsOpen: true});
    this.props.handleModal();
    ReactGA.pageview('clear');
  }

  afterOpenModal() {
    document.getElementById('clearconfirm').focus();
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    this.props.handleModal();
    ReactGA.pageview('close');
  }

  handleClearAll() {
    this.props.clearAll();
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
        <button id="logstatbtn" onClick={this.openModal}>
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
            <h1 id="title">Clear All</h1>
            <br />
            <p>
              This will clear your entire history.
              Coninue?
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
                    onClick={this.handleClearAll}
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

export default ClearModal;
