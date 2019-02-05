import React, { Component } from 'react';
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactChartkick, { LineChart } from 'react-chartkick';
import Chart from 'chart.js';

import './Stats.css';

ReactChartkick.addAdapter(Chart);


class Stats extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !this.props.running
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      tab: 1,
    };

    this.handleGraph = this.handleGraph.bind(this);
    this.handleDist = this.handleDist.bind(this);
    this.handleStats = this.handleStats.bind(this);
  };

  handleGraph() {
    this.setState({
      tab: 1,
    });
  }

  handleDist() {
    this.setState({
      tab: 2,
    });
  }

  handleStats() {
    this.setState({
      tab: 3,
    });
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

  displayGraph() {
    let log = this.props.log.slice();
    log.reverse();
    let times = {};
    let av5s = {};
    let av12s = {};
    log.map((item, i) => {
      let intstep = i + 1;
      let step = intstep.toString();
      times[step] = this.convertToTime(item.res.time);
      av5s[step] = this.convertToTime(item.res.ao5);
      av12s[step] = this.convertToTime(item.res.ao12);
    });
    let data = [
      {"name":"single", "data": times},
      {"name":"ao5", "data": av5s},
      {"name":"ao12", "data": av12s}
    ];
    return (
      <LineChart
        data={data}
        curve={false}
        legend="top"
        download={true}
        dataset={{borderWidth: 2}}
        points={false}
        colors={[
          this.props.theme.accent, this.props.theme.text, this.props.theme.texthighlighted
        ]}
      />
    );
  }

  displayDist() {

  }

  displayTab() {
    if (this.state.tab === 1) {
      return this.displayGraph();
    } else if (this.state.tab === 2) {
      return this.displayDist();
    }
  }

  render() {
    console.log(this.state.tab);
    return (
      <div>
        <script src="https://www.gstatic.com/charts/loader.js"></script>
        <div className="stats" id="stats">
          {this.props.show_stats ?
            <button id="statsiconon" onClick={this.props.handleShowStats}>
              <FontAwesomeIcon icon="chart-pie" />
            </button>
          :
            <button id="statsicon" onClick ={this.props.handleShowStats}>
              <FontAwesomeIcon icon="chart-pie" />
            </button>
          }
        </div>
        {this.props.show_stats ?
            <div className="StatsModal">
              <div className="statpanel">
                {this.displayTab()}
              </div>
              <div className="stattab">
                {this.state.tab === 1 ?
                  <button className="tabbtnselected">
                    Graph
                  </button>
                :
                  <button className="tabbtn" onClick={this.handleGraph}>
                    Graph
                  </button>
                }
                {this.state.tab === 2 ?
                  <button className="tabbtnselected">
                    Dist
                  </button>
                :
                  <button className="tabbtn" onClick={this.handleDist}>
                    Dist
                  </button>
                }
                {this.state.tab === 3 ?
                  <button className="tabbtnselected">
                    Stats
                  </button>
                :
                  <button className="tabbtn" onClick={this.handleStats}>
                    Stats
                  </button>
                }
              </div>
            </div>
        : null}
      </div>
    );

  }
}

export default Stats;
