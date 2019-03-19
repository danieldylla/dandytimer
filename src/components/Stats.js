import React, { Component } from 'react';
import ReactChartkick, { LineChart } from 'react-chartkick';
import Chart from 'chart.js';

import './Stats.css';

ReactChartkick.addAdapter(Chart);


class Stats extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.renderlog ||
      this.props.show_stats !== nextProps.show_stats ||
      this.props.reps > nextProps.reps ||
      this.state.tab !== nextState.tab ||
      this.props.session !== nextProps.session
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
    this.displayGraph = this.displayGraph.bind(this);
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

  }

  displayTab() {
    if (this.state.tab === 1) {
      return this.displayGraph();
    } else if (this.state.tab === 2) {
      return this.displayDist();
    }
  }

  render() {
    return (
      <div>
        {this.props.show_stats ?
            <div className="StatsModal">
              {this.displayTab()}
            </div>
        : null}
      </div>
    );

  }
}

export default Stats;
