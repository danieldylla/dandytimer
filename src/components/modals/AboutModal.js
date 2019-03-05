import React, { Component } from 'react';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import './AboutModal.css';

class AboutModal extends Component {
  constructor(props) {
    super(props);

    this.afterOpenModal = this.afterOpenModal.bind(this);
  };

  afterOpenModal() {
  }

  handleFocus(event) {
    event.target.select();
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
            className="TimeModal"
            overlayClassName="TimeOverlay"
          >
            <div className="averageinfo">
              <h3 id="titleav">About</h3>
              <br />
              <div className="modalinfo">
              </div>
              <div className="avbuttons">
                <MuiThemeProvider theme={theme}>
                  <div className="confirm">
                    <Button
                      onClick={this.props.closeModal}
                      id="confirm"
                      variant="contained"
                      color="primary"
                      className="confirm"
                      tabIndex="2"
                    >
                      ok
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

export default AboutModal;
