import React, { Component } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactGA from 'react-ga';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

import './AccountModal.css';

class AccountModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
    }

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.onFail = this.onFail.bind(this);
    this.onLogout = this.onLogout.bind(this);
  };

  openModal() {
    this.setState({ modalIsOpen: true });
    this.props.handleModal();
    ReactGA.pageview('/account');
  }

  afterOpenModal() {
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
    this.props.handleModal();
    ReactGA.pageview('/');
  }

  handleFocus(event) {
    event.target.select();
  }

  onSignIn = (response) => {
    this.props.signIn(response);
  }

  onFail() {
  }

  onLogout() {
    this.props.logOut();
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


    return (
      <div className="modal">
        <button id="accountbtn" onClick ={this.openModal}>
          <FontAwesomeIcon icon="user-circle" />
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
            {this.props.googleuser ?
              <div className="averageinfo">
                <h1 id="title">Account</h1>
                <br />
                <div className="userinfo">

                </div>
                <div className="logout">
                  <button onClick={this.onLogout}>
                    LOG out
                  </button>
                </div>
              </div>
            :
              <div className="accountinfo">
                <h1 id="title">Sign In</h1>
                <br />
                <div className="signininfo">
                  <p>
                    Sign in with Google to save your results online and
                    access them from any device.
                  </p>
                  <br /><br /><br />
                  <div>
                    <GoogleLogin
                      clientId="761979688892-21thqlhcbremkbdu8ivsirucs3pceoqo.apps.googleusercontent.com"
                      buttonText="SIGN IN"
                      onSuccess={this.onSignIn}
                      onFailure={this.onFail}
                      className="signinbtn"
                    />
                  </div>
                </div>
              </div>
            }
          </Modal>
        : null}
      </div>
    );

  }
}

export default AccountModal;
