import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Log from './Log'
import Settings from './Settings'
import './Timer.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';

library.add(faCog);
library.add(faTimes);
library.add(faArrowDown);
library.add(faArrowUp);

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stopped: true,
      running: false,
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
      reps: 0,
      average: 0,
      settings: {
        cube_mode: true,
        scramble_on_side: false,
      }
    };

    this.display = this.display.bind(this);
    this.resetTime = this.resetTime.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.updateBests = this.updateBests.bind(this);
    this.startTime = this.startTime.bind(this);
    this.endTime = this.endTime.bind(this);
    this.calculateTime = this.calculateTime.bind(this);
    this.saveTime = this.saveTime.bind(this);
    this.calculateAverage = this.calculateAverage.bind(this);
    this.calculateAv = this.calculateAv.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.generateScramble = this.generateScramble.bind(this);
    this.handleCubeMode = this.handleCubeMode.bind(this);

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
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
    // saves if component has a chance to unmount
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
        ao5: this.calculateAv(5, t),
        ao12: this.calculateAv(12, t)
      },
      average: this.calculateAverage(t),
      hours: s,
      minutes: min,
      seconds: sec,
      mil: Math.floor(ms/10),
    });
  }

  calculateAverage(t) {
    if (this.state.reps === 1) {
      return (t);
    }
    return ((((this.state.average) * (this.state.reps - 1)) + t) / this.state.reps);
  }

  calculateAv(howmany, t) {
    if (this.state.reps < howmany) {
      return null;
    }
    const history = this.state.log.slice(this.state.reps - howmany, this.state.reps-1);
    const list = history.map((item, step) => {
      return (
        item.res.time
      )
    });
    let best = 0;
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
      log: this.state.log.concat([
        {
          res: this.state.res
        }
      ]),
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

  downloadFile(fileName, contentType) {
    this.saveStateToLocalStorage();
    let content = localStorage.getItem('log');
    /*for (let key in this.state) {
      // if the key exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = localStorage.getItem(key);
        // parse the localStorage string and setState
        content += value;
      }
    }*/
    console.log(content);
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  displayScramble() {
    if(this.state.settings.cube_mode) {
      return(this.state.res.scramble);
    }
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
      if (x%6 === last%6 || (x%6 === morelast%6 && x%3 === last%3)) {
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

  // HANDLERS

  handleCubeMode(cube) {
    this.setState({
      settings: {
        cube_mode: !this.state.settings.cube_mode
      }
    });
    if (!cube) {
      document.getElementById("log").style.width = "10vw";
    } else {
      document.getElementById("log").style.width = "15vw";
    }
  }

  handleScramble() {
    this.setState({
      settings: {
        scramble_on_side: !this.state.settings.scramble_on_side
      }
    });
  }



  render() {
    document.body.onkeydown = function(e) {
      if (e.keyCode === 32 && !this.state.running && this.state.stopped) {
        document.getElementById("time").style.color = "#2dff57";
        document.getElementById("log").style.display = "none";
        document.getElementById("settings").style.display = "none";
        document.getElementById("scramble").style.display = "none";
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
            cube_mode={this.state.settings.cube_mode}
            clearAll = {() => this.clearAll()}
            downloadFile = {(fileName, contentType) => this.downloadFile(fileName, contentType)}
          />
        </div>
        <div className="scramble" id="scramble">
          {this.displayScramble()}
        </div>
        <div className="settings" id="settings">
          <Settings
            handleCubeMode={(cube) => this.handleCubeMode(cube)}
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
