import React, { Component } from 'react';
import Log from './Log'
import Settings from './Settings'
import './Timer.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {faUpload} from '@fortawesome/free-solid-svg-icons';

library.add(faCog);
library.add(faTimes);
library.add(faPlus);
library.add(faArrowDown);
library.add(faArrowUp);
library.add(faDownload);
library.add(faUpload);

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stopped: true,
      running: false,
      modal: false,
      hours: 0,
      minutes: 0,
      seconds: 0,
      mil: 0,
      start: null,
      end: null,
      res: {
        id: 0,
        time: null,
        ao5: null,
        ao12: null,
        scramble: null
      },
      best: {
        res: null,
        ao5: null,
        ao12: null
      },
      log: [],
      sessions: [{
        id: 0,
        name: 1,
        log: [],
        best: null,
        reps: 0,
        average: null
      }],
      session: 0,
      reps: 0,
      average: 0,
      scramble_on_side: false,
      av_under_time: true,
      inspection_time: false,
      hold_to_start: false,
      theme: {
        primary: '#282c34',
        secondary: '#fff',
        accent: '#3fa8ff',
        text: 'rgba(255, 255, 255, .6)',
        texthighlighted: '#fff',
      },
      themes: [],
    };

    this.display = this.display.bind(this);
    this.resetTime = this.resetTime.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.updateBests = this.updateBests.bind(this);
    this.startTime = this.startTime.bind(this);
    this.endTime = this.endTime.bind(this);
    this.calculateTime = this.calculateTime.bind(this);
    this.saveTime = this.saveTime.bind(this);
    this.addTime = this.addTime.bind(this);
    this.calculateAverage = this.calculateAverage.bind(this);
    this.calculateAv = this.calculateAv.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.readFileToState = this.readFileToState.bind(this);
    this.generateScramble = this.generateScramble.bind(this);
    this.saveSession = this.saveSession.bind(this);
    this.loadSession = this.loadSession.bind(this);
    this.newSession = this.newSession.bind(this);
    this.changeSession = this.changeSession.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.handleInspection = this.handleInspection.bind(this);
    this.handleHoldToStart = this.handleHoldToStart.bind(this);
    this.handleAvUnderTime = this.handleAvUnderTime.bind(this);
    this.saveTheme = this.saveTheme.bind(this);
    this.colorLuminance = this.colorLuminance.bind(this);
    this.changeColor = this.changeColor.bind(this);

    setInterval(this.updateTime, 10);
  }

  componentDidMount() {
    this.hydrateStateWithLocalStorage();
    // add event listener to save state to localStorage
    // when user leaves/refreshes the page
    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
    this.generateScramble();

    let lasttheme = localStorage.getItem('theme');
    if(lasttheme) {
      lasttheme = JSON.parse(lasttheme);
      this.changeColor(lasttheme);
    }
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this),
      this.saveSession.bind(this)
    );
    // saves if component has a chance to unmount
    this.saveSession();
    this.saveStateToLocalStorage();
    console.log('here');
  }

  hydrateStateWithLocalStorage() {
    // for all items in state
    for (let key in this.state) {
      // if the key exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = localStorage.getItem(key);
        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          // handle empty string
          this.setState({ [key]: value });
        }
      }
    }
  }

  saveStateToLocalStorage() {
    // for every item in React state
    for (let key in this.state) {
     // save to localStorage
     localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  readFileToState(text) {
    let data = JSON.parse(text);
    for (let key in this.state) {
      if (data.hasOwnProperty(key)) {
        let value = data[key];
        this.setState({ [key]: value });
      }
    }
  }

  downloadFile(fileName, contentType) {
    let content = JSON.stringify(this.state);
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  uploadFile(file, callback) {
    var reader = new FileReader();
    reader.onload = function(event) {
      // The file's text will be printed here
      callback(event.target.result);
    };
    reader.readAsText(file);
    /*
    console.log(text);
    let data = JSON.parse(text);
    for (let key in this.state) {
      if (data.hasOwnProperty(key)) {
        let value = data.getItem(key);
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          this.setState({ [key]: value });
        }
      }
    }*/
    /*var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    console.log(rawFile);
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        callback(rawFile.responseText);
      }
    }
    rawFile.send(null);*/
  }

  newSession() {
    this.saveSession();
    this.setState({
      sessions: this.state.sessions.concat([
        {
          id: this.state.sessions.length,
          name: this.state.sessions.length + 1,
          best: null,
          log: [],
          average: null,
          reps: 0
        }
      ]),
      session: this.state.session + 1
    });
  }

  saveSession() {
    let curr = this.state.sessions.slice();
    let currlog = this.state.log.slice();
    console.log(curr);
    curr[this.state.session].log = currlog;
    curr[this.state.session].best = this.state.best;
    curr[this.state.session].reps = this.state.reps;
    curr[this.state.session].average = this.state.average;
    this.setState({
      sessions: curr
    });
  }

  loadSession() {
    this.setState({
      log: this.state.sessions[this.state.session].log,
      best: this.state.sessions[this.state.session].best,
      reps: this.state.sessions[this.state.session].reps,
      average: this.state.sessions[this.state.session].average
    });
  }

  changeSession(i) {
    this.saveSession();
    this.setState({
      session: i,
    });
    this.loadSession();
  }

  resetTime() {
    this.setState({
      hours: 0,
      minutes: 0,
      seconds: 0,
      mil: 0,
      start: null,
      end: null,
    });
  }

  updateTime() {
    if (this.state.running) {
      if (this.state.mil < 99) {
        this.setState({
          mil: this.state.mil + 1
        });
      } else if (this.state.mil === 99 && this.state.seconds < 59) {
        this.setState({
          seconds: this.state.seconds + 1,
          mil: 0
        });
      } else if (this.state.seconds === 59 && this.state.minutes < 59) {
        this.setState({
          minutes: this.state.minutes + 1,
          seconds: 0,
          mil: 0,
        });
      } else {
        this.setState({
          hours: this.state.hours + 1,
          minutes: 0,
          seconds: 0,
          mil: 0
        });
      }
    }
  }

  startTime() {
    let d = new Date();
    const time = d.getTime();
    this.setState({
      start: time,
      running: true
    });
  }

  endTime() {
    let d = new Date();
    const time = d.getTime();
    this.setState({
      end: time,
      running: false,
      reps: this.state.reps + 1
    });
  }

  calculateTime() {
    let t = this.state.end - this.state.start;
    let s = t;
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var sec = s % 60;
    s = (s - sec) / 60;
    var min = s % 60;
    s = (s - min) / 60;

    this.setState({
      res: {
        scramble: this.state.res.scramble,
        time: t,
        id: this.state.reps,
        ao5: this.calculateAv(5, t, this.state.reps),
        ao12: this.calculateAv(12, t, this.state.reps)
      },
      average: this.calculateAverage(t, this.state.reps),
      hours: s,
      minutes: min,
      seconds: sec,
      mil: Math.floor(ms/10),
    });
  }

  calculateAverage(t, reps) {
    if (reps === 1) {
      return (t);
    }
    return ((((this.state.average) * (reps - 1)) + t) / reps);
  }

  calculateAv(howmany, t, reps) {
    if (reps < howmany) {
      return null;
    }
    const history = this.state.log.slice(0, howmany);
    const list = history.map((item, step) => {
      return (
        item.res.time
      )
    });
    let best = t;
    let worst = t;
    let i = 0;
    let sum = t;
    for (i = 0; i < howmany - 1; i++) {
      if (list[i] < best) {
        best = list[i];
      }
      if (list[i] > worst) {
        worst = list[i];
      }
      sum = sum + list[i];
    }
    let av = ((sum - best - worst) / (howmany - 2));
    return(av);
  }

  forceCalculateAv(howmany, arr, id) {
    if (id > arr.length - howmany) {
      return null;
    }
    const history = arr.slice(id, id + howmany);
    const list = history.map((item, step) => {
      return (item.res.time)
    });
    let best = list[0];
    let worst = list[0];
    let i = 0;
    let sum = list[0];
    for (i = 1; i < howmany; i++) {
      if (list[i] < best) {
        best = list[i];
      }
      if (list[i] > worst) {
        worst = list[i];
      }
      sum = sum + list[i];
    }
    let av = ((sum - best - worst) / (howmany - 2));
    return av;
  }

  updateBests() {
    if (this.state.best.res === null
        || this.state.res.time < this.state.best.res.time) {
      this.setState({
        best: {
          res: this.state.res,
          ao5: this.state.best.ao5,
          ao12: this.state.best.ao12
        }
      });
    }
    if ((this.state.best.ao5 === null && this.state.res.ao5 !== null)
        || this.state.res.ao5 < this.state.best.ao5) {
          this.setState({
            best: {
              res: this.state.best.res,
              ao5: this.state.res.ao5,
              ao12: this.state.best.ao12
            }
          });
    }
    if ((this.state.best.ao12 === null && this.state.res.ao12 !== null)
        || this.state.res.ao12 < this.state.best.ao12) {
          this.setState({
            best: {
              res: this.state.best.res,
              ao5: this.state.best.ao5,
              ao12: this.state.res.ao12
            }
          });
    }
  }

  saveTime() {
    this.setState({
      log: [{res: this.state.res}].concat(this.state.log)
    });
  }

  addTime(t) {
    const time = t*1000;
    const reps = this.state.reps + 1;
    const ao5 = this.calculateAv(5, time, reps);
    const ao12 = this.calculateAv(12, time, reps);
    const average = this.calculateAverage(time, reps);
    if (this.state.best.res === null
        || time < this.state.best.res.time) {
      this.setState({
        best: {
          res: {
            time: time,
            id: reps,
            ao5: ao5,
            ao12: ao12,
            scramble: this.state.res.scramble,
          },
          ao5: this.state.best.ao5,
          ao12: this.state.best.ao12
        }
      });
    }
    if ((this.state.best.ao5 === null && this.state.res.ao5 !== null)
        || ao5 < this.state.best.ao5) {
          this.setState({
            best: {
              res: this.state.best.res,
              ao5: ao5,
              ao12: this.state.best.ao12
            }
          });
    }
    if ((this.state.best.ao12 === null && this.state.res.ao12 !== null)
        || ao12 < this.state.best.ao12) {
          this.setState({
            best: {
              res: this.state.best.res,
              ao5: ao5,
              ao12: this.state.res.ao12
            }
          });
    }
    this.setState({
      log: [
        {
          res: {
            time: time,
            id: reps,
            ao5: ao5,
            ao12: ao12,
            scramble: this.state.res.scramble,
          }
        }
      ].concat(this.state.log),
      reps: reps,
      average: average,
      res: {
        time: time,
        id: reps,
        ao5: ao5,
        ao12: ao12,
        scramble: this.state.res.scramble,
      },
    });
  }

  clearAll() {
    this.setState({
      log: [],
      reps: 0,
      average: 0,
      best: {
        res: null,
        ao5: null,
        ao12: null
      },
      res: {
        scramble: this.state.res.scramble,
        time: null,
        id: 0,
        ao5: null,
        ao12: null
      }
    });
    this.resetTime();
  }

  deleteEntry(id, x) {
    let result = this.state.log.slice();
    id = this.state.log.length - id;
    if (x > result.length - id) {
      x = result.length - id;
    }
    let leftovers = result.splice(id, x);
    console.log(result);
    if (result.length === 0) {
      this.clearAll();
    } else {
      for (var i = 0; i < id; i++) {
        result[i].res.id -= x;
      }
      let newav = this.state.average;
      for (i = 0; i < leftovers.length; i++) {
        newav = (((newav*(this.state.reps - i)) - leftovers[i].res.time) /
                  (this.state.reps - i - 1));
      }

      this.forceUpdateAv(result, id, 5);
      this.forceUpdateAv(result, id, 12);

      this.setState({
        log: result,
        reps: this.state.reps - x,
        average: newav,
        best: {
          res: this.forceUpdateBest(result),
          ao5: this.forceUpdateBestAo5(result),
          ao12: this.forceUpdateBestAo12(result)
        }
      });
    }
  }

  forceUpdateAv(result, id, howmany) {
    var i;
    id = id - 1;
    if (howmany === 5) {
      for (i = id; i > id - 4; i--) {
        if (i >= 0) {
          result[i].res.ao5 = this.forceCalculateAv(5, result, i);
        }
      }
    }
    if (howmany === 12) {
      for (i = id; i > id - 11; i--) {
        if (i >= 0) {
          result[i].res.ao12 = this.forceCalculateAv(12, result, i);
        }
      }
    }
  }
/*
  shouldUpdateAo5(result, id) {
    var i;
    for (i = id; i < id + 5; i++) {
      if (i < result.length) {
        if (result[i].res.ao5 === this.state.best.ao5) {
          return true;
        }
      }
    }
    return false;
  }

  shouldUpdateAo12(result, id) {
    var i;
    for (i = id; i < id + 12; i++) {
      if (i < result.length) {
        if (result[i].res.ao12  === this.state.best.ao12) {
          return true;
        }
      }
    }
    return false;
  }
*/
  forceUpdateBest(result) {
    var newbest = result[0].res.time;
    var index = 0;
    for (var i = 1; i < result.length; i++) {
      if (result[i].res.time < newbest) {
        newbest = result[i].res.time;
        index = i;
      }
    }
    return result[index].res;
  }

  forceUpdateBestAo5(result) {
    if (result.length > 4) {
      var newbest = result[0].res.ao5;
      var index = 0;
      for (var i = 1; i < result.length - 4; i++) {
        if (result[i].res.ao5 < newbest) {
          newbest = result[i].res.ao5;
          index = i;
        }
      }
      return result[index].res.ao5;
    }
    return null;
  }

  forceUpdateBestAo12(result) {
    if (result.length > 11) {
      var newbest = result[0].res.ao12;
      var index = 0;
      for (var i = 1; i < result.length - 11; i++) {
        if (result[i].res.ao12 < newbest) {
          newbest = result[i].res.ao12;
          index = i;
        }
      }
      return result[index].res.ao12;
    }
    return null;
  }

  displayScramble() {
    return(this.state.res.scramble);
  }

  convertToTime(s) {
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

  displayAverages() {
    if(this.state.av_under_time) {
      return (
        <div>
            ao5: {this.convertToTime(this.state.res.ao5)}
            <br />
            ao12: {this.convertToTime(this.state.res.ao12)}
        </div>
      );
    }
  }

  display() {
    let l, s, m, h;
    h = this.state.hours;
    m = this.state.minutes;
    s = this.state.seconds;
    l = this.state.mil;
    if (l === null) {
      return(<p>0.00</p>);
    }

    return(
      <p>
        {this.displayHour(h)}
        {this.displayMinute(h, m)}
        {this.displaySecond(m, s)}.{this.displayMillisecond(l)}
      </p>
    );
  }

  generateScramble() {
    let total = Math.floor(Math.random()*6) + 18;
    var key = ['U', 'B', 'R', 'D', 'F', 'L', 'U\'', 'B\'', 'R\'', 'D\'',
              'F\'', 'L\'', 'U2', 'B2', 'R2', 'D2', 'F2', 'L2'];
    let last = .5;
    let morelast = .5;
    var i = 0;
    var x;
    let solution = "";
    for (i = 0; i < total; i++) {
      x = Math.floor(Math.random()*18);
      if (x % 6 === last % 6 || (x % 6 === morelast % 6 && x % 3 === last % 3)) {
        if (x !== 0) {
          x--;
        } else {
          x++;
        }
      }
      morelast = last;
      last = x;
      solution += (key[x] + ' ');
    }
    this.setState({
      res: {
        scramble: solution,
        id: this.state.res.id,
        time: this.state.res.time,
        ao5: this.state.res.ao5,
        ao12: this.state.res.ao12,
      }
    });
  }

  saveTheme(theme) {
    this.setState({
      themes: this.state.themes.concat([theme])
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

  changeColor(theme) {
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--text', theme.text);
    document.documentElement.style.setProperty('--texthighlighted', theme.texthighlighted);
    document.documentElement.style.setProperty('--dark', this.colorLuminance(theme.accent, -.3));
    document.documentElement.style.setProperty('--hover', this.colorLuminance(theme.accent, -.1));
    document.documentElement.style.setProperty('--click', this.colorLuminance(theme.accent, -.2));
    this.setState({
      theme: theme
    });
  }

  // HANDLERS

  handleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleScramble() {
    this.setState({
      scramble_on_side: !this.state.scramble_on_side
    });
  }

  handleInspection() {
    this.setState({
      inspection_time: !this.state.inspection_time
    });
  }

  handleHoldToStart() {
    this.setState({
      hold_to_start: !this.state.hold_to_start
    });
  }

  handleAvUnderTime() {
    this.setState({
      av_under_time: !this.state.av_under_time
    });
  }


  render() {
    document.body.onkeydown = function(e) {
      if (e.keyCode === 32 && !this.state.running && this.state.stopped) {
        document.getElementById("time").style.color = "#2dff57";
        document.getElementById("log").style.display = "none";
        document.getElementById("settings").style.display = "none";
        document.getElementById("scramble").style.display = "none";
        document.getElementById("average").style.display = "none";
        this.resetTime();
      } else if (e.keyCode === 27 && !this.state.modal) {
        this.resetTime();
      } else if (this.state.running && e.keyCode !== 18 && e.keyCode !== 9) {
        document.getElementById("time").style.color = "#f73b3b";
        this.endTime();
        this.calculateTime();
        this.saveTime();
        this.updateBests();
        this.generateScramble();
      }
    }.bind(this);

    document.body.onkeyup = function(e) {
      if (e.keyCode === 32 && !this.state.running && this.state.stopped) {
        this.startTime();
        this.setState({
          stopped: false
        });
        document.getElementById("time").style.color = "inherit";
      } else if (e.keyCode !== 18 && e.keyCode !== 9) {
        document.getElementById("time").style.color = "inherit";
        document.getElementById("log").style.display = "block";
        document.getElementById("settings").style.display = "block";
        document.getElementById("scramble").style.display = "block";
        document.getElementById("average").style.display = "block";
        this.setState({
          stopped: true,
        });
      }
    }.bind(this);

    return (
      <div id="body" className="timer">
        <div className="log" id="log">
          <Log
            log={this.state.log}
            res={this.state.res}
            best={this.state.best}
            reps={this.state.reps}
            running={this.state.running}
            average={this.state.average}
            new_on_top={this.state.new_on_top}
            sessions={this.state.sessions}
            session={this.state.session}
            theme={this.state.theme}
            handleModal={() => this.handleModal()}
            clearAll = {() => this.clearAll()}
            deleteEntry = {(id, x) => this.deleteEntry(id, x)}
            addTime = {(t) => this.addTime(t)}
            downloadFile = {(fileName, contentType) => this.downloadFile(fileName, contentType)}
            uploadFile = {(file) => this.uploadFile(file, this.readFileToState)}
          />
        </div>
        <div className="scramble" id="scramble">
          {this.displayScramble()}
        </div>
        <div className="average" id="average">
          {this.displayAverages()}
        </div>
        <div className="settings" id="settings">
          <Settings
            theme={this.state.theme}
            inspection_time={this.state.inspection_time}
            hold_to_start={this.state.hold_to_start}
            av_under_time={this.state.av_under_time}
            themes={this.state.themes}
            handleModal={() => this.handleModal()}
            handleInspection={this.handleInspection}
            handleHoldToStart={this.handleHoldToStart}
            handleAvUnderTime={this.handleAvUnderTime}
            saveTheme={(theme) => this.saveTheme(theme)}
            changeColor={(theme) => this.changeColor(theme)}
          />
        </div>
        <div id="time">
          {this.display()}
        </div>
      </div>
    );
  }
}

export default Timer;
