import React, { Component } from 'react';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List } from 'react-virtualized';

import './DeleteModal.css';

class DeleteModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      x: 1
    }

    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  };

  afterOpenModal() {
    document.getElementById('clearconfirm').focus();
  }

  handleChange(e) {
    let number = e.target.value.toString().replace(/[^0-9]/g,"");
    let min = 0;
    let max = this.props.log.length - this.props.index;
    console.log(max);
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

  handleDelete(id) {
    this.props.deleteEntry(id, Number(this.state.x));
    this.setState({
      x: 1
    });
    this.props.closeModal();
  }

  handleClose = () => {
    this.props.closeModal();
    setTimeout(() => this.setState({ x: 1 }), 200);
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

  renderRow = ({ index, key, style }) => {
    let item = this.props.log[this.props.index + index];
    return (
      <div key={key} style={style} className="row">
        <div className="half">
          <span id="step">
            {item.res.id}
          </span>
        </div>
        <div className="half">
          <span id="step">
            {this.props.displayLogEntry(item.res)}
          </span>
        </div>
      </div>
    );
  }

  renderDeleted = () => {
    const rowheight = 30;
    return (
      <div className="deleted">
        <List
          width={window.innerWidth}
          height={280}
          rowHeight={rowheight}
          rowRenderer={this.renderRow}
          rowCount={Number(this.state.x)}
          overscanRowCount={5}
        />
      </div>
    );
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
        <Modal
          isOpen={this.props.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.props.closeModal}
          ariaHideApp={false}
          closeTimeoutMS={200}
          contentLabel="Example Modal"
          className="DeleteModal"
          overlayClassName="DeleteOverlay"
        >
          <div className="clearinfo">
            <h1 id="title">Delete Time</h1>
            <br />
            <div style={{userSelect: "none"}}>
              <p id="inline">
                How many results would you like to delete?
              </p>
              <div id="inline2">
                <FontAwesomeIcon icon="caret-left" id="changen"
                  onClick={() => {if (this.state.x > 0) this.setState({ x: this.state.x - 1 });}}
                />
                <input
                  id="input"
                  onFocus={this.handleFocus}
                  step={1}
                  type="text"
                  value={this.state.x}
                  onInput={e => this.handleChange(e)}
                />
                <FontAwesomeIcon icon="caret-right" id="changen"
                  onClick={() => {if (this.state.x < this.props.log.length - this.props.index) this.setState({ x: this.state.x + 1 });}}
                />
              </div>
            </div>
            {this.renderDeleted()}
            <div className="choosedelete">
              <MuiThemeProvider theme={theme}>
                <div className="cancel">
                  <Button
                    onClick={this.handleClose}
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
                    onClick={() => this.handleDelete(this.props.res.id)}
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
