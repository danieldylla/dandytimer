import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import './Undo.css';


class Undo extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.undo();
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
    const theme = createMuiTheme({
      typography: {
        useNextVariants: true,
      },
      palette: {
        primary: {
          main: this.colorLuminance(this.props.theme.primary, .3),
          contrastText: this.props.theme.accent,
          dark: this.colorLuminance(this.props.theme.primary, .1),
          light: this.colorLuminance(this.props.theme.primary, .4)
        }
      },
      shadows: Array(25).fill('none')
    });
    return (
      <div className="undo">
        <MuiThemeProvider theme={theme}>
          <div className="undobtn">
            <Fab
              onClick={this.handleClick}
              variant="extended"
              color="primary"
              className="undofab"
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UNDO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Fab>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Undo;
