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

    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.convertToTime = this.convertToTime.bind(this);
  };

  afterOpenModal() {
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

  displaySessions() {
    let sess = this.props.sessions.slice();
    let sessions = sess.map((session, step) => {
      return (
        <li className="sessionbtn" key={step}>
          <button className="choosesess" onClick={() => this.props.changeSession(step)}>
            <h3 className="sessionname">{session.name}</h3>
            <div className="half">Solves: {session.reps}</div>
            <div className="half">Average: {this.convertToTime(session.average)}</div>
          </button>
        </li>
      )
    });

    return (
      <ul className="sesslist">
        {sessions}
      </ul>
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
        <Modal
          isOpen={this.props.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.props.closeModal}
          ariaHideApp={false}
          contentLabel="Example Modal"
          className="SessionModal"
          overlayClassName="SessionOverlay"
        >
          <div className="sessinfo">
            <h1 id="titlesess">Sessions</h1>
            <br />
            <div className="sessions">
              {this.displaySessions()}
            </div>
            <div className="addsess">
              <button className="newsess" onClick={this.props.newSession}>
                <FontAwesomeIcon icon="plus" />
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );

  }
}

export default SessionModal;
