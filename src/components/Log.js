import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogStats from './LogStats';
import DeleteModal from './modals/DeleteModal';
import TimeModal from './modals/TimeModal';
import AvModal from './modals/AvModal';
import './Log.css';
import './modals/TimeModal.css';
import './modals/AvModal.css';

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
    return (
      this.props.renderlog ||
      (this.props.reps !== nextProps.reps && this.props.stopped) ||
      (this.props.average !== nextProps.average && this.props.stopped) ||
      this.state.timeModalIsOpen !== nextState.timeModalIsOpen ||
      this.state.avModalIsOpen !== nextState.avModalIsOpen ||
      this.state.ao12ModalIsOpen !== nextState.ao12ModalIsOpen ||
      this.state.deleteModalIsOpen !== nextState.deleteModalIsOpen ||
      this.props.session !== nextProps.session
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      rowheight: 30,
      deleteModalIsOpen: false,
      timeModalIsOpen: false,
      avModalIsOpen: false,
      timeindex: null,
      av: null,
      howmany: 5,
      timeres: {
        id: 0,
        time: null,
        ao5: null,
        ao12: null,
        scramble: null,
        dnf: false,
        plus2: false,
      },
    }

    this.renderRow = this.renderRow.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.openTimeModal = this.openTimeModal.bind(this);
    this.closeTimeModal = this.closeTimeModal.bind(this);
    this.openAvModal = this.openAvModal.bind(this);
    this.closeAvModal = this.closeAvModal.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    if (window.innerWidth < 1080) {
      this.forceUpdate();
    }
  }

  openDeleteModal(i, res) {
    this.setState({
      timeindex: i,
      timeres: res,
      deleteModalIsOpen: true
    });
    this.props.handleModal();
  }

  closeDeleteModal() {
    this.setState({deleteModalIsOpen: false});
    this.props.handleModal();
  }

  openTimeModal(i, res) {
    this.setState({
      timeindex: i,
      timeres: res,
      timeModalIsOpen: true
    });
    this.props.handleModal();
  }

  closeTimeModal() {
    this.setState({timeModalIsOpen: false});
    this.props.handleModal();
  }

  openAvModal(i, res, av, howmany) {
    if (av) {
      this.setState({
        timeindex: i,
        timeres: res,
        av: av,
        howmany: howmany,
        avModalIsOpen: true
      });
      this.props.handleModal();
    }
  }

  closeAvModal() {
    this.setState({avModalIsOpen: false});
    this.props.handleModal();
  }

  handlePlus2(i, s) {
    this.props.handlePlus2(i);
    if (this.state.rowheight === 30) {
      this.setState({
        rowheight: 30.001
      });
    } else {
      this.setState({
        rowheight: 30
      });
    }
    this.forceUpdate();
    if (s) {
      this.handleDNF(i);
    }
  }

  handleDNF(i, s) {
    this.props.handleDNF(i);
    if (this.state.rowheight === 30) {
      this.setState({
        rowheight: 30.001
      });
    } else {
      this.setState({
        rowheight: 30
      });
    }
    this.forceUpdate();
    if (s) {
      this.handlePlus2(i);
    }
  }

  renderRow({ index, key, style }) {
    let item = this.props.log[index];
    return (
      <div key={key} style={style} className="row">
        <div className="quarter">
          <button onClick={() => this.openDeleteModal(index, item.res)}>
            <span id="step">
              {item.res.id}
            </span>
            <span id="delete">
              <FontAwesomeIcon icon="times" />
            </span>
        </button>
        </div>
        <div className="quarter">
          <button onClick={() => this.openTimeModal(index, item.res)}>
            {this.displayLogEntry(item.res)}
          </button>
        </div>
        <div className="quarter">
          <button onClick={() => this.openAvModal(index, item.res, item.res.ao5, 5)}>
            {this.convertToTime(item.res.ao5)}
          </button>
        </div>
        <div className="quarter">
          <button onClick={() => this.openAvModal(index, item.res, item.res.ao12, 12)}>
            {this.convertToTime(item.res.ao12)}
          </button>
        </div>
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
        <span>
          DNF
        </span>
      );
    }
    if (res.plus2) {
      return (
        <span>
          {this.convertToTime(res.time) + '+'}
        </span>
      );
    }
    return (
      <span>
        {this.convertToTime(res.time)}
      </span>
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


  render() {
    return (
      <div className="results">
        <div className="statistics">
          <LogStats
            best={this.props.best}
            res={this.props.log.length ? this.props.log[0].res : this.props.reps}
            log={this.props.log}
            reps={this.props.reps}
            sessions={this.props.sessions}
            session={this.props.session}
            theme={this.props.theme}
            clearAll={() => this.props.clearAll()}
            handleModal={() => this.props.handleModal()}
            openTimeModal={(i, s) => this.openTimeModal(i, s)}
            openAvModal={(i, s, r, h) => this.openAvModal(i, s, r, h)}
            addTime={(t) => this.props.addTime(t)}
            downloadFile={(fileName, contentType) => this.props.downloadFile(fileName, contentType)}
            uploadFile={(file) => this.props.uploadFile(file)}
            newSession={this.props.newSession}
            changeSession={(i) => this.props.changeSession(i)}
          />
        </div>
        <div className="singlemodal">
          <DeleteModal
            theme={this.props.theme}
            res={this.state.timeres}
            modalIsOpen={this.state.deleteModalIsOpen}
            openModal={this.openDeleteModal}
            closeModal={this.closeDeleteModal}
            deleteEntry={(id, x) => this.props.deleteEntry(id, x)}
          />
          <TimeModal
            theme={this.props.theme}
            index={this.state.timeindex}
            log={this.props.log}
            res={this.state.timeres}
            modalIsOpen={this.state.timeModalIsOpen}
            openModal={this.openTimeModal}
            closeModal={this.closeTimeModal}
            handlePlus2={(i, s) => this.handlePlus2(i, s)}
            handleDNF={(i, s) => this.handleDNF(i, s)}
          />
          <AvModal
            theme={this.props.theme}
            index={this.state.timeindex}
            log={this.props.log}
            res={this.state.timeres}
            av={this.state.av}
            howmany={this.state.howmany}
            modalIsOpen={this.state.avModalIsOpen}
            openModal={this.openAvModal}
            closeModal={this.closeAvModal}
          />
        </div>
        <div className="scroll">
          <List
            width={window.innerWidth}
            height={window.innerHeight}
            rowHeight={this.state.rowheight}
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
