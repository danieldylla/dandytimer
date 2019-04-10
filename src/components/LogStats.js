import React, { Component, } from 'react';
import ReactGA from 'react-ga';
import ClearModal from './modals/ClearModal';
import AddModal from './modals/AddModal';
import DownUpModal from './modals/DownUpModal';
import AboutModal from './modals/AboutModal';
import SessionModal from './modals/SessionModal';
import './LogStats.css';

class LogStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutModalIsOpen: false,
    }

    this.openAboutModal = this.openAboutModal.bind(this);
    this.closeAboutModal = this.closeAboutModal.bind(this);
  }

  openAboutModal() {
    this.setState({
      aboutModalIsOpen: true
    });
    this.props.handleModal();
    ReactGA.pageview('/about');
  }

  closeAboutModal() {
    this.setState({aboutModalIsOpen: false});
    this.props.handleModal();
    ReactGA.pageview('/');
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

  findAo5BestIndex(ao5) {
    var i;
    for (i = 0; i < this.props.log.length; i++) {
      if (ao5 === this.props.log[i].res.ao5) {
        return i;
      }
    }
  }

  findAo12BestIndex(ao12) {
    var i;
    for (i = 0; i < this.props.log.length; i++) {
      if (ao12 === this.props.log[i].res.ao12) {
        return i;
      }
    }
  }

  findAo50BestIndex(ao50) {
    var i;
    for (i = 0; i < this.props.log.length; i++) {
      if (ao50 === this.props.log[i].res.ao50) {
        return i;
      }
    }
  }

  findAo100BestIndex(ao100) {
    var i;
    for (i = 0; i < this.props.log.length; i++) {
      if (ao100 === this.props.log[i].res.ao100) {
        return i;
      }
    }
  }

  displayStats() {
    let ao5index = this.findAo5BestIndex(this.props.best.ao5);
    let ao12index = this.findAo12BestIndex(this.props.best.ao12);
    let ao50index = this.findAo50BestIndex(this.props.best.ao50);
    let ao100index = this.findAo100BestIndex(this.props.best.ao100);
    return(
      <div className="topstats">
        <div className="third" id="rowlabel">
          single
        </div>
        <button
          className="third"
          onClick={this.props.res ? () =>
            this.props.openTimeModal(0, this.props.res) : null}
        >
            {this.displaySingle(this.props.res)}
        </button>
        <button
          className="third"
          onClick={this.props.best.res ? () =>
            this.props.openTimeModal(this.props.log.length - this.props.best.res.id, this.props.best.res) : null}
        >
          {this.displaySingle(this.props.best.res)}
        </button>

        <div className="third" id="rowlabel">
          ao5
        </div>
        <button
          className="third"
          onClick={this.props.res.ao5 ? () =>
            this.props.openAvModal(0, this.props.res, this.props.res.ao5, 5) : null}
        >
          {this.convertToTime(this.props.res.ao5)}
        </button>
        <button
          className="third"
          onClick={this.props.best.ao5 ? () =>
            this.props.openAvModal(ao5index, this.props.log[ao5index].res,
              this.props.log[ao5index].res.ao5, 5) : null}
        >
          {this.convertToTime(this.props.best.ao5)}
        </button>

        <div className="third" id="rowlabel">
          ao12
        </div>
        <button
          className="third"
          onClick={this.props.res.ao12 ? () =>
            this.props.openAvModal(0, this.props.res, this.props.res.ao12, 12) : null}
        >
          {this.convertToTime(this.props.res.ao12)}
        </button>
        <button
          className="third"
          onClick={this.props.best.ao12 ? () =>
            this.props.openAvModal(ao12index, this.props.log[ao12index].res,
              this.props.log[ao12index].res.ao12, 12) : null}
        >
          {this.convertToTime(this.props.best.ao12)}
        </button>

        <div className="third" id="rowlabel">
          ao50
        </div>
        <button
          className="third"
          onClick={this.props.res.ao50 ? () =>
            this.props.openAvModal(0, this.props.res, this.props.res.ao50, 50) : null}
        >
          {this.convertToTime(this.props.res.ao50)}
        </button>
        <button
          className="third"
          onClick={this.props.best.ao50 ? () =>
            this.props.openAvModal(ao50index, this.props.log[ao50index].res,
              this.props.log[ao50index].res.ao50, 50) : null}
        >
          {this.convertToTime(this.props.best.ao50)}
        </button>

        <div className="third" id="rowlabel">
          ao100
        </div>
        <button
          className="third"
          onClick={this.props.res.ao100 ? () =>
            this.props.openAvModal(0, this.props.res, this.props.res.ao100, 100) : null}
        >
          {this.convertToTime(this.props.res.ao100)}
        </button>
        <button
          className="third"
          onClick={this.props.best.ao100 ? () =>
            this.props.openAvModal(ao100index, this.props.log[ao100index].res,
              this.props.log[ao100index].res.ao100, 100) : null}
        >
          {this.convertToTime(this.props.best.ao100)}
        </button>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="logstats">
          <h4 onClick={this.openAboutModal}>dandytimer</h4>
          <AboutModal
            theme={this.props.theme}
            modalIsOpen={this.state.aboutModalIsOpen}
            openModal={this.openAboutModal}
            closeModal={this.closeAboutModal}
          />
          <SessionModal
            theme={this.props.theme}
            sessions={this.props.sessions}
            session={this.props.session}
            modalIsOpen={this.props.sessionModalIsOpen}
            openModal={this.props.openSessionModal}
            closeModal={this.props.closeSessionModal}
            newSession={this.props.newSession}
            changeSession={(i) => this.props.changeSession(i)}
            deleteSession={(i) => this.props.deleteSession(i)}
          />
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
                isSignedIn={this.props.isSignedIn}
                loading={this.props.loading}
                saving={this.props.saving}
                restoring={this.props.restoring}
                lastsave={this.props.lastsave}
                backupsave={this.props.backupsave}
                downloadFile={this.props.downloadFile}
                uploadFile={this.props.uploadFile}
                saveStateToFirebase={this.props.saveStateToFirebase}
                loadStateFromFirebase={this.props.loadStateFromFirebase}
                handleModal={() => this.props.handleModal()}
                restoreFirebaseBackup={this.props.restoreFirebaseBackup}
                undoSaveToFirebase={this.props.undoSaveToFirebase}
                undoLoadFromFirebase={this.props.undoLoadFromFirebase}
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
            <div className="quarter" id="sessclick" onClick={this.props.openSessionModal}>
              {this.props.session + 1}
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
