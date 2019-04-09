import React, { Component } from 'react';
import ReactChartkick, { LineChart, BarChart } from 'react-chartkick';
import Chart from 'chart.js';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

import './Stats.css';

ReactChartkick.addAdapter(Chart);

const options = [
  {value: 'graph', label: 'Line Graph', className: 'dropdown-item'},
  {value: 'dist', label: 'Distribution', className: 'dropdown-item'},
  {value: 'stats', label: 'Statistics', className: 'dropdown-item'}
]

class Stats extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      (this.props.renderlog && this.props.show_stats) ||
      this.props.show_stats !== nextProps.show_stats ||
      (this.props.reps > nextProps.reps && this.props.show_stats) ||
      (nextProps.reps - this.props.reps > 1 && this.props.show_stats) ||
      this.props.session !== nextProps.session ||
      this.props.stats_tab !== nextProps.stats_tab ||
      this.props.track_best_ao1000 !== nextProps.track_best_ao1000
    );
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  };

  handleChange(v) {
    if (v.value === 'graph') {
      this.props.handleStatsTab(1);
    } else if (v.value === 'dist') {
      this.props.handleStatsTab(2);
    } else if (v.value === 'stats') {
      this.props.handleStatsTab(3);
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

  shiftColor(hex, degrees){
    // Credit to Denis http://stackoverflow.com/a/36253499/4939630
    var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(function(l) { return parseInt(hex.length%2 ? l+l : l, 16); }).join(',') + ')';
    // Get array of RGB values
    rgb = rgb.replace(/[^\d,]/g, '').split(',');
    var r = rgb[0], g = rgb[1], b = rgb[2];
    // Convert RGB to HSL
    // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2.0;
    if(max === min) {
        h = s = 0;  //achromatic
    } else {
        var d = max - min;
        s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));
        if(max === r && g >= b) {
            h = 1.0472 * (g - b) / d ;
        } else if(max === r && g < b) {
            h = 1.0472 * (g - b) / d + 6.2832;
        } else if(max === g) {
            h = 1.0472 * (b - r) / d + 2.0944;
        } else if(max === b) {
            h = 1.0472 * (r - g) / d + 4.1888;
        }
    }
    h = h / 6.2832 * 360.0 + 0;
    // Shift hue to opposite side of wheel and convert to [0-1] value
    h+= degrees;
    if (h > 360) { h -= 360; }
    h /= 360;
    // Convert h s and l values into r g and b values
    // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
    if (s === 0){
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    // Convert r b and g values to hex
    rgb = b | (g << 8) | (r << 16);
    return "#" + (0x1000000 | rgb).toString(16).substring(1);
  }

  displayGraph() {
    let log = this.props.log.slice();
    log.reverse();
    let times = {};
    let av5s = {};
    let av12s = {};
    let worst = 0;
    for (let i = 0; i < log.length; i++) {
      if (log[i].res.time > worst) {
        worst = log[i].res.time;
      }
    }
    log.map((item, i) => {
      let intstep = i + 1;
      let step = intstep.toString();
      if (item.res.dnf) {
        times[step] = this.convertToTime(worst);
      } else {
        times[step] = this.convertToTime(item.res.time);
      }
      av5s[step] = this.convertToTime(item.res.ao5);
      av12s[step] = this.convertToTime(item.res.ao12);
      return null;
    });
    let data = [
      {"name":"single", "data": times},
      {"name":"ao5", "data": av5s},
      {"name":"ao12", "data": av12s}
    ];
    return (
      <div className="graphpanel">
        <LineChart
          data={data}
          curve={false}
          legend="top"
          download={true}
          dataset={{borderWidth: 2}}
          points={false}
          width="35vw"
          height="35vh"
          colors={[
            this.props.theme.accent,
            this.shiftColor(this.props.theme.accent, 60),
            this.shiftColor(this.props.theme.accent, 300)
          ]}
          min={null}
        />
      </div>
    );
  }

  displayDist() {
    let log = this.props.log.slice();
    if (!this.props.best.res || !this.props.average) {
      return;
    }
    let diff = this.props.average - this.props.best.res.time;
    let space = Math.round(diff / 3000);
    let xsmall = Math.round(this.props.best.res.time / 1000) * 1000;
    let small = xsmall + space * 1000;
    let medium = small + space * 1000;
    let large = medium + space * 1000;
    let xlarge = large + space * 1000;
    let overflow = xlarge + space * 1000;
    let xs = 0, s = 0, m = 0, l = 0, xl = 0, over = 0;
    for (var i = 0; i < log.length; i++) {
      if (log[i].res.dnf) {
        over++;
      } else {
        let res = log[i].res.time;
        if (res < small) {
          xs++;
        } else if (res < medium) {
          s++;
        } else if (res < large) {
          m++;
        } else if (res < xlarge) {
          l++;
        } else if (res < overflow) {
          xl++;
        } else {
          over++;
        }
      }
    }
    let data=[[xsmall/1000 + " - " + small/1000, xs],
              [small/1000 + " - " + medium/1000, s],
              [medium/1000 + " - " + large/1000, m],
              [large/1000 + " - " + xlarge/1000, l],
              [xlarge/1000 + " - " + overflow/1000, xl],
              [overflow/1000 + " +", over]];

    return (
      <div className="graphpanel">
        <BarChart
          data={data}
          download={true}
          width="35vw"
          height="35vh"
          colors={[
            this.props.theme.accent
          ]}
        />
      </div>
    );
  }

  displayStats() {
    if (!this.props.best.res || !this.props.log.length) {
      return;
    }
    let log = this.props.log.slice();
    let best = this.props.best.res.time;
    let worst = 0;
    let sdev = 0;
    let sum = 0;
    for (var i = 0; i < log.length; i++) {
      if (log[i].res.time > worst && !log[i].res.dnf) {
        worst = log[i].res.time;
      }
      if (!log[i].res.dnf) {
        sdev += Math.pow(log[i].res.time - this.props.average, 2);
        sum += log[i].res.time;
      }
    }
    sdev = sdev / this.props.validreps;
    sdev = Math.sqrt(sdev);
    let mo3 = null;
    let bestmo3 = 10000000000000000000;
    if (log.length > 2) {
      mo3 = (log[0].res.time + log[1].res.time + log[2].res.time) / 3;
      for (i = 0; i < log.length - 2; i++) {
        let temp = (log[i].res.time + log[i+1].res.time + log[i+2].res.time) / 3;
        if (temp < bestmo3) {
          bestmo3 = temp;
        }
      }
    }
    let ao1000 = 0;
    if (this.props.track_best_ao1000) {
      let best1000 = this.props.average * 10;
      let worst1000 = 0;
      if (log.length >= 1000) {
        for (i = 0; i < 1000; i++) {
          if (log[i].res.time < best1000) {
            best1000 = log[i].res.time;
          }
          if (log[i].res.time > worst1000) {
            worst1000 = log[i].res.time;
          }
          ao1000 += log[i].res.time;
        }
        ao1000 = (ao1000 - worst1000 - best1000) / 998;
      }
    }

    return (
      <div className="statpanel">
        <table className="stat-table">
          <tbody>
            <tr>
              <td id="stat">solves: {this.props.reps}</td>
              <td id="stat">average: {this.convertToTime(this.props.average)}</td>
              <td id="stat">total: {this.convertToTime(sum)}</td>
            </tr>
            <tr>
              <td id="stat">best: {this.convertToTime(best)}</td>
              <td id="stat">worst: {this.convertToTime(worst)}</td>
              <td id="stat">&sigma;: {this.convertToTime(sdev)}</td>
            </tr>
          </tbody>
          <br />
          <tbody>
            <tr>
              <th>  </th>
              <th>Current</th>
              <th>Best</th>
            </tr>
            <tr>
              <th>single</th>
              <td>{this.props.log.length ? this.convertToTime(this.props.log[0].res.time) : '-'}</td>
              <td>{this.props.best.res ? this.convertToTime(this.props.best.res.time) : '-'}</td>
            </tr>
            <tr>
              <th>mo3</th>
              <td>{this.convertToTime(mo3)}</td>
              <td>{this.convertToTime(bestmo3)}</td>
            </tr>
            <tr>
              <th>ao5</th>
              <td>{this.props.log.length ? this.convertToTime(this.props.log[0].res.ao5) : '-'}</td>
              <td>{this.props.best.ao5 ? this.convertToTime(this.props.best.ao5) : '-'}</td>
            </tr>
            <tr>
              <th>ao12</th>
              <td>{this.props.log.length ? this.convertToTime(this.props.log[0].res.ao12) : '-'}</td>
              <td>{this.props.best.ao12 ? this.convertToTime(this.props.best.ao12) : '-'}</td>
            </tr>
            <tr>
              <th>ao50</th>
              <td>{this.props.log.length ? this.convertToTime(this.props.log[0].res.ao50) : '-'}</td>
              <td>{this.props.best.ao50 ? this.convertToTime(this.props.best.ao50) : '-'}</td>
            </tr>
            <tr>
              <th>ao100</th>
              <td>{this.props.log.length ? this.convertToTime(this.props.log[0].res.ao100) : '-'}</td>
              <td>{this.props.best.ao100 ? this.convertToTime(this.props.best.ao100) : '-'}</td>
            </tr>
            <tr>
              <th>{this.props.track_best_ao1000 ? "ao1000" : null}</th>
              <td>{this.props.track_best_ao1000 ? this.convertToTime(ao1000) : null}</td>
              <td>{this.props.track_best_ao1000 ? this.convertToTime(this.props.bestAo1000) : null}</td>
            </tr>
          </tbody>
        </table>

      </div>
    );
  }

  displayTab() {
    if (this.props.stats_tab === 1) {
      return this.displayGraph();
    } else if (this.props.stats_tab === 2) {
      return this.displayDist();
    } else if (this.props.stats_tab === 3) {
      return this.displayStats();
    }
  }

  render() {
    console.log('rerendering stats');
    return (
      <div>
        {this.props.show_stats ?
          <div className="StatsModal">
            {this.displayTab()}
            <Dropdown
              className='dropdown'
              controlClassName='dropdown-ctrl'
              menuClassName='dropdown-menu'
              placeholderClassName='dropdown-place'
              options={options}
              value={options[this.props.stats_tab - 1]}
              onChange={(v) => this.handleChange(v)}
            />
          </div>
        : null}
      </div>
    );

  }
}

export default Stats;
