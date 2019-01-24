import React, { Component } from 'react';
import LogStats from './LogStats';
import DeleteModal from './modals/DeleteModal';
import TimeModal from './modals/TimeModal';
import './Log.css';

// Most of react-virtualized's styles are functional (eg position, size).
// Functional styles are applied directly to DOM elements.
// The Table component ships with a few presentational styles as well.
// They are optional, but if you want them you will need to also import the CSS file.
// This only needs to be done once; probably during your application's bootstrapping process.
import 'react-virtualized/styles.css'

// You can import any component you want as a named export from 'react-virtualized', eg
import { List } from 'react-virtualized'


class Log extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.renderlog || (this.props.reps !== nextProps.reps && this.props.stopped));
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
            theme={this.props.theme}
            id={item.res.id}
            deleteEntry={(id, x) => this.props.deleteEntry(id, x)}
            handleModal={() => this.props.handleModal()}
          />
        </div>
        <div className="quarter">
          <TimeModal
            theme={this.props.theme}
            res={item.res}
            handleModal={() => this.props.handleModal()}
          />
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

  displayLogEntry(res) {
    if (res.dnf) {
      return (
        <button>
          <span>
            DNF
          </span>
        </button>
      );
    }
    if (res.plus2) {
      return (
        <button>
          <span>
            {this.convertToTime(res.time) + '+'}
          </span>
        </button>
      );
    }
    return (
      <button>
        <span>
          {this.convertToTime(res.time)}
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


  render() {
    return (
      <div className="results">
        <div className="statistics">
          <LogStats
            best={this.props.best}
            res={this.props.res}
            reps={this.props.reps}
            sessions={this.props.sessions}
            session={this.props.session}
            theme={this.props.theme}
            clearAll={() => this.props.clearAll()}
            handleModal={() => this.props.handleModal()}
            addTime={(t) => this.props.addTime(t)}
            downloadFile={(fileName, contentType) => this.props.downloadFile(fileName, contentType)}
            uploadFile={(file) => this.props.uploadFile(file)}
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
  }
}

export default Log;
