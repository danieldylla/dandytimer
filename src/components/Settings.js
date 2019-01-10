import React, { Component } from 'react';
import Modal from 'react-modal';
import Switch from "react-switch";
import { AwesomeButton } from 'react-awesome-button';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { ChromePicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import 'react-awesome-button/dist/styles.css';
import './Settings.css';

const dark_theme = {
  primary: '#282c34',
  secondary: '#444c59',
  accent: '#3fa8ff',
  text: 'rgba(255, 255, 255, .6)',
  texthighlighted: '#fff'
};

const light_theme = {
  primary: '#d5dce2',
  secondary: '#b7c2cc',
  accent: '#3fa8ff',
  text: 'rgba(0, 0, 0, .7)',
  texthighlighted: '#000'
}

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
    }

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.handleColorLight = this.handleColorLight.bind(this);
    this.handleColorDark = this.handleColorDark.bind(this);
  };

  openModal() {
    this.setState({modalIsOpen: true});
    this.props.handleModal();
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    this.props.handleModal();
  }

  changeColor(p, s, a, t, h) {
    document.documentElement.style.setProperty('--primary', p);
    document.documentElement.style.setProperty('--secondary', s);
    document.documentElement.style.setProperty('--accent', a);
    document.documentElement.style.setProperty('--text', t);
    document.documentElement.style.setProperty('--texthighlighted', h);
  }


  handleColorLight() {
    this.props.changeColor(light_theme);
  }

  handleColorDark() {
    this.props.changeColor(dark_theme);
  }


  render() {
    return (
      <div>
        <button id="icon" onClick ={this.openModal}>
          <FontAwesomeIcon icon="cog" />
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
          className="Modal"
          overlayClassName="Overlay"
        >
          <div className="modalinfo">
            <Tabs defaultIndex={1}>
              <div className="tabs">
                <TabList>
                  <Tab disabled><b>Settings</b></Tab>
                  <Tab>Options</Tab>
                  <Tab>Colors</Tab>
                </TabList>
              </div>
              <div className="pages">
              <TabPanel>
                Settings
              </TabPanel>
              <TabPanel>
                <h2>Timer Options</h2>
                <div className="setting">
                  Inspection Time
                  <div className="switches">
                    <Switch
                      checked={this.props.inspection_time}
                      onChange={this.props.handleInspection}
                      onColor="#86d3ff"
                      onHandleColor="#2693e6"
                      handleDiameter={30}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      height={20}
                      width={48}
                      className="react-switch"
                      id="material-switch"
                    />
                  </div>
                  <div class="desc">
                    15 second inspection time after first spacebar press
                  </div>
                </div>
                <div className="setting">
                  Hold To Start
                  <div className="switches">
                    <Switch
                      checked={this.props.hold_to_start}
                      onChange={this.props.handleHoldToStart}
                      onColor="#86d3ff"
                      onHandleColor="#2693e6"
                      handleDiameter={30}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      height={20}
                      width={48}
                      className="react-switch"
                      id="material-switch"
                    />
                  </div>
                  <div class="desc">
                    spacebar must be held to start timer
                  </div>
                </div>
                <div className="setting">
                  Show Averages Under Time
                  <div className="switches">
                    <Switch
                      checked={this.props.av_under_time}
                      onChange={this.props.handleAvUnderTime}
                      onColor="#86d3ff"
                      onHandleColor="#2693e6"
                      handleDiameter={30}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      height={20}
                      width={48}
                      className="react-switch"
                      id="material-switch"
                    />
                  </div>
                  <div class="desc">
                    ao5 and ao12 are shown below time as well as on left side
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <h2>Colors and Theming</h2>
                <div className="presets">
                  Presets
                  <div className="select">
                    <AwesomeButton
                      action={this.handleColorDark}
                      type="primary"
                      className="dark-theme"
                      size="medium"
                    >
                      Dark
                    </AwesomeButton>
                    <AwesomeButton
                      action={this.handleColorLight}
                      type="primary"
                      className="dark-theme"
                      size="medium"
                    >
                      Light
                    </AwesomeButton>
                  </div>
                </div>
              </TabPanel>
              </div>
            </Tabs>
          </div>
        </Modal>
      </div>
    );

  }
}

/*
<div className="modalinfo">
  <h>Settings</h>
  <br />
  <div className="switches">
    <Switch
      checked={this.state.checked}
      onChange={this.handleCubeMode}
      onColor="#86d3ff"
      onHandleColor="#2693e6"
      handleDiameter={30}
      uncheckedIcon={false}
      checkedIcon={false}
      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
      height={20}
      width={48}
      className="react-switch"
      id="material-switch"
    />
    <span>Cube Mode</span>
  </div>
  <div className="colors">
    <ChromePicker

    />
  </div>
</div>
*/

export default Settings;
