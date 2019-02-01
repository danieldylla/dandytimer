import React, { Component, Fragment } from 'react';
import ClearModal from './modals/ClearModal';
import AddModal from './modals/AddModal';
import DownUpModal from './modals/DownUpModal';
import './LogStats.css';

class LogStats extends Component {

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

  convertToTime(s) {
    if (s === 'dnf') {
      return ('DNF');
    }
    if (s === 0 || s === null || this.props.reps === 0) {
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

  displaySingle(res) {
    if (res === null) {
      return('-');
    }
    if (res.plus2) {
      return (this.convertToTime(res.time) + '+');
    }
    return (
      <div>
        {this.convertToTime(res.time)}
      </div>
    );
  }

  displaySession() {

    return (
      <p></p>
    );
  }

  displayStats() {
    return(
      <div className="topstats">
        <div className="third" id="rowlabel">
          single
        </div>
        <div className="third">
          {this.displaySingle(this.props.res)}
        </div>
        <div className="third">
          {this.displaySingle(this.props.best.res)}
        </div>

        <div className="third" id="rowlabel">
          ao5
        </div>
        <div className="third">
          {this.convertToTime(this.props.res.ao5)}
        </div>
        <div className="third">
          {this.convertToTime(this.props.best.ao5)}
        </div>

        <div className="third" id="rowlabel">
          ao12
        </div>
        <div className="third">
          {this.convertToTime(this.props.res.ao12)}
        </div>
        <div className="third">
          {this.convertToTime(this.props.best.ao12)}
        </div>
        <div className="third" id="rowlabel">
          ao50
        </div>
        <div className="third">
          {this.convertToTime(this.props.res.ao50)}
        </div>
        <div className="third">
          {this.convertToTime(this.props.best.ao50)}
        </div>
        <div className="third" id="rowlabel">
          ao100
        </div>
        <div className="third">
          {this.convertToTime(this.props.res.ao100)}
        </div>
        <div className="third">
          {this.convertToTime(this.props.best.ao100)}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="logstats">
          <h4>dandytimer</h4>
          <div className="third" id="columnlabel">
            <p></p>
          </div>
          <div className="third" id="columnlabel">
            current
          </div>
          <div className="third" id="columnlabel">
            best
          </div>
          {this.displayStats()}
          <div className="dothings">
            <div className="third" id="columnlabel">
              <AddModal
                theme={this.props.theme}
                addTime={(t) => this.props.addTime(t)}
                handleModal={() => this.props.handleModal()}
              />
            </div>
            <div className="third" id="columnlabel">
              <DownUpModal
                theme={this.props.theme}
                downloadFile={this.props.downloadFile}
                uploadFile={this.props.uploadFile}
                handleModal={() => this.props.handleModal()}
              />
            </div>
            <div className="third" id="columnlabel">
              <ClearModal
                theme={this.props.theme}
                clearAll={() => this.props.clearAll()}
                handleModal={() => this.props.handleModal()}
              />
            </div>
          </div>
          <div className = "toprow">
            <div className="quarter">
              {this.displaySession()}
            </div>
            <div className="quarter">
              time
            </div>
            <div className="quarter">
              ao5
            </div>
            <div className="quarter">
              ao12
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LogStats;
