import React, { Component } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AwesomeButton } from 'react-awesome-button';
import ReactGA from 'react-ga';
import GoogleButton from 'react-google-button'
import { ClipLoader } from 'react-spinners'
import Undo from '../Undo';

import './AccountModal.css';

class AccountModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      saved: false,
      loaded: false,
    }

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onFail = this.onFail.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.handleSaveFirebase = this.handleSaveFirebase.bind(this);
    this.handleLoadFirebase = this.handleLoadFirebase.bind(this);
    this.handleUndoSave = this.handleUndoSave.bind(this);
    this.handleUndoLoad = this.handleUndoLoad.bind(this);
  };


  openModal() {
    this.setState({ modalIsOpen: true });
    this.props.handleModal();
    ReactGA.pageview('/account');
  }

  afterOpenModal() {
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
      saved: false,
      loaded: false,
    });
    this.props.handleModal();
    ReactGA.pageview('/');
  }

  handleFocus(event) {
    event.target.select();
  }

  onFail() {
  }

  onLogout() {
    this.props.logOut();
  }

  handleSaveFirebase() {
    this.props.saveStateToFirebase();
    this.setState({ saved: true });
  }

  handleLoadFirebase() {
    this.props.loadStateFromFirebase();
    this.setState({ loaded: true });
  }

  handleUndoSave() {
    this.props.undoSaveToFirebase();
    this.setState({ saved: false });
  }

  handleUndoLoad() {
    this.props.undoLoadFromFirebase();
    this.setState({ loaded: false });
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
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          ariaHideApp={false}
          closeTimeoutMS={200}
          contentLabel="Account Modal"
          className="AccountModal"
          overlayClassName="AccountOverlay"
        >
          {this.props.isSignedIn ?
            <div className="accountinfo">
              <h1 id="title">Account</h1>
              <br />
              <div className="userinfo">
                <img src={this.props.userProfile.photoURL} alt="profile" className="profilepic"/>
                <div className="welcome">
                  Welcome, <b>{this.props.userProfile.displayName}</b>
                </div>
                <div className="accountdesc">
                  Accounts let you back up your data and access it anywhere,
                  from any device. Your results were last saved to your account on <strong>{this.props.lastsave}</strong>.
                </div>
                <div className="timestamp-act">

                </div>
              </div>
              <div className="updownbtns">
                <div className="upbtnaccount">
                  <h3 className="save-title">Save</h3>
                  <AwesomeButton
                    action={this.handleSaveFirebase}
                    type="primary"
                    className="downloadbtn"
                    id="accountbtn"
                    size="large"
                  >
                    <div id="downicon">
                      <FontAwesomeIcon icon="file-upload" />
                    </div>
                  </AwesomeButton>
                  <div className="actsave">
                    <ClipLoader
                      css={{display: "inline-block", verticalAlign: "bottom"}}
                      sizeUnit={"px"}
                      size={40}
                      color={this.props.theme.accent}
                      loading={this.props.saving}
                    />
                    {this.state.saved && !this.props.saving ?
                      <div className="undodu">
                        <Undo
                          theme={this.props.theme}
                          undo={this.handleUndoSave}
                        />
                      </div>
                      :
                      null
                    }
                  </div>
                </div>
                <div className="downbtnaccount">
                  <h3 className="load-title">Load</h3>
                  <AwesomeButton
                    action={this.handleLoadFirebase}
                    type="primary"
                    className="downloadbtn"
                    id="accountbtn"
                    size="large"
                  >
                    <div id="downicon">
                      <FontAwesomeIcon icon="file-download" />
                    </div>
                  </AwesomeButton>
                  <div className="actload">
                    <ClipLoader
                      css={{display: "inline-block", verticalAlign: "bottom"}}
                      sizeUnit={"px"}
                      size={40}
                      color={this.props.theme.accent}
                      loading={this.props.loading}
                    />
                    {this.state.loaded && !this.props.loading ?
                      <div className="undodu">
                        <Undo
                          theme={this.props.theme}
                          undo={this.handleUndoLoad}
                        />
                      </div>
                      :
                      null
                    }
                  </div>
                </div>
              </div>
              <button onClick={this.onLogout} className="logout">
                Log Out
              </button>
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
                <div className="signinbtn">
                  <GoogleButton onClick={this.props.signIn} />
                </div>
              </div>
            </div>
          }
        </Modal>
      </div>
    );

  }
}

export default AccountModal;
