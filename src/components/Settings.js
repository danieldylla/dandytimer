import React, { Component } from 'react';
import Modal from 'react-modal';
import Switch from "react-switch";
import InputNumber from 'react-input-number';
import { AwesomeButton } from 'react-awesome-button';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { ChromePicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomThemeModal from './modals/CustomThemeModal'
import ReactGA from 'react-ga';

import 'react-awesome-button/dist/styles.css';
import './Settings.css';

const gray_theme = {
  primary: '#282c34',
  secondary: '#fff',
  accent: '#3fa8ff',
  text: 'rgba(255, 255, 255, .6)',
  texthighlighted: '#fff'
};

const light_theme = {
  primary: '#d5dce2',
  secondary: '#000',
  accent: '#3fa8ff',
  text: 'rgba(0, 0, 0, .7)',
  texthighlighted: '#000'
}

const blue_theme = {
  primary: '#3da1ff',
  secondary: '#0b1c2d',
  accent: '#af114b',
  text: '#163859',
  texthighlighted: '#0b1c2d'
}

const dark_blue_theme = {
  primary: '#000b16',
  secondary: '#91c2ff',
  accent: '#af114b',
  text: '#3da1ff',
  texthighlighted: '#91c2ff'
}

const red_theme = {
  primary: '#ff4949',
  secondary: '#470e0e',
  accent: '#4f4fff',
  text: '#661616',
  texthighlighted: '#470e0e'
}

const dark_red_theme = {
  primary: '#1c0000',
  secondary: '#ff6363',
  accent: '#4f4fff',
  text: '#ff4949',
  texthighlighted: '#ff6363'
}

const dark_theme = {
  primary: '#1a1c21',
  secondary: '#efefef',
  accent: '#9621ff',
  text: 'rgba(255, 255, 255, .6)',
  texthighlighted: '#efefef'
}

let pickerStyles = {
  default: {
    picker: { // See the individual picker source for which keys to use
      boxShadow: 'none',
      width: window.innerWidth > 1080 ? '410px' : '290px',
      fontFamily: 'inherit',
    },
  },
}

class Settings extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.modalIsOpen !== nextState.modalIsOpen ||
      this.state.selected !== nextState.selected ||
      this.props !== nextProps ||
      this.state !== nextState
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      primary: '#282c34',
      secondary: '#444c59',
      accent: '#3fa8ff',
      text: 'rgba(255, 255, 255, .6)',
      texthighlighted: '#fff',
      modalIsOpen: false,
      selected: 'primary',
    }

    this.colorLuminance = this.colorLuminance.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleColor = this.handleColor.bind(this);
    this.handleChangePrimary = this.handleChangePrimary.bind(this);
    this.handleChangeSecondary = this.handleChangeSecondary.bind(this);
    this.handleChangeAccent = this.handleChangeAccent.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleChangeTextHighlighted = this.handleChangeTextHighlighted.bind(this);
    this.selectPrimary = this.selectPrimary.bind(this);
    this.selectSecondary = this.selectSecondary.bind(this);
    this.selectAccent = this.selectAccent.bind(this);
    this.selectText = this.selectText.bind(this);
    this.selectTextHighlighted = this.selectTextHighlighted.bind(this);
    this.displaySavedThemes = this.displaySavedThemes.bind(this);
  };

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

  openModal() {
    this.setState({
      primary: this.props.theme.primary,
      secondary: this.props.theme.secondary,
      accent: this.props.theme.accent,
      text: this.props.theme.text,
      texthighlighted: this.props.theme.texthighlighted,
      modalIsOpen: true
    });
    this.props.handleModal();
    ReactGA.pageview('/settings');
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    this.props.handleModal();
    ReactGA.pageview('/');
  }

  handleColor(theme) {
    this.props.changeColor(theme);
    this.setState({
      primary: theme.primary,
      secondary: theme.secondary,
      accent: theme.accent,
      text: theme.text,
      texthighlighted: theme.texthighlighted
    });
  }

  handleChangePrimary(color, event) {
    const theme = {
      primary: color.hex,
      secondary: this.state.secondary,
      accent: this.state.accent,
      text: this.state.text,
      texthighlighted: this.state.texthighlighted,
    };
    this.handleColor(theme);
  }

  handleChangeSecondary(color, event) {
    const theme = {
      primary: this.state.primary,
      secondary: color.hex,
      accent: this.state.accent,
      text: this.state.text,
      texthighlighted: this.state.texthighlighted,
    };
    this.handleColor(theme);
  }

  handleChangeAccent(color, event) {
    const theme = {
      primary: this.state.primary,
      secondary: this.state.secondary,
      accent: color.hex,
      text: this.state.text,
      texthighlighted: this.state.texthighlighted,
    };
    this.handleColor(theme);
  }

  handleChangeText(color, event) {
    const theme = {
      primary: this.state.primary,
      secondary: this.state.secondary,
      accent: this.state.accent,
      text: color.hex,
      texthighlighted: this.state.texthighlighted,
    };
    this.handleColor(theme);
  }

  handleChangeTextHighlighted(color, event) {
    const theme = {
      primary: this.state.primary,
      secondary: this.state.secondary,
      accent: this.state.accent,
      text: this.state.text,
      texthighlighted: color.hex,
    };
    this.handleColor(theme);
  }

  selectPrimary() {
    this.setState({
      selected: 'primary'
    });
  }

  selectSecondary() {
    this.setState({
      selected: 'secondary'
    });
  }

  selectAccent() {
    this.setState({
      selected: 'accent'
    });
  }

  selectText() {
    this.setState({
      selected: 'text'
    });
  }

  selectTextHighlighted() {
    this.setState({
      selected: 'texthighlighted'
    });
  }

  displayColorPicker() {
    if (this.state.selected === 'primary') {
      return (
        <ChromePicker
          color={this.state.primary}
          onChangeComplete={this.handleChangePrimary}
          disableAlpha
          styles={pickerStyles}
        />
      );
    } else if (this.state.selected === 'secondary') {
      return (
        <ChromePicker
          color={this.state.secondary}
          onChangeComplete={this.handleChangeSecondary}
          disableAlpha
          styles={pickerStyles}
        />
      );
    } else if (this.state.selected === 'accent') {
      return (
        <ChromePicker
          color={this.state.accent}
          onChangeComplete={this.handleChangeAccent}
          disableAlpha
          styles={pickerStyles}
        />
      );
    } else if (this.state.selected === 'text') {
      return (
        <ChromePicker
          color={this.state.text}
          onChangeComplete={this.handleChangeText}
          disableAlpha
          styles={pickerStyles}
        />
      );
    } else {
      return (
        <ChromePicker
          color={this.state.texthighlighted}
          onChangeComplete={this.handleChangeTextHighlighted}
          disableAlpha
          styles={pickerStyles}
        />
      );
    }
  }

  renderCustomTheme(i, theme) {
    return (
      <div>
        <button
          className="deletetheme"
          onClick={() => this.props.deleteTheme(i)}
          style={{
            color: theme.theme.secondary,
          }}
        >
          <FontAwesomeIcon icon="times" />
        </button>
        <button
          onClick={() => this.handleColor(theme.theme)}
          className="themebtn"
          id={theme.name}
          style={{
            backgroundColor: theme.theme.primary,
            color: theme.theme.secondary,
            borderColor: theme.theme.accent,
            borderStyle: 'none',
            borderWidth: '1px'
          }}
        >
          {theme.name}
        </button>
      </div>
    );
  }

  displaySavedThemes() {
    let themes = this.props.themes;
    let custom = themes.map((theme, step) => {
      return (
        <div className="listitem" key={step}>
          {this.renderCustomTheme(step, theme)}
        </div>
      )
    });

    return (
      <div className="btnlist">
        <div className="unstyledlist">
          {custom}
        </div>
      </div>
    );
  }


  render() {
    pickerStyles = {
      default: {
        picker: { // See the individual picker source for which keys to use
          boxShadow: 'none',
          width: window.innerWidth > 1080 ? '410px' : '290px',
          fontFamily: 'inherit',
        },
      },
    }
    return (
      <div>
        <button id="icon" onClick ={this.openModal}>
          <FontAwesomeIcon icon="cog" />
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          ariaHideApp={false}
          contentLabel="Example Modal"
          className="Modal"
          overlayClassName="Overlay"
          id="settingsmodal"
        >
          <div className="setmodalinfo">
            <Tabs defaultIndex={1}>
              <div className="tabs">
                <TabList>
                  <Tab disabled className="settingstitle"><b>Settings</b></Tab>
                  <Tab>Colors</Tab>
                  <Tab>Timer</Tab>
                  <Tab>Display</Tab>
                </TabList>
              </div>
              <div className="pages">
                <TabPanel>
                  Settings
                </TabPanel>
                <TabPanel>
                  <h2>Colors and Theming</h2>
                  <div className="colorscontent">
                    <div className="presets">
                      Presets
                      <div className="select">
                        <AwesomeButton
                          action={() => this.handleColor(dark_theme)}
                          type="primary"
                          className="dark-theme"
                          size="medium"
                        >
                          Dark
                        </AwesomeButton>
                        <AwesomeButton
                          action={() => this.handleColor(light_theme)}
                          type="primary"
                          className="light-theme"
                          size="medium"
                        >
                          Light
                        </AwesomeButton>
                        <AwesomeButton
                          action={() => this.handleColor(gray_theme)}
                          type="primary"
                          className="gray-theme"
                          size="medium"
                        >
                          Gray
                        </AwesomeButton>
                        <AwesomeButton
                          action={() => this.handleColor(blue_theme)}
                          type="primary"
                          className="blue-theme"
                          size="medium"
                        >
                          Blue
                        </AwesomeButton>
                        <AwesomeButton
                          action={() => this.handleColor(red_theme)}
                          type="primary"
                          className="red-theme"
                          size="medium"
                        >
                          Red
                        </AwesomeButton>
                        <AwesomeButton
                          action={() => this.handleColor(dark_blue_theme)}
                          type="primary"
                          className="dark-blue-theme"
                          size="medium"
                        >
                          Dark Blue
                        </AwesomeButton>
                        <AwesomeButton
                          action={() => this.handleColor(dark_red_theme)}
                          type="primary"
                          className="dark-red-theme"
                          size="medium"
                        >
                          Dark Red
                        </AwesomeButton>
                      </div>
                    </div>
                    <div className="custom">
                      Custom Theme
                      <div className="theme">
                        <div className="createtheme">
                          <div className="colorbuttons">
                            <div className="choosecolor">
                              <AwesomeButton
                                action={this.selectPrimary}
                                type="primary"
                                className="primary"
                                size="large"
                              >
                                Background
                              </AwesomeButton>
                            </div>
                            <div className="choosecolor">
                              <AwesomeButton
                                action={this.selectSecondary}
                                type="primary"
                                className="secondary"
                                size="large"
                              >
                                Time
                              </AwesomeButton>
                            </div>
                            <div className="choosecolor">
                              <AwesomeButton
                                action={this.selectAccent}
                                type="primary"
                                className="accent"
                                size="large"
                              >
                                Accent
                              </AwesomeButton>
                            </div>
                            <div className="choosecolor">
                              <AwesomeButton
                                action={this.selectText}
                                type="primary"
                                className="text"
                                size="large"
                              >
                                Text
                              </AwesomeButton>
                              <AwesomeButton
                                action={this.selectTextHighlighted}
                                type="primary"
                                className="texthighlighted"
                                size="large"
                              >
                                Emphasized Text
                              </AwesomeButton>
                            </div>
                            <div className="choosecolor">
                              <CustomThemeModal
                                theme={this.props.theme}
                                saveTheme={(name, theme) => this.props.saveTheme(name, theme)}
                              />
                            </div>
                          </div>
                          <div className="colors">
                            {this.displayColorPicker()}
                          </div>
                        </div>
                      </div>
                      <div className="saved">
                        Saved
                        {this.displaySavedThemes()}
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <h2>Timer Options</h2>
                  <div className="setlist">
                    <div className="setting" id="setting">
                      Inspection Time
                      <div className="switches">
                        <Switch
                          checked={this.props.inspection_time}
                          onChange={this.props.handleInspection}
                          onColor={this.colorLuminance(this.state.accent, -.4)}
                          onHandleColor={this.state.accent}
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
                      <div className="desc">
                        15 second inspection time after first spacebar press
                      </div>
                    </div>
                    <div className="setting">
                      Hold To Start
                      <div className="switches">
                        <Switch
                          checked={this.props.hold_to_start}
                          onChange={this.props.handleHoldToStart}
                          onColor={this.colorLuminance(this.state.accent, -.4)}
                          onHandleColor={this.state.accent}
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
                      <div className="desc">
                        spacebar must be held to start timer
                      </div>
                    </div>
                    <div className="setting" id="setting">
                      Hold To Start Length
                      <div className="switches">
                        <FontAwesomeIcon icon="caret-left" id="changen"
                          onClick={() => this.props.handleHoldLen(this.props.hold_len - .1)}
                        />
                        <InputNumber
                          className="setinput"
                          onFocus={this.handleFocus}
                          min={.5}
                          max={3}
                          step={1}
                          value={this.props.hold_len}
                          onChange={value => this.props.handleHoldLen(value)}
                        />
                        <FontAwesomeIcon icon="caret-right" id="changen"
                          onClick={() => this.props.handleHoldLen(this.props.hold_len + .1)}
                        />
                      </div>
                      <div className="desc">
                        if enabled, this is how many seconds you must hold to start the timer
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <h2>Display Options</h2>
                  <div className="setlist">
                    <div className="setting">
                      Party Mode
                      <div className="switches">
                        <Switch
                          checked={this.props.party_mode}
                          onChange={this.props.partyMode}
                          onColor={this.colorLuminance(this.state.accent, -.4)}
                          onHandleColor={this.state.accent}
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
                      <div className="desc">
                        really mess with your eyes
                      </div>
                    </div>
                    <div className="setting">
                      Show Time List
                      <div className="switches">
                        <Switch
                          checked={this.props.show_log}
                          onChange={this.props.handleShowLog}
                          onColor={this.colorLuminance(this.state.accent, -.4)}
                          onHandleColor={this.state.accent}
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
                      <div className="desc">
                        list of times, as well as current and best times, is shown on left side
                      </div>
                    </div>
                    <div className="setting">
                      Show Averages Under Time
                      <div className="switches">
                        <Switch
                          checked={this.props.show_av}
                          onChange={this.props.handleShowAv}
                          onColor={this.colorLuminance(this.state.accent, -.4)}
                          onHandleColor={this.state.accent}
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
                      <div className="desc">
                        ao5 and ao12 are shown below time as well as on left side
                      </div>
                    </div>
                    <div className="setting">
                      Show Scramble
                      <div className="switches">
                        <Switch
                          checked={this.props.show_scramble}
                          onChange={this.props.handleShowScramble}
                          onColor={this.colorLuminance(this.state.accent, -.4)}
                          onHandleColor={this.state.accent}
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
                      <div className="desc">
                        scramble is generated for each solve and displayed on screen
                      </div>
                    </div>
                    <div className="setting">
                      Highlight on Hover
                      <div className="switches">
                        <Switch
                          checked={this.props.highlight_text}
                          onChange={this.props.handleHighlightText}
                          onColor={this.colorLuminance(this.state.accent, -.4)}
                          onHandleColor={this.state.accent}
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
                      <div className="desc">
                        elements brighten when hovered over
                      </div>
                    </div>
                    <div className="setting" id="setting">
                      Timer Size
                      <div className="switches">
                        <FontAwesomeIcon icon="caret-left" id="changen"
                          onClick={() => this.props.handleTimerSize(this.props.timer_size - 1)}
                        />
                        <InputNumber
                          className="setinput"
                          onFocus={this.handleFocus}
                          min={8}
                          max={300}
                          step={1}
                          value={this.props.timer_size}
                          onChange={value => this.props.handleTimerSize(value)}
                        />
                        <FontAwesomeIcon icon="caret-right" id="changen"
                          onClick={() => this.props.handleTimerSize(this.props.timer_size + 1)}
                        />
                      </div>
                      <div className="desc">
                        change the size of the timer
                      </div>
                    </div>
                    <div className="setting" id="setting">
                      Scramble Size
                      <div className="switches">
                        <FontAwesomeIcon icon="caret-left" id="changen"
                          onClick={() => this.props.handleScrambleSize(this.props.scramble_size - 1)}
                        />
                        <InputNumber
                          className="setinput"
                          onFocus={this.handleFocus}
                          min={8}
                          max={64}
                          step={1}
                          value={this.props.scramble_size}
                          onChange={value => this.props.handleScrambleSize(value)}
                        />
                        <FontAwesomeIcon icon="caret-right" id="changen"
                          onClick={() => this.props.handleScrambleSize(this.props.scramble_size + 1)}
                        />
                      </div>
                      <div className="desc">
                        change the size of the scramble
                      </div>
                    </div>
                    <div className="setting" id="setting">
                      Average Size
                      <div className="switches">
                        <FontAwesomeIcon icon="caret-left" id="changen"
                          onClick={() => this.props.handleAvSize(this.props.av_size - 1)}
                        />
                        <InputNumber
                          className="setinput"
                          onFocus={this.handleFocus}
                          min={8}
                          max={40}
                          step={1}
                          value={this.props.av_size}
                          onChange={value => this.props.handleAvSize(value)}
                        />
                        <FontAwesomeIcon icon="caret-right" id="changen"
                          onClick={() => this.props.handleAvSize(this.props.av_size + 1)}
                        />
                      </div>
                      <div className="desc">
                        change the size of the averages below the timer
                      </div>
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

export default Settings;
