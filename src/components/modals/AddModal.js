import React, { Component } from 'react';
import Modal from 'react-modal';
import ReactGA from 'react-ga';
import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import InputNumber from 'react-input-number';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './AddModal.css';
import { min } from 'moment';

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
    ReactGA.pageview('/add');
  }

  afterOpenModal() {
    document.getElementById('clearconfirm').focus();
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    this.props.handleModal();
    ReactGA.pageview('/');
  }

  handleChange(e) {
    let number = e.target.value.replace(/[^0-9\.]/g,"");
    let min = 0;
    let max = 1440
    if (Number(number) < min) {
      this.setState({ x: min });
    } else if (Number(number) > max) {
      this.setState({ x: max });
    } else {
      this.setState({ x: number });
    }
  }

  handleFocus(event) {
    event.target.select();
  }

  handleAdd() {
    if (Number(this.state.x)) this.props.addTime(Number(this.state.x));
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
    const style = window.getComputedStyle(document.documentElement);
    let accent = style.getPropertyValue('--accent');
    const theme = createMuiTheme({
      typography: {
        useNextVariants: true,
      },
      palette: {
        primary: {
          main: accent,
          contrastText: this.props.theme.primary,
          dark: this.colorLuminance(accent, -.2),
          light: this.colorLuminance(accent, .2)
        },
        secondary: {
          main: this.colorLuminance(accent, -.3),
          contrastText: this.props.theme.primary,
          dark: this.colorLuminance(accent, -.5),
          light: this.colorLuminance(accent, -.1)
        }
      },
      shadows: Array(25).fill('none')
    });

    return (
      <div className="modal">
        <button id="logstatbtn" onClick={this.openModal}>
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
            <h1 id="title">Add Time</h1>
            <br />
            <div style={{userSelect: "none"}}>
              <p id="inline">
                Enter your time in seconds:
              </p>
              <div id="inline2">
                <FontAwesomeIcon icon="caret-left" id="changen"
                  onClick={() => {if (this.state.x > 0) this.setState({ x: this.state.x - 1 });}}
                />
                <input
                  id="input"
                  onFocus={this.handleFocus}
                  min={0}
                  step={.001}
                  value={this.state.x}
                  type="text"
                  onInput={e => this.handleChange(e)}
                />
                <FontAwesomeIcon icon="caret-right" id="changen"
                  onClick={() => {if (this.state.x < 1440) this.setState({ x: this.state.x + 1 });}}
                />
              </div>
            </div>
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
                    onClick={this.handleAdd}
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

export default AddModal;
