import React, { Component } from 'react';
import LogStats from './LogStats';
import DeleteModal from './modals/DeleteModal';
import './Log.css';

// Most of react-virtualized's styles are functional (eg position, size).
// Functional styles are applied directly to DOM elements.
// The Table component ships with a few presentational styles as well.
// They are optional, but if you want them you will need to also import the CSS file.
// This only needs to be done once; probably during your application's bootstrapping process.
import 'react-virtualized/styles.css'

// You can import any component you want as a named export from 'react-virtualized', eg
import { Column, Table, List, InfiniteLoader } from 'react-virtualized'


class Log extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return ((this.props.reps !== nextProps.reps
      || this.props.cube_mode !== nextProps.cube_mode
      || this.props.log[this.props.reps] !== this.props.res)
      && !this.props.running
    );
  }

  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
  }



  renderRow({ index, key, style }) {
    let item = this.props.log[index];
    return (
      <div key={key} style={style} className="row">
        <div className="quarter">

          <DeleteModal
            id={item.res.id}
            deleteEntry={(id, x) => this.props.deleteEntry(id, x)}
            handleModal={() => this.props.handleModal()}
          />
        </div>
        <div className="quarter">
          {this.displayLogEntry(item.res.time)}
        </div>
        {this.displayAverages(item.res.ao5, item.res.ao12)}
      </div>
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

  handleDelete(id) {
    this.props.deleteEntry(id, this.state.x);
    this.closeModal();
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
    return (
      <div className="results">
        <div className="statistics">
          <LogStats
            best={this.props.best}
            res={this.props.res}
            sessions={this.props.sessions}
            session={this.props.session}
            clearAll={() => this.props.clearAll()}
            handleModal={() => this.props.handleModal()}
            addTime={(t) => this.props.addTime(t)}
            downloadFile={(fileName, contentType) => this.props.downloadFile(fileName, contentType)}
          />
        </div>
        <div className="scroll">
          <List
            width={window.innerWidth}
            height={window.innerHeight}
            rowHeight={30}
            rowRenderer={this.renderRow}
            rowCount={this.props.log.length}
            overscanRowCount={5}
          />
        </div>
        <div className="av">
          <b>Average: {this.convertToTime(this.props.average)}</b>
        </div>
      </div>
    );
    /*
    const av = this.convertToTime(this.props.average);
    const history = this.props.log.slice();
    if (this.props.new_on_top) {
      history.reverse();
    }
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
              <button onClick={() => this.handleDelete(this.props.id)}>
                {item.res.id}
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
            sessions={this.props.sessions}
            session={this.props.session}
            clearAll={() => this.props.clearAll()}
            handleModal={() => this.props.handleModal()}
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
    */
  }
}

export default Log;
