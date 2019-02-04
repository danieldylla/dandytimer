import React, { Component } from 'react';
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactChartkick, { LineChart } from 'react-chartkick';
import Chart from 'chart.js';

import './Stats.css';

ReactChartkick.addAdapter(Chart);


class Stats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

  };

  openModal() {
    this.setState({
      modalIsOpen: true
    });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({modalIsOpen: false});
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
      times[step] = item.res.time;
      av5s[step] = item.res.ao5;
      av12s[step] = item.res.ao12;
    });
    let data = [
      {"name":"single", "data": times},
      {"name":"ao5", "data": av5s},
      {"name":"ao12", "data": av12s}
    ];
    return (
      <LineChart data={data} />
    );
  }


  render() {
    return (
      <div>
        <button id="statsicon" onClick ={this.openModal}>
          <FontAwesomeIcon icon="chart-pie" />
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={() => {}}
          ariaHideApp={false}
          contentLabel="Example Modal"
          className="StatsModal"
          overlayClassName="StatsOverlay"
        >
          {this.displayGraph()}
          <div className="stats" id="stats">
            <button id="statsiconon" onClick ={this.closeModal}>
              <FontAwesomeIcon icon="chart-pie" />
            </button>
          </div>
        </Modal>
      </div>
    );

  }
}

export default Stats;
