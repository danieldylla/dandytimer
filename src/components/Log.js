import React, { Component } from 'react';
import LogStats from './LogStats';
import './Log.css';

class Log extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return ((this.props.reps !== nextProps.reps
      || this.props.cube_mode !== nextProps.cube_mode
      || this.props.log[this.props.reps] !== this.props.res)
      && !this.props.running
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

  displayLogEntry(time) {
    return (
      <button>
        <span>
          {this.convertToTime(time)}
        </span>
      </button>
    );
  }

  displayAverages(ao5, ao12) {
    return (
      <div>
        <div className="quarter">
          <button>
            <span>
              {this.convertToTime(ao5)}
            </span>
          </button>
        </div>
        <div className="quarter">
          <button>
            <span>
              {this.convertToTime(ao12)}
            </span>
          </button>
        </div>
      </div>
    );
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


  render() {
    const av = this.convertToTime(this.props.average);
    const history = this.props.log.slice();
    // history.reverse();
    if (!this.props.cube_mode) {
      const times = history.map((item, step) => {
        return (
          <li key={step}>
            {this.displayLogEntry(item.res.time)}
          </li>
        )
      });
      return (
        <div>
          <h4>Times</h4>
          <ol>
            {times}
          </ol>
          <p><b>Average: {av}</b></p>
        </div>
      );
    } // else
    const times = history.map((item, step) => {
      return (
        <div className="list" key={step}>
          <div className="row">
            <div className="quarter">
              <button onClick={() => this.props.deleteEntry(step, 1)}>
                <span id="step">
                  {step + 1}
                </span>
                <span id="delete">
                  X
                </span>
              </button>
            </div>
            <div className="quarter">
              {this.displayLogEntry(item.res.time)}
            </div>
            {this.displayAverages(item.res.ao5, item.res.ao12)}
          </div>
        </div>
      )
    });
    return (
      <div className="results">
        <div className="statistics">
          <LogStats
            best={this.props.best}
            res={this.props.res}
            clearAll={() => this.props.clearAll()}
            downloadFile={(fileName, contentType) => this.props.downloadFile(fileName, contentType)}
          />
        </div>
        <div className="scroll" id="scroll">
          {times}
        </div>
        <div className="av">
          <b>Average: {av}</b>
        </div>
      </div>
    );

  }
}

export default Log;
