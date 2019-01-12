import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import { AwesomeButton } from 'react-awesome-button';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    }

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleFileName = this.handleFileName.bind(this);
    this.handleSelectedFile = this.handleSelectedFile.bind(this);
    this.colorLuminance = this.colorLuminance.bind(this);

  };

  openModal() {
    this.setState({modalIsOpen: true});
    this.props.handleModal();
    document.documentElement.style.setProperty('--tabselect', 'var(--primary)');
    document.documentElement.style.setProperty('--tab', 'rgba(0, 0, 0, .3)');
  }

  afterOpenModal() {
    // document.getElementById('clearconfirm').focus();
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    this.props.handleModal();
    document.documentElement.style.setProperty('--tab', 'var(--primary)');
    document.documentElement.style.setProperty('--tabselect', 'rgba(0, 0, 0, .3)');
  }

  handleFocus(event) {
    event.target.select();
  }

  handleFileName(name) {
    this.setState({
      filename: name.target.value
    });
  }

  handleSelectedFile(event) {
    this.setState({
      selectedfile: event.target.files[0]
    });
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
      <button id="clear" onClick={this.openModal}>
        <FontAwesomeIcon icon="arrow-down" />
        <FontAwesomeIcon icon="arrow-up" />
      </button>
      <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        ariaHideApp={false}
        contentLabel="Example Modal"
        className="DownUpModal"
        overlayClassName="DownUpOverlay"
      >
        <div className="downupinfo">
          <Tabs defaultIndex={0} className="downup-tabs">
            <div className="toptab">
              <TabList>
                <Tab className='lefttab'>
                  <h1>Export</h1>
                </Tab>
                <Tab className='righttab'>
                  <h1>Import</h1>
                </Tab>
              </TabList>
            </div>
            <div className="pages">
              <TabPanel>
                <h2>Download JSON File</h2>
                <input
                  type="string"
                  value={this.state.filename}
                  onChange={this.handleFileName}
                />
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
              </TabPanel>
              <TabPanel>
                <h2>Upload JSON File</h2>
                <input
                  type="file"
                  onChange={this.handleSelectedFile}
                />
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
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </Modal>
      </div>
    );

  }
}

export default DownUpModal;
