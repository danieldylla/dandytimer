import React, { Component } from 'react';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Ao5Modal.css';

class Ao5Modal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      plus2: this.props.res.plus2
    }

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.convertToTime = this.convertToTime.bind(this);
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

  handleFocus(event) {
    event.target.select();
  }

  copyTime(text) {
    document.body.insertAdjacentHTML("beforeend","<div id=\"copy\" contenteditable>"+text+"</div>")
    document.getElementById("copy").focus();
    document.execCommand("selectAll");
    document.execCommand("copy");
    document.getElementById("copy").remove();
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

  displayHour(h) {
    if (h) {
      return(h + ':');
    }
    return('');
  }

  displayMinute(h, m) {
    if (m) {
      if (m < 10 && h) {
        return('0' + m + ':');
      }
      return(m + ':');
    }
    return('');
  }

  displaySecond(m, s) {
    if (s < 10 && m) {
      return('0' + s);
    }
    return(s);
  }

  displayMillisecond(l) {
    if (l < 10) {
      return('0' + l);
    }
    return(l);
  }

  displayLogEntry(res) {
    if (res.dnf) {
      return (
        <span>
          DNF
        </span>
      );
    }
    if (res.plus2) {
      return (
        <span>
          {this.convertToTime(res.time) + '+'}
        </span>
      );
    }
    return (
      <span>
        {this.convertToTime(res.time)}
      </span>
    );
  }

  convertToTime(s) {
    if (s === 'dnf') {
      return ('DNF');
    }
    if (s === 0 || s === null) {
      return ('-');
    }
    s = Math.floor(s);
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var sec = s % 60;
    s = (s - sec) / 60;
    var min = s % 60;
    s = (s - min) / 60;

    ms = Math.floor(ms/10);

    return (
      this.displayHour(s) + this.displayMinute(s, min) +
      this.displaySecond(min, sec) + '.' + this.displayMillisecond(ms)
    );
  }

  displayScrambles(x) {
    const arr = this.props.log.slice(this.props.index, this.props.index + x);
    let j = 0;
    while (arr[j].res.dnf && j < arr.length) {
      j++;
    }
    let best = arr[j].res.time;
    let worst = arr[0].res.time;
    let worstisdnf = arr[0].res.dnf;
    for (let i = j + 1; i < x; i++) {
      if (arr[i].res.time < best && !arr[i].res.dnf) {
        best = arr[i].res.time;
      }
      if (!worstisdnf && arr[i].res.time > worst) {
        worst = arr[i].res.time;
      }
    }
    const scrambles = arr.map((item, step) => {
      let isbest = (item.res.time === best);
      let isworst = (item.res.time === worst);
      return (
        <tr>
          <td className="category-solve">
            {step + 1}
          </td>
          {(isbest || isworst) ?
            <td className="category-time">
              <span className="tableinfo">({this.displayLogEntry(item.res)})</span>
            </td>
          :
            <td className="category-time">
              <span className="tableinfo">{this.displayLogEntry(item.res)}</span>
            </td>
          }
          <td>
            <span className="tableinfo">{item.res.scramble}</span>
          </td>
        </tr>
      );
    });
    return (
      <div className="tableview">
        <table>
          <tbody>
            <tr className="tablehead">
              <th className="category-solve"></th>
              <th className="category-time"> Time </th>
              <th> Scramble </th>
            </tr>
            {scrambles}
          </tbody>
        </table>
      </div>
    );
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
          {this.convertToTime(this.props.res.ao5)}
        </button>
        {this.state.modalIsOpen ?
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            ariaHideApp={false}
            contentLabel="Example Modal"
            className="TimeModal"
            overlayClassName="TimeOverlay"
          >
            <div className="clearinfo">
              <h3 id="titletime">{this.convertToTime(this.props.res.ao5)}</h3>
              <br />
              <div className="avinfo">
                {this.displayScrambles(5)}
              </div>
              <div className="okay">
                <MuiThemeProvider theme={theme}>
                  <div className="copy">
                    <Button
                      onClick={() => this.copyTime(this.convertToTime(this.props.res.time))}
                      variant="outlined"
                      color="primary"
                      className="confirm"
                      tabIndex="1"
                    >
                      <FontAwesomeIcon icon="copy" />
                    </Button>
                  </div>
                  <div className="confirm">
                    <Button
                      onClick={this.closeModal}
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

export default Ao5Modal;
