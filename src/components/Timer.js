import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactGA from 'react-ga';
import Log from './Log';
import Settings from './Settings';
import Account from './modals/AccountModal'
import Stats from './Stats'
import './Timer.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {faUpload} from '@fortawesome/free-solid-svg-icons';
import {faCopy} from '@fortawesome/free-solid-svg-icons';
import {faChartPie} from '@fortawesome/free-solid-svg-icons';
import {faCaretUp} from '@fortawesome/free-solid-svg-icons';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons';
import {faCaretRight} from '@fortawesome/free-solid-svg-icons';
import {faCaretLeft} from '@fortawesome/free-solid-svg-icons';
import {faUserCircle} from '@fortawesome/free-solid-svg-icons';

library.add(faCog);
library.add(faTimes);
library.add(faPlus);
library.add(faArrowDown);
library.add(faArrowUp);
library.add(faDownload);
library.add(faUpload);
library.add(faCopy);
library.add(faChartPie);
library.add(faCaretUp);
library.add(faCaretDown);
library.add(faCaretRight);
library.add(faCaretLeft);
library.add(faUserCircle);

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      googleuser: null,
      user: {
        name: null,
        photo: null,
        id: null,
        email: null,
      },
      stopped: true,
      running: false,
      canceled: false,
      renderlog: true,
      fifteen: false,
      hold_done: false,
      holdstart: 0,
      modal: false,
      time: 0,
      inspecttime: 15,
      start: null,
      end: null,
      res: {
        id: 0,
        time: null,
        ao5: null,
        ao12: null,
        ao50: null,
        ao100: null,
        scramble: null,
        dnf: false,
        plus2: false,
      },
      best: {
        res: null,
        ao5: null,
        ao12: null,
        ao50: null,
        ao100: null,
      },
      log: [],
      sessions: [{
        id: 0,
        name: null,
        log: [],
        best: null,
        reps: 0,
        validreps: 0,
        average: null
      }],
      session: 0,
      reps: 0,
      validreps: 0,
      average: 0,
      scramble_on_side: false,
      show_av: true,
      show_scramble: true,
      show_log: true,
      show_stats: false,
      inspection_time: false,
      hold_to_start: false,
      highlight_text: true,
      party_mode: false,
      theme: {
        primary: '#1a1c21',
        secondary: '#efefef',
        accent: '#9621ff',
        text: 'rgba(255, 255, 255, .6)',
        texthighlighted: '#efefef'
      },
      themes: [],
      scramble_size: 28,
      timer_size: 144,
      av_size: 24,
      hold_len: .5,
    };

    this.signIn = this.signIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.display = this.display.bind(this);
    this.resetTime = this.resetTime.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.updateInspectionTime = this.updateInspectionTime.bind(this);
    this.displayInspection = this.displayInspection.bind(this);
    this.hideStuff = this.hideStuff.bind(this);
    this.unhideStuff = this.unhideStuff.bind(this);
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
    this.startInspection = this.startInspection.bind(this);
    this.endInspection = this.endInspection.bind(this);
    this.saveSession = this.saveSession.bind(this);
    this.loadSession = this.loadSession.bind(this);
    this.newSession = this.newSession.bind(this);
    this.changeSession = this.changeSession.bind(this);
    this.deleteSession = this.deleteSession.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.handleModalFalse = this.handleModalFalse.bind(this);
    this.handleInspection = this.handleInspection.bind(this);
    this.handleHoldToStart = this.handleHoldToStart.bind(this);
    this.handleShowAv = this.handleShowAv.bind(this);
    this.handleShowScramble = this.handleShowScramble.bind(this);
    this.handleShowLog = this.handleShowLog.bind(this);
    this.handleShowStats = this.handleShowStats.bind(this);
    this.handleScrambleSize = this.handleScrambleSize.bind(this);
    this.handleTimerSize = this.handleTimerSize.bind(this);
    this.handleAvSize = this.handleAvSize.bind(this);
    this.handleHoldLen = this.handleHoldLen.bind(this);
    this.handleHighlightText = this.handleHighlightText.bind(this);
    this.handlePlus2 = this.handlePlus2.bind(this);
    this.handleDNF = this.handleDNF.bind(this);
    this.saveTheme = this.saveTheme.bind(this);
    this.deleteTheme = this.deleteTheme.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.partyMode = this.partyMode.bind(this);
    this.timeTouch = this.timeTouch.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchCancel = this.onTouchCancel.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
  }

  componentDidMount() {
    this.hydrateStateWithLocalStorage();
    // add event listener to save state to localStorage
    // when user leaves/refreshes the page
    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this),
      this.saveSession.bind(this),
    );
    this.generateScramble();
    this.handleModalFalse();
    this.handlePartyModeOff();

    let lasttheme = localStorage.getItem('theme');
    if(lasttheme) {
      lasttheme = JSON.parse(lasttheme);
      this.changeColor(lasttheme);
    }

    this.handleScrambleSize(this.state.scramble_size);
    this.handleTimerSize(this.state.timer_size);
    this.handleAvSize(this.state.av_size);
    document.getElementById("time").addEventListener('touchstart', this.onTouchStart, false);
    document.getElementById("time").addEventListener('touchend', this.onTouchEnd, false);
    document.getElementById("time").addEventListener('touchcancel', this.onTouchCancel, false);
    document.getElementById("time").addEventListener('touchmove', this.onTouchMove, false);
    document.getElementById("time").addEventListener("contextmenu", function(e) { e.preventDefault(); })
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this),
      this.saveSession.bind(this),
    );
    // saves if component has a chance to unmount
    this.saveSession();
    this.saveStateToLocalStorage();
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
      if (data.hasOwnProperty(key) && key !== "theme") {
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
    if (file) {
      var reader = new FileReader();
      reader.onload = function(event) {
        callback(event.target.result);
      };
      reader.readAsText(file);
    }
  }

  signIn(googleUser) {
    let user = googleUser.getBasicProfile();
    this.setState({
      googleuser: user,
      user: {
        name: user.getName(),
        email: user.getEmail(),
        photo: user.getImageUrl(),
        id: user.getId(),
      }
    });
  }

  logOut() {
    this.setState({
      googleuser: null,
      user: {
        name: null,
        email: null,
        photo: null,
        id: null
      }
    });
  }

  newSession() {
    this.saveSession();
    this.setState({
      sessions: this.state.sessions.concat([
        {
          id: this.state.sessions.length,
          name: null,
          best: {
            res: null,
            ao5: null,
            ao12: null,
            ao50: null,
            ao100: null,
          },
          log: [],
          average: null,
          reps: 0
        }
      ]),
      session: this.state.sessions.length,
    }, this.loadSession(this.state.sessions.length - 1));
    this.clearAll();
  }

  saveSession() {
    let curr = this.state.sessions.slice();
    let currlog = this.state.log.slice();
    curr[this.state.session].log = currlog;
    curr[this.state.session].best = this.state.best;
    curr[this.state.session].reps = this.state.reps;
    curr[this.state.session].average = this.state.average;
    this.setState({
      sessions: curr
    });
  }

  loadSession(i) {
    this.setState({
      log: this.state.sessions[i].log,
      best: this.state.sessions[i].best,
      reps: this.state.sessions[i].reps,
      average: this.state.sessions[i].average
    });
  }

  changeSession(i) {
    this.saveSession();
    this.setState({
      session: i,
    });
    this.loadSession(i);
  }

  deleteSession(i) {
    let sess = this.state.sessions.slice();
    if (sess.length > 1) {
      sess.splice(i, 1);
      for (let j = i; j < sess.length; j++) {
        sess[j].id -= 1;
      }
      this.setState({
        sessions: sess,
      });
      if (i <= this.state.sessions.length - 2) {
        this.loadSession(i);
        this.setState({
          session: i,
          name: i + 1,
        });
      } else {
        this.loadSession(this.state.sessions.length - 2);
        this.setState({
          session: this.state.sessions.length - 2,
          name: this.state.sessions.length - 1,
        });
      }
    } else {
      this.clearAll();
      this.setState({
        sessions: [{
          id: 0,
          name: null,
          log: [],
          best: null,
          reps: 0,
          validreps: 0,
          average: null
        }],
      });
    }
  }

  resetTime() {
    this.setState({
      time: 0,
      start: null,
      end: null,
      res: {
        id: this.state.res.id,
        time: this.state.res.time,
        ao5: this.state.res.ao5,
        ao12: this.state.res.ao12,
        ao50: this.state.res.ao50,
        ao100: this.state.res.ao100,
        scramble: this.state.res.scramble,
        dnf: false,
        plus2: false,
      },
    });
  }

  updateTime() {
    let d = new Date();
    const time = d.getTime();
    let difference = time - this.state.start;
    this.setState({ time: difference });
  }

  updateInspectionTime() {
    this.setState({
      inspecttime: this.state.inspecttime - 1,
    }, () => {
      if (this.state.inspecttime < -1 && !this.state.res.dnf) {
        this.setState({
          res: {
            id: this.state.res.id,
            time: this.state.res.time,
            ao5: this.state.res.ao5,
            ao12: this.state.res.ao12,
            ao50: this.state.res.ao50,
            ao100: this.state.res.ao100,
            scramble: this.state.res.scramble,
            dnf: true,
            plus2: false,
          },
        });
      } else if (this.state.inspecttime < 1 && !this.state.res.plus2 && !this.state.res.dnf) {
        this.setState({
          res: {
            id: this.state.res.id,
            time: this.state.res.time,
            ao5: this.state.res.ao5,
            ao12: this.state.res.ao12,
            ao50: this.state.res.ao50,
            ao100: this.state.res.ao100,
            scramble: this.state.res.scramble,
            dnf: false,
            plus2: true,
          },
        })
      }}
    );
  }

  startTime() {
    let d = new Date();
    const time = d.getTime();
    this.setState({
      start: time,
      running: true
    });
    this.timer = setInterval(this.updateTime, 16);
  }

  endTime() {
    let d = new Date();
    const time = d.getTime();
    this.setState({
      end: time,
      running: false,
      reps: this.state.reps + 1
    });
    if (!this.state.res.dnf) {
      this.setState({
        validreps: this.state.validreps + 1,
      });
    }
    clearInterval(this.timer);
  }

  calculateTime() {
    let t = this.state.end - this.state.start;
    this.setState({
      res: {
        scramble: this.state.res.scramble,
        time: t,
        id: this.state.reps,
        ao5: this.calculateAv(5, t, this.state.reps, this.state.res.dnf),
        ao12: this.calculateAv(12, t, this.state.reps, this.state.res.dnf),
        ao50: this.calculateAv(50, t, this.state.reps, this.state.res.dnf),
        ao100: this.calculateAv(100, t, this.state.reps, this.state.res.dnf),
        dnf: this.state.res.dnf,
        plus2: this.state.res.plus2,
      },
      average: this.calculateAverage(t, this.state.validreps),
      time: t,
    });
  }

  calculateAverage(t, reps) {
    if(!this.state.res.dnf) {
      if (reps === 1) {
        return (t);
      }
      return ((((this.state.average) * (reps - 1)) + t) / reps);
    } else {
      return this.state.average;
    }
  }

  forceCalculateAverage(arr) {
    let sum = 0;
    let j = 0;
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].res.dnf) {
        sum += arr[i].res.time;
        j++;
      }
    }
    return (sum / j);
  }

  calculateAv(howmany, t, reps, dnf) {
    if (reps < howmany) {
      return null;
    }
    const history = this.state.log.slice(0, howmany);
    const list = history.map((item, step) => {
      return (
        item.res.time
      )
    });
    let dnfs = 0;
    let best = t;
    if (dnf) {
      dnfs ++;
      let j = 0;
      for (j = 0; j < howmany - 1; j++) {
        if (!history[j].res.dnf) {
          best = history[j].res.time;
          break;
        }
      }
    }
    let worst = t;
    let worstisdnf = dnf;
    let i = 0;
    let sum = t;
    for (i = 0; i < howmany - 1; i++) {
      if (history[i].res.dnf) {
        dnfs++;
        if (dnfs > 1) {
          return('dnf');
        }
      }
      if (list[i] < best && !history[i].res.dnf) {
        best = list[i];
      }
      if (history[i].res.dnf || (list[i] > worst && !worstisdnf)) {
        worst = list[i];
        if (history[i].res.dnf) {
          worstisdnf = true;
        }
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
    let dnfs = 0;
    let best;
    let worst = list[0];
    let worstisdnf = history[0].res.dnf;
    let i = 0;
    let j = 0;
    for (j = 0; j < howmany - 1; j++) {
      if (!history[j].res.dnf) {
        best = history[j].res.time;
        break;
      }
    }
    if (history[0].res.dnf) {
      dnfs++;
    }
    let sum = list[0];
    for (i = 1; i < howmany; i++) {
      if (history[i].res.dnf) {
        dnfs++;
        if (dnfs > 1) {
          return('dnf');
        }
      }
      if (list[i] < best && !history[i].res.dnf) {
        best = list[i];
      }
      if (history[i].res.dnf || (list[i] > worst && !worstisdnf)) {
        worst = list[i];
        if (history[i].res.dnf) {
          worstisdnf = true;
        }
      }
      sum = sum + list[i];
    }
    let av = ((sum - best - worst) / (howmany - 2));
    return av;
  }

  updateBests() {
    if(!this.state.res.dnf) {
      if (this.state.best.res === null
          || this.state.res.time < this.state.best.res.time) {
        this.setState({
          best: {
            res: this.state.res,
            ao5: this.state.best.ao5,
            ao12: this.state.best.ao12,
            ao50: this.state.best.ao50,
            ao100: this.state.best.ao100,
          }
        });
      }
      if ((this.state.best.ao5 === null && this.state.res.ao5 !== null)
          || this.state.res.ao5 < this.state.best.ao5) {
            this.setState({
              best: {
                res: this.state.best.res,
                ao5: this.state.res.ao5,
                ao12: this.state.best.ao12,
                ao50: this.state.best.ao50,
                ao100: this.state.best.ao100,
              }
            });
      }
      if ((this.state.best.ao12 === null && this.state.res.ao12 !== null)
          || this.state.res.ao12 < this.state.best.ao12) {
            this.setState({
              best: {
                res: this.state.best.res,
                ao5: this.state.best.ao5,
                ao12: this.state.res.ao12,
                ao50: this.state.best.ao50,
                ao100: this.state.best.ao100,
              }
            });
      }
      if ((this.state.best.ao50 === null && this.state.res.ao50 !== null)
          || this.state.res.ao50 < this.state.best.ao50) {
            this.setState({
              best: {
                res: this.state.best.res,
                ao5: this.state.best.ao5,
                ao12: this.state.best.ao12,
                ao50: this.state.res.ao50,
                ao100: this.state.best.ao100,
              }
            });
      }
      if ((this.state.best.ao100 === null && this.state.res.ao100 !== null)
          || this.state.res.ao100 < this.state.best.ao100) {
            this.setState({
              best: {
                res: this.state.best.res,
                ao5: this.state.best.ao5,
                ao12: this.state.best.ao12,
                ao50: this.state.best.ao50,
                ao100: this.state.res.ao100,
              }
            });
      }
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
    const ao5 = this.calculateAv(5, time, reps, false);
    const ao12 = this.calculateAv(12, time, reps, false);
    const ao50 = this.calculateAv(50, time, reps, false);
    const ao100 = this.calculateAv(100, time, reps, false);
    const average = this.calculateAverage(time, this.state.validreps + 1);
    if (this.state.best.res === null
        || time < this.state.best.res.time) {
      this.setState({
        best: {
          res: {
            time: time,
            id: reps,
            ao5: ao5,
            ao12: ao12,
            ao50: ao50,
            ao100: ao100,
            scramble: this.state.res.scramble,
            dnf: false,
            plus2: false,
          },
          ao5: this.state.best.ao5,
          ao12: this.state.best.ao12,
          ao50: this.state.best.ao50,
          ao100: this.state.best.ao100,
        }
      });
    }
    if ((this.state.best.ao5 === null && this.state.res.ao5 !== null)
        || ao5 < this.state.best.ao5) {
          this.setState({
            best: {
              res: this.state.best.res,
              ao5: ao5,
              ao12: this.state.best.ao12,
              ao50: this.state.best.ao50,
              ao100: this.state.best.ao100,
            }
          });
    }
    if ((this.state.best.ao12 === null && this.state.res.ao12 !== null)
        || ao12 < this.state.best.ao12) {
          this.setState({
            best: {
              res: this.state.best.res,
              ao5: this.state.best.ao5,
              ao12: ao12,
              ao50: this.state.best.ao50,
              ao100: this.state.best.ao100,
            }
          });
    }
    if ((this.state.best.ao50 === null && this.state.res.ao50 !== null)
        || ao50 < this.state.best.ao50) {
          this.setState({
            best: {
              res: this.state.best.res,
              ao5: this.state.best.ao5,
              ao12: this.state.res.ao12,
              ao50: ao50,
              ao100: this.state.best.ao100,
            }
          });
    }
    if ((this.state.best.ao100 === null && this.state.res.ao100 !== null)
        || ao50 < this.state.best.ao100) {
          this.setState({
            best: {
              res: this.state.best.res,
              ao5: this.state.best.ao5,
              ao12: this.state.res.ao12,
              ao50: this.state.best.ao50,
              ao100: ao100,
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
            ao50: ao50,
            ao100: ao100,
            scramble: this.state.res.scramble,
            dnf: false,
            plus2: false,
          }
        }
      ].concat(this.state.log),
      reps: reps,
      validreps: this.state.validreps + 1,
      average: average,
      res: {
        time: time,
        id: reps,
        ao5: ao5,
        ao12: ao12,
        ao50: ao50,
        ao100: ao100,
        scramble: this.state.res.scramble,
        dnf: false,
        plus2: false,
      },
    });
    this.generateScramble();
  }

  clearAll() {
    this.setState({
      log: [],
      reps: 0,
      validreps: 0,
      average: 0,
      best: {
        res: null,
        ao5: null,
        ao12: null,
        ao50: null,
        ao100: null,
      },
      res: {
        scramble: this.state.res.scramble,
        time: null,
        id: 0,
        ao5: null,
        ao12: null,
        ao50: null,
        ao100: null,
        dnf: false,
        plus2: false,
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
    if (result.length === 0) {
      this.clearAll();
    } else {
      for (var i = 0; i < id; i++) {
        result[i].res.id -= x;
      }
      let newav = this.state.average;
      let dnfs = 0;
      for (i = 0; i < leftovers.length; i++) {
        if(!leftovers[i].res.dnf) {
          newav = (((newav*(this.state.validreps - i)) - leftovers[i].res.time) /
                    (this.state.validreps - i - 1));
        } else {
          dnfs++;
        }
      }
      if (this.state.validreps - x + dnfs === 0) {
        newav = null;
      }

      this.forceUpdateAv(result, id, 5);
      this.forceUpdateAv(result, id, 12);
      this.forceUpdateAv(result, id, 50);
      this.forceUpdateAv(result, id, 100);

      this.setState({
        log: result,
        reps: this.state.reps - x,
        validreps: this.state.validreps - x + dnfs,
        average: this.forceCalculateAverage(result),
        best: {
          res: this.forceUpdateBest(result),
          ao5: this.forceUpdateBestAo5(result),
          ao12: this.forceUpdateBestAo12(result),
          ao50: this.forceUpdateBestAo50(result),
          ao100: this.forceUpdateBestAo100(result),
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
    if (howmany === 50) {
      for (i = id; i > id - 49; i--) {
        if (i >= 0) {
          result[i].res.ao50 = this.forceCalculateAv(50, result, i);
        }
      }
    }
    if (howmany === 100) {
      for (i = id; i > id - 99; i--) {
        if (i >= 0) {
          result[i].res.ao100 = this.forceCalculateAv(100, result, i);
        }
      }
    }
  }

  forceUpdateBest(result) {
    var newbest;
    let j = 0;
    if (result.length > 1) {
      while (result[j].res.dnf && j < result.length) {
        j++;
      }
    }
    newbest = result[j].res.time;
    var index = j;
    for (var i = 1; i < result.length; i++) {
      if (result[i].res.time < newbest && !result[i].res.dnf) {
        newbest = result[i].res.time;
        index = i;
      }
    }
    return result[index].res;
  }

  forceUpdateBestAo5(result) {
    if (result.length > 4) {
      let j = 0;
      while (result[j].res.ao5 === 'dnf' && j < result.length) {
        j++;
      }
      var newbest = result[j].res.ao5;
      var index = j;
      for (var i = 1; i < result.length - 4; i++) {
        if (result[i].res.ao5 < newbest && !(result[i].res.ao5 === 'dnf')) {
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
      let j = 0;
      while (result[j].res.ao12 === 'dnf' && j < result.length) {
        j++;
      }
      var newbest = result[j].res.ao12;
      var index = j;
      for (var i = 1; i < result.length - 11; i++) {
        if (result[i].res.ao12 < newbest && !(result[i].res.ao12 === 'dnf')) {
          newbest = result[i].res.ao12;
          index = i;
        }
      }
      return result[index].res.ao12;
    }
    return null;
  }

  forceUpdateBestAo50(result) {
    if (result.length > 49) {
      let j = 0;
      while (result[j].res.ao50 === 'dnf' && j < result.length) {
        j++;
      }
      var newbest = result[j].res.ao50;
      var index = j;
      for (var i = 1; i < result.length - 49; i++) {
        if (result[i].res.ao50 < newbest && !(result[i].res.ao50 === 'dnf')) {
          newbest = result[i].res.ao50;
          index = i;
        }
      }
      return result[index].res.ao50;
    }
    return null;
  }

  forceUpdateBestAo100(result) {
    if (result.length > 99) {
      let j = 0;
      while (result[j].res.ao100 === 'dnf' && j < result.length) {
        j++;
      }
      var newbest = result[j].res.ao100;
      var index = j;
      for (var i = 1; i < result.length - 99; i++) {
        if (result[i].res.ao100 < newbest && !(result[i].res.ao100 === 'dnf')) {
          newbest = result[i].res.ao100;
          index = i;
        }
      }
      return result[index].res.ao100;
    }
    return null;
  }

  startInspection() {
    this.setState({
      fifteen: true,
      inspecttime: 15,
    });
    this.inspection = setInterval(this.updateInspectionTime, 1000);
  }

  endInspection() {
    this.setState({
      fifteen: false,
    });
    clearInterval(this.inspection);
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
    if(this.state.show_av) {
      if (this.state.log.length) {
        return (
          <div>
              ao5: {this.convertToTime(this.state.log[0].res.ao5)}
              <br />
              ao12: {this.convertToTime(this.state.log[0].res.ao12)}
          </div>
        );
      } else {
        return (
          <div>
              ao5: {this.convertToTime(this.state.res.ao5)}
              <br />
              ao12: {this.convertToTime(this.state.res.ao12)}
          </div>
        );
      }
    }
  }

  displayInspection() {
    let s = this.state.inspecttime;
    if (s <= -2) {
      return (
        <p>DNF</p>
      );
    } else if (s <= 0) {
      return (
        <p>+2</p>
      );
    }
    return (
      <p>
        {this.displaySecond(0, s)}
      </p>
    );
  }

  display() {
    if (this.state.fifteen) {
      return(this.displayInspection());
    } else if (this.state.stopped && this.state.res.dnf) {
      return(<p>DNF</p>);
    } else {
      if (this.state.time === null || this.state.time === 0) {
        return(<p>0.00</p>);
      }

      return (
        <p>
          {this.convertToTime(this.state.time)}
        </p>
      );
    }
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
        ao50: this.state.res.ao50,
        ao100: this.state.res.ao100,
        dnf: this.state.res.dnf,
        plus2: this.state.res.plus2,
      }
    });
  }

  saveTheme(name, theme) {
    this.setState({
      themes: this.state.themes.concat([{name, theme}])
    });
  }

  deleteTheme(index) {
    let result = this.state.themes;
    result.splice(index, 1);
    this.setState({
      themes: result
    });
  }

  hideStuff() {
    document.getElementById("log").style.display = "none";
    document.getElementById("settings").style.display = "none";
    document.getElementById("scramble").style.display = "none";
    document.getElementById("average").style.display = "none";
    document.getElementById("statistics").style.display = "none";
    document.getElementById("account").style.display = "none";
  }

  unhideStuff() {
    document.getElementById("log").style.display = "block";
    document.getElementById("settings").style.display = "block";
    document.getElementById("scramble").style.display = "block";
    document.getElementById("average").style.display = "block";
    document.getElementById("statistics").style.display = "block";
    document.getElementById("account").style.display = "block";
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
    if (!this.state.party_mode) {
      document.documentElement.style.setProperty('--primary', theme.primary);
      document.documentElement.style.setProperty('--secondary', theme.secondary);
      document.documentElement.style.setProperty('--accent', theme.accent);
      document.documentElement.style.setProperty('--text', theme.text);
      document.documentElement.style.setProperty('--texthighlighted', theme.texthighlighted);
      document.documentElement.style.setProperty('--dark', this.colorLuminance(theme.accent, -.3));
      document.documentElement.style.setProperty('--hover', this.colorLuminance(theme.accent, -.1));
      document.documentElement.style.setProperty('--click', this.colorLuminance(theme.accent, -.2));
    }
    this.setState({
      theme: theme
    });
  }

  partyMode() {
    if (this.state.party_mode) {
      this.setState({
        party_mode: false,
      });
      clearInterval(this.party_mode_timer);
      this.changeColor(this.state.theme);
    } else {
      this.setState({
        party_mode: true,
      });
      document.documentElement.style.setProperty('--secondary', "#000");
      document.documentElement.style.setProperty('--text', "#1d1d1d");
      document.documentElement.style.setProperty('--texthighlighted', "#000");
      var r = 255;
      var g = 0;
      var b = 0;
      let colorLuminance = this.colorLuminance;
      function changeColor() {
          if (r === 255 && b === 0 && g !== 255) {
            g++;
          } else if (g === 255 && b === 0 && r !== 0) {
            r--;
          } else if (r === 0 && g === 255 && b !== 255) {
            b++;
          } else if (r ===  0&& b === 255 && g!== 0) {
            g--;
          } else if (g === 0 && b === 255 && r !== 255) {
            r++;
          } else if (r === 255 && g === 0 && b !== 0) {
            b--;
          }

          var h = x => '#' + x.match(/\d+/g).map(x = z => ((+z < 16)?'0':'') + (+z).toString(16)).join('');

          document.documentElement.style.setProperty('--primary', "rgb(" + r + "," + g + "," + b + ")");
          let rgbinverse = "rgb(" + (255 - r) + "," + (255 - g) + "," + (255 - b) + ")";
          let inverse = h(rgbinverse);
          document.documentElement.style.setProperty('--accent', inverse);
          document.documentElement.style.setProperty('--dark', colorLuminance(inverse, -.3));
          document.documentElement.style.setProperty('--hover', colorLuminance(inverse, -.1));
          document.documentElement.style.setProperty('--click', colorLuminance(inverse, -.2));
      };
      this.party_mode_timer = setInterval(changeColor, 33);
      ReactGA.event({
        category: 'User',
        action: 'Turned Party Mode On'
      });
    }
  }

  timeTouch() {
    this.setState({ hold_done: true });
    document.getElementById("time").style.color = "#2dff57";
    this.hideStuff();
    if (!this.state.fifteen) {
      this.resetTime();
    }
  }

  onTouchStart(e) {
    this.setState({ canceled: false });
    if (!this.state.running && this.state.stopped && !this.state.modal) {
      if (this.state.hold_to_start && (!this.state.inspection_time || this.state.fifteen)) {
        document.getElementById("time").style.color = "#ffff2d";
        this.hold_touch_timer = setTimeout(this.timeTouch, this.state.hold_len * 1000);
      } else {
        document.getElementById("time").style.color = "#2dff57";
        this.hideStuff();
        if (!this.state.fifteen) {
          this.resetTime();
        }
      }
    } else if (this.state.running) {
      this.endTime();
      this.calculateTime();
      document.getElementById("time").style.color = "#f73b3b";
    }
  }

  onTouchEnd(e) {
    if (!this.state.running && this.state.stopped && !this.state.modal && !this.state.canceled) {
      if (this.state.inspection_time) {
        if (!this.state.fifteen) {
          document.getElementById("time").style.color = "#f73b3b";
          this.startInspection();
          if (this.state.hold_to_start) {
            this.setState({ hold_done: false });
          }
        } else {
          if (this.state.hold_to_start) {
            if (this.state.hold_done) {
              this.endInspection();
            } else {
              document.getElementById("time").style.color = "#f73b3b";
              clearTimeout(this.hold_touch_timer);
              console.log('here');
            }
          } else {
            this.endInspection();
          }
        }
      }
      if (!this.state.fifteen) {
        if (this.state.hold_to_start) {
          if (this.state.hold_done) {
            this.handleStopped();
            this.startTime();
            document.getElementById("time").style.color = "inherit";
          } else {
            document.getElementById("time").style.color = "inherit";
            clearTimeout(this.hold_touch_timer);
            this.unhideStuff();
          }
        } else {
          this.handleStopped();
          this.startTime();
          document.getElementById("time").style.color = "inherit";
        }
      }
    } else if (!this.state.fifteen && !this.state.stopped) {
      document.getElementById("time").style.color = "inherit";
      this.unhideStuff();
      this.setState({ hold_done: false });
      this.saveTime();
      this.updateBests();
      this.generateScramble();
      this.handleRenderLog();
      this.handleStopped();
    }
  }

  onTouchCancel(e) {
    this.setState({
      canceled: true,
      running: false,
      stopped: true,
    });
    this.unhideStuff();
    if (this.state.hold_to_start) {
      clearTimeout(this.hold_touch_timer);
    }
    document.getElementById("time").style.color = "inherit";
  }

  onTouchMove(e) {
    this.onTouchCancel(e);
  }

  // HANDLERS

  handleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handlePartyModeOff() {
    this.setState({
      party_mode: false,
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

  handleShowAv() {
    this.setState({
      show_av: !this.state.show_av
    });
  }

  handleShowScramble() {
    this.setState({
      show_scramble: !this.state.show_scramble
    });
  }

  handleShowLog() {
    this.setState({
      show_log: !this.state.show_log
    });
  }

  handleShowStats() {
    this.setState({
      show_stats: !this.state.show_stats
    });
  }

  handleStopped() {
    this.setState({
      stopped: !this.state.stopped
    })
  }

  handleRenderLog() {
    this.setState({
      renderlog: false
    }, this.setState({ renderlog: true }));
  }

  handleModalFalse() {
    this.setState({
      modal: false
    });
  }

  handleScrambleSize(i) {
    this.setState({
      scramble_size: i
    });
    document.getElementById("scramble").style.fontSize = i + "px";
  }

  handleTimerSize(i) {
    this.setState({
      timer_size: i
    });
    document.getElementById("time").style.fontSize = i + "px";
  }

  handleAvSize(i) {
    this.setState({
      av_size: i
    });
    document.getElementById("average").style.fontSize = i + "px";
  }

  handleHoldLen(i) {
    this.setState({
      hold_len: i,
    });
  }

  handleHighlightText() {
    if (this.state.highlight_text) {
      document.documentElement.style.setProperty('--highlighted', 'var(--text)');
    } else {
      document.documentElement.style.setProperty('--highlighted', 'var(--texthighlighted)');
    }
    this.setState({
      highlight_text: !this.state.highlight_text,
    });
  }

  handlePlus2(index) {
    let logcopy = this.state.log.slice();
    logcopy[index].res.plus2 = !logcopy[index].res.plus2;
    if (logcopy[index].res.plus2) {
      logcopy[index].res.time += 2000;
    } else {
      logcopy[index].res.time -= 2000;
    }
    let i;
    for (i = index; i > index - 12; i--) {
      if (i >= 0 && i > index - 5) {
        logcopy[i].res.ao5 = this.forceCalculateAv(5, logcopy, i);
      }
      if (i >= 0) {
        logcopy[i].res.ao12 = this.forceCalculateAv(12, logcopy, i);
      }
    }
    this.setState({
      log: logcopy,
      best: {
        res: this.forceUpdateBest(logcopy),
        ao5: this.forceUpdateBestAo5(logcopy),
        ao12: this.forceUpdateBestAo12(logcopy),
        ao50: this.forceUpdateBestAo50(logcopy),
        ao100: this.forceUpdateBestAo100(logcopy),
      },
      average: this.forceCalculateAverage(logcopy),
    });
  }

  handleDNF(index) {
    let logcopy = this.state.log.slice();
    logcopy[index].res.dnf = !logcopy[index].res.dnf;
    if (logcopy[index].res.dnf) {
      this.setState({ validreps: this.state.validreps - 1 });
    } else {
      this.setState({ validreps: this.state.validreps + 1 });
    }
    let i;
    for (i = index; i > index - 12; i--) {
      if (i >= 0 && i > index - 5) {
        logcopy[i].res.ao5 = this.forceCalculateAv(5, logcopy, i);
      }
      if (i >= 0) {
        logcopy[i].res.ao12 = this.forceCalculateAv(12, logcopy, i);
      }
  }
    this.setState({
      log: logcopy,
      best: {
        res: this.forceUpdateBest(logcopy),
        ao5: this.forceUpdateBestAo5(logcopy),
        ao12: this.forceUpdateBestAo12(logcopy),
        ao50: this.forceUpdateBestAo50(logcopy),
        ao100: this.forceUpdateBestAo100(logcopy),
      },
      average: this.forceCalculateAverage(logcopy),
    });
  }


  render() {
    let keyheld = false;
    document.body.onkeydown = function(e) {
      if (e.repeat) {
        if (this.state.hold_to_start && !this.state.hold_done) {
          let d = new Date();
          const time = d.getTime();
          if (time - this.state.holdstart >= this.state.hold_len * 1000) {
            this.setState({ hold_done : true });
            document.getElementById("time").style.color = "#2dff57";
            this.hideStuff();
            if (!this.state.fifteen) {
              this.resetTime();
            }
          }
        }
        return;
      } else if (e.keyCode === 76) {
        this.setState({
          googleuser: 1,
          user: {
            name: "Daniel Dylla",
            id: "113085164799819270389",
            email: "daniel.dylla@gmail.com",
            photo: "https://lh4.googleusercontent.com/-LrAx4wG8e30/AAAAAAAAAAI/AAAAAAAAXNM/tuG65w-2v1w/s96-c/photo.jpg",
          }
        })
      } else if (e.keyCode === 32 && !this.state.running && this.state.stopped && !this.state.modal) {
        if (this.state.hold_to_start && (!this.state.inspection_time || this.state.fifteen)) {
          document.getElementById("time").style.color = "#ffff2d";
          let d = new Date();
          const time = d.getTime();
          this.setState({ holdstart: time });
        } else {
          document.getElementById("time").style.color = "#2dff57";
          this.hideStuff();
          if (!this.state.fifteen) {
            this.resetTime();
          }
        }
      } else if (e.keyCode === 27 && !this.state.modal && !this.state.fifteen) {
        this.resetTime();
      } else if (this.state.running && e.keyCode !== 18 && e.keyCode !== 9 && !keyheld) {
        keyheld = true;
        this.endTime();
        this.calculateTime();
        document.getElementById("time").style.color = "#f73b3b";
      }
    }.bind(this);

    document.body.onkeyup = function(e) {
      keyheld = false;
      if (e.keyCode === 32 && !this.state.running && this.state.stopped && !this.state.modal) {
        if (this.state.inspection_time) {
          if (!this.state.fifteen) {
            document.getElementById("time").style.color = "#f73b3b";
            this.startInspection();
            if (this.state.hold_to_start) {
              this.setState({ hold_done: false });
            }
          } else {
            if (this.state.hold_to_start) {
              if (this.state.hold_done) {
                this.endInspection();
              } else {
                document.getElementById("time").style.color = "#f73b3b";
              }
            } else {
              this.endInspection();
            }
          }
        }
        if (!this.state.fifteen) {
          if (this.state.hold_to_start) {
            if (this.state.hold_done) {
              this.handleStopped();
              this.startTime();
              document.getElementById("time").style.color = "inherit";
            } else {
              document.getElementById("time").style.color = "inherit";
              this.unhideStuff();
            }
          } else {
            this.handleStopped();
            this.startTime();
            document.getElementById("time").style.color = "inherit";
          }
        }
      } else if (e.keyCode !== 18 && e.keyCode !== 9 && !this.state.fifteen && !this.state.stopped) {
        document.getElementById("time").style.color = "inherit";
        this.unhideStuff();
        this.setState({ hold_done: false });
        this.saveTime();
        this.updateBests();
        this.generateScramble();
        this.handleRenderLog();
        this.handleStopped();
      }
    }.bind(this);

    return (
      <div id="body" className="timer">
        <div className="log" id="log">
          {this.state.show_log ?
            <Log
              log={this.state.log}
              res={this.state.res}
              best={this.state.best}
              reps={this.state.reps}
              running={this.state.running}
              stopped={this.state.stopped}
              renderlog={this.state.renderlog}
              fifteen={this.state.fifteen}
              average={this.state.average}
              new_on_top={this.state.new_on_top}
              sessions={this.state.sessions}
              session={this.state.session}
              theme={this.state.theme}
              handleModal={() => this.handleModal()}
              handlePlus2={(index) => this.handlePlus2(index)}
              handleDNF={(index) => this.handleDNF(index)}
              clearAll = {() => this.clearAll()}
              deleteEntry = {(id, x) => this.deleteEntry(id, x)}
              addTime = {(t) => this.addTime(t)}
              downloadFile = {(fileName, contentType) => this.downloadFile(fileName, contentType)}
              uploadFile = {(file) => this.uploadFile(file, this.readFileToState)}
              newSession = {this.newSession}
              changeSession = {(i) => this.changeSession(i)}
              saveSession = {this.saveSession}
              deleteSession = {(i) => this.deleteSession(i)}
            />
          : null}
        </div>
        <div className="scramble" id="scramble">
          {this.state.show_scramble && this.state.res.scramble}
        </div>
        <div className="average" id="average">
          {this.displayAverages()}
        </div>
        <div className="settings" id="settings">
          <Settings
            stopped={this.state.stopped}
            theme={this.state.theme}
            party_mode={this.state.party_mode}
            inspection_time={this.state.inspection_time}
            hold_to_start={this.state.hold_to_start}
            show_av={this.state.show_av}
            show_scramble={this.state.show_scramble}
            show_log={this.state.show_log}
            scramble_size={this.state.scramble_size}
            timer_size={this.state.timer_size}
            av_size={this.state.av_size}
            hold_len={this.state.hold_len}
            highlight_text={this.state.highlight_text}
            themes={this.state.themes}
            handleModal={() => this.handleModal()}
            handleInspection={this.handleInspection}
            handleHoldToStart={this.handleHoldToStart}
            handleShowAv={this.handleShowAv}
            handleShowScramble={this.handleShowScramble}
            handleShowLog={this.handleShowLog}
            handleScrambleSize={(i) => this.handleScrambleSize(i)}
            handleTimerSize={(i) => this.handleTimerSize(i)}
            handleAvSize={(i) => this.handleAvSize(i)}
            handleHoldLen={(i) => this.handleHoldLen(i)}
            handleHighlightText={this.handleHighlightText}
            saveTheme={(name, theme) => this.saveTheme(name, theme)}
            deleteTheme={(i) => this.deleteTheme(i)}
            changeColor={(theme) => this.changeColor(theme)}
            partyMode={this.partyMode}
          />
        </div>
        <div className="statistics" id="statistics">
          <div className="stats" id="stats">
            {this.state.show_stats ?
              <button id="statsiconon" onClick={this.handleShowStats}>
                <FontAwesomeIcon icon="chart-pie" />
              </button>
            :
              <button id="statsicon" onClick ={this.handleShowStats}>
                <FontAwesomeIcon icon="chart-pie" />
              </button>
            }
          </div>
          <Stats
            log={this.state.log}
            best={this.state.best}
            running={this.state.running}
            stopped={this.state.stopped}
            renderlog={this.state.renderlog}
            reps={this.state.reps}
            fifteen={this.state.fifteen}
            theme={this.state.theme}
            show_stats={this.state.show_stats}
            handleShowStats={this.handleShowStats}
          />
        </div>
        <div className="account" id="account">
          <Account
            user={this.state.user}
            googleuser={this.state.googleuser}
            theme={this.state.theme}
            signIn={(g) => this.signIn(g)}
            logOut={this.logOut}
            handleModal={this.handleModal}
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
