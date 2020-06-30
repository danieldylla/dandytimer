import React, { Component } from 'react';
import Modal from 'react-modal';
import ReactGA from 'react-ga';
import { AwesomeButton } from 'react-awesome-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ClipLoader } from 'react-spinners'
import Undo from '../Undo';

import 'react-awesome-button/dist/styles.css';
import './DownUpModal.css';

class DownUpModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      tab: 'left',
      filename: "dandytimer_results",
      selectedfile: null,
      upfilename: "no file chosen",
      saved: false,
      loaded: false,
      restored: false,
    }

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleFileName = this.handleFileName.bind(this);
    this.handleSelectedFile = this.handleSelectedFile.bind(this);
    this.colorLuminance = this.colorLuminance.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.generageName = this.generateName.bind(this);
    this.handleSaveFirebase = this.handleSaveFirebase.bind(this);
    this.handleLoadFirebase = this.handleLoadFirebase.bind(this);
    this.handleRestoreFirebase = this.handleRestoreFirebase.bind(this);
    this.handleUndoSave = this.handleUndoSave.bind(this);
    this.handleUndoLoad = this.handleUndoLoad.bind(this);
    this.handleUndoRestore = this.handleUndoRestore.bind(this);

    this.inputRef = React.createRef();
  };

  openModal() {
    this.setState({modalIsOpen: true});
    this.props.handleModal();
    this.generateName();
    ReactGA.pageview('/downup');
  }

  afterOpenModal() {
    // document.getElementById('clearconfirm').focus();
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
      saved: false,
      loaded: false,
      restored: false,
    });
    this.props.handleModal();
    ReactGA.pageview('/');
  }

  handleFocus(event) {
    event.target.select();
  }

  handleFileName(name) {
    this.setState({
      filename: name.target.value
    });
  }

  generateName() {
    let d = new Date();
    let name = "dandyresults-" + (d.getMonth() + 1) + '-' + d.getDate() + '-' +
      d.getFullYear() + '-' + d.getHours() + d.getMinutes();
    this.setState({
      filename: name
    });
  }

  handleSelectedFile(event) {
    if(event.target.files[0].name) {
      this.setState({
        upfilename: event.target.files[0].name
      });
    }
      this.setState({
        selectedfile: event.target.files[0]
      });
  }

  handleClick() {
    if(this.inputRef && this.inputRef.current) {
      this.inputRef.current.click();
    }
  }

  handleSaveFirebase() {
    this.props.saveStateToFirebase();
    this.setState({ saved: true });
  }

  handleLoadFirebase() {
    this.props.loadStateFromFirebase();
    this.setState({ loaded: true });
  }

  handleRestoreFirebase() {
    this.props.restoreFirebaseBackup();
    this.setState({ restored: true });
  }

  handleUndoSave() {
    this.props.undoSaveToFirebase();
    this.setState({ saved: false });
  }

  handleUndoLoad() {
    this.props.undoLoadFromFirebase();
    this.setState({ loaded: false });
  }

  handleUndoRestore() {
    this.props.undoLoadFromFirebase();
    this.setState({ restored: false });
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
      <button id="logstatbtn" onClick={this.openModal}>
        <FontAwesomeIcon icon="arrow-down" />
        <FontAwesomeIcon icon="arrow-up" />
      </button>
      <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        ariaHideApp={false}
        closeTimeoutMS={200}
        contentLabel="Example Modal"
        className="DownUpModal"
        overlayClassName="DownUpOverlay"
      >
        <h1 className="lefttitle">
          Export
        </h1>
        <h1 className="righttitle">
          Import
        </h1>
        <div className="downupinfo">
          <div className="leftdu">
            <div className="transfer">
              <h2 id="h2du">Download JSON File</h2>
              <div className="signinmsg">
                <div className="transferinfo">
                  <input
                    className="downinput"
                    type="string"
                    value={this.state.filename}
                    onChange={this.handleFileName}
                  />
                </div>
                <div className="transferbtn">
                  <AwesomeButton
                    action={() => this.props.downloadFile(this.state.filename, "application/json")}
                    type="primary"
                    className="downloadbtn"
                    id="downloadbtn"
                    size="small"
                  >
                    <div id="downicon">
                      <FontAwesomeIcon icon="download" />
                    </div>
                  </AwesomeButton>
                </div>
              </div>
            </div>
            <div className="transfer">
              <h2 id="h2du">Save To Your Account</h2>
              {this.props.isSignedIn ?
                <div className="signinmsg">
                  <div className="transferinfo">
                    <div className="timestamp">
                      {this.props.lastsave && `saved on ${this.props.lastsave}`}
                    </div>
                  </div>
                  <div className="transferbtn">
                    <AwesomeButton
                      action={this.handleSaveFirebase}
                      type="primary"
                      className="firebasebtn"
                      id="firebasebtn"
                      size="small"
                    >
                      <div id="downicon">
                        <FontAwesomeIcon icon="file-upload" />
                      </div>
                    </AwesomeButton>
                    <ClipLoader
                      css={{display: "inline-block", float: "left", margin: "10px 10px"}}
                      sizeUnit={"px"}
                      size={35}
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
                :
                <div className="signinmsg">
                  Sign in to save to your account
                </div>
              }
            </div>
          </div>
          <div className="rightdu">
            <div className="transfer">
              <h2 id="h2du">Upload JSON File</h2>
              <div className="signinmsg">
                <div style={{height:"0px", overflow:"hidden"}}>
                  <input
                    type="file"
                    ref={this.inputRef}
                    onChange={this.handleSelectedFile}
                  />
                </div>
                <div className="transferinfo">
                  <button className="upinput" onClick={this.handleClick}>
                    {this.state.upfilename}
                  </button>
                </div>
                <div className="transferbtn">
                  <AwesomeButton
                    action={() => this.props.uploadFile(this.state.selectedfile)}
                    type="primary"
                    className="downloadbtn"
                    id="downloadbtn"
                    size="small"
                  >
                    <div id="downicon">
                      <FontAwesomeIcon icon="upload" />
                    </div>
                  </AwesomeButton>
                </div>
              </div>
            </div>
            <div className="transfer">
              <h2 id="h2du">Load From Your Account</h2>
              {this.props.isSignedIn ?
                <div className="signinmsg">
                  <div className="transferinfo">
                    <div className="timestamp">
                    { this.props.lastsave && `saved on ${this.props.lastsave}`}
                    </div>
                  </div>
                  <div className="transferbtn">
                    <AwesomeButton
                      action={this.handleLoadFirebase}
                      type="primary"
                      className="firebasebtn"
                      id="firebasebtn"
                      size="small"
                    >
                      <div id="downicon">
                        <FontAwesomeIcon icon="file-download" />
                      </div>
                    </AwesomeButton>
                    <ClipLoader
                      css={{display: "inline-block", float: "left", margin: "10px 10px"}}
                      sizeUnit={"px"}
                      size={35}
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
                :
                <div className="signinmsg">
                  Sign in to load from your account
                </div>
              }
            </div>
            {this.props.isSignedIn && this.props.backupsave ?
              <div className="transfer">
                <h2 id="h2du">...Or Restore From Backup</h2>
                <div className="signinmsg">
                  <div className="transferinfo">
                    <div className="timestamp">
                      {this.props.backupsave && `saved on ${this.props.backupsave}`}
                    </div>
                  </div>
                  <div className="transferbtn">
                    <AwesomeButton
                      action={this.handleRestoreFirebase}
                      type="primary"
                      className="firebasebtn"
                      id="firebasebtn"
                      size="small"
                    >
                      <div id="downicon">
                        <FontAwesomeIcon icon="file-download" />
                      </div>
                    </AwesomeButton>
                    <ClipLoader
                      css={{display: "inline-block", float: "left", margin: "10px 10px"}}
                      sizeUnit={"px"}
                      size={35}
                      color={this.props.theme.accent}
                      loading={this.props.restoring}
                    />
                    {this.state.restored && !this.props.restoring ?
                      <div className="undodu">
                        <Undo
                          theme={this.props.theme}
                          undo={this.handleUndoRestore}
                        />
                      </div>
                      :
                      null
                    }
                  </div>
                </div>
              </div>
              :
              null
            }
          </div>
        </div>
      </Modal>
      </div>
    );

  }
}

export default DownUpModal;
