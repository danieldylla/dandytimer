import React, { Component } from 'react';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactChartkick, { LineChart } from 'react-chartkick';
import Chart from 'chart.js';

import './AvModal.css';

ReactChartkick.addAdapter(Chart);

class AvModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graph: false,
    };

    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.convertToTime = this.convertToTime.bind(this);
    this.handleGraph = this.handleGraph.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  };

  afterOpenModal() {
  }

  handleFocus(event) {
    event.target.select();
  }

  handleGraph() {
    this.setState({
      graph: !this.state.graph,
    });
  }

  handleCloseModal() {
    this.setState({ graph: false });
    this.props.closeModal();
  }

  copyTime(text) {
    document.body.insertAdjacentHTML("beforeend","<div id=\"copy\" contenteditable>"+text+"</div>")
    document.getElementById("copy").focus();
    document.execCommand("selectAll");
    document.execCommand("copy");
    document.getElementById("copy").remove();
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

  displayScrambles(x) {
    const arr = this.props.log.slice(this.props.index, this.props.index + x);
    arr.reverse();
    let j = 0;
    while (arr[j].res.dnf && j < arr.length) {
      j++;
    }
    let best = arr[j].res.time;
    let worst = arr[0].res.time;
    let bestid = arr[j].res.id;
    let worstid = arr[0].res.id;
    let worstisdnf = arr[0].res.dnf;
    for (let i = j + 1; i < x; i++) {
      if (arr[i].res.time < best && !arr[i].res.dnf) {
        best = arr[i].res.time;
        bestid = arr[i].res.id;
      }
      if (!worstisdnf && arr[i].res.time > worst) {
        worst = arr[i].res.time;
        worstid = arr[i].res.id;
      }
    }
    const scrambles = arr.map((item, step) => {
      let isbest = (item.res.id === bestid);
      let isworst = (item.res.id === worstid);
      return (
        <tr key={step}>
          <td className="category-solve">
            {step + 1}
          </td>
          {(isbest || isworst) ?
            <td className="category-time">
              <span className="tableinfo">({this.displayLogEntry(item.res)})</span>
            </td>
          :
            <td className="category-time">
              <span className="tableinfo">{this.displayLogEntry(item.res)}</span>
            </td>
          }
          <td>
            <span className="tableinfo">{item.res.scramble}</span>
          </td>
        </tr>
      );
    });
    return (
      <div className="tableview">
        <table>
          <tbody>
            {this.state.graph ?
              <div className="graphview">
                {this.displayGraph(this.props.howmany)}
              </div>
              :
              <tr className="tablehead">
                <th className="category-solve"></th>
                <th className="category-time"> Time </th>
                <th> Scramble </th>
              </tr>
            }
            {scrambles}
          </tbody>
        </table>
      </div>
    );
  }

  displayGraph(x) {
    const arr = this.props.log.slice(this.props.index, this.props.index + x);
    arr.reverse();
    let times = {};
    let worst = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].res.time > worst) {
        worst = arr[i].res.time;
      }
    }
    arr.map((item, i) => {
      let intstep = i + 1;
      let step = intstep.toString();
      if (item.res.dnf) {
        times[step] = this.convertToTime(worst);
      } else {
        times[step] = this.convertToTime(item.res.time);
      }
      return null;
    });
    let data = [
      {"name":"single", "data": times},
    ];
    return (
      <div className="graphav">
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

  render() {
    const style = window.getComputedStyle(document.documentElement);
    let accent = style.getPropertyValue('--accent');
    const theme = createMuiTheme({
      typography: {
        useNextVariants: true,
      },
      palette: {
        primary: {
          main: accent,
          contrastText: this.props.theme.primary,
          dark: this.colorLuminance(accent, -.2),
          light: this.colorLuminance(accent, .2)
        },
        secondary: {
          main: this.colorLuminance(accent, -.3),
          contrastText: this.props.theme.primary,
          dark: this.colorLuminance(accent, -.5),
          light: this.colorLuminance(accent, -.1)
        }
      },
      shadows: Array(25).fill('none')
    });

    return (
      <div className="modal">
        {this.props.modalIsOpen ?
          <Modal
            isOpen={this.props.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.handleCloseModal}
            ariaHideApp={false}
            contentLabel="Example Modal"
            className="TimeModal"
            overlayClassName="TimeOverlay"
          >
            <div className="averageinfo">
              <h3 id="titleav">{this.convertToTime(this.props.av)}</h3>
              <br />
              <button className="avstats">
                {this.state.graph ?
                  <FontAwesomeIcon icon="chart-area" onClick={this.handleGraph} className="on" />
                  :
                  <FontAwesomeIcon icon="chart-area" onClick={this.handleGraph} className="off" />
                }
              </button>
              <div className="avinfo">
                {this.displayScrambles(this.props.howmany)}
              </div>
              <div className="avbuttons">
                <MuiThemeProvider theme={theme}>
                  <div className="copy">
                    <Button
                      onClick={() => this.copyTime(this.convertToTime(this.props.res.time))}
                      variant="outlined"
                      color="primary"
                      className="confirm"
                      tabIndex="1"
                    >
                      <FontAwesomeIcon icon="copy" />
                    </Button>
                  </div>
                  <div className="confirm">
                    <Button
                      onClick={this.handleCloseModal}
                      id="confirm"
                      variant="contained"
                      color="primary"
                      className="confirm"
                      tabIndex="2"
                    >
                      ok
                    </Button>
                  </div>
                </MuiThemeProvider>
              </div>
            </div>
          </Modal>
        : null}
      </div>
    );

  }
}

export default AvModal;
