import React, { Component } from 'react';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

import './Scramble.css';

const options = [
  {value: '2x2', label: '2x2x2', className: 'dropdown-item'},
  {value: '3x3', label: '3x3x3', className: 'dropdown-item'},
  {value: '4x4', label: '4x4x4', className: 'dropdown-item'},
  {value: '5x5', label: '5x5x5', className: 'dropdown-item'}
]

class Scramble extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  };

  handleChange(v) {
    this.props.handleCube(v.value);
  }

  render() {
    return (
      <div>
        <Dropdown
          className='scramble-dropdown'
          controlClassName='scramble-dropdown-ctrl'
          menuClassName='scramble-dropdown-menu'
          placeholderClassName='scramble-dropdown-place'
          arrowClassName='scramble-dropdown-arrow'
          options={options}
          value={this.props.cube}
          onChange={(v) => this.handleChange(v)}
        />
        <div className="scrambletext">
          {this.props.scramble}
        </div>
      </div>
    );

  }
}

export default Scramble;
