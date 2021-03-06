import React from 'react';
import {Component} from 'relax-framework';

export default class NumberInput extends Component {
  limitValue (value) {
    if (this.props.min !== false) {
      if (value < this.props.min) {
        value = this.props.min;
      }
    }

    if (this.props.max !== false) {
      if (value > this.props.max) {
        value = this.props.max;
      }
    }

    return value;
  }

  onInput (event) {
    if (!isNaN(event.target.value)) {
      var val = this.limitValue(parseFloat(event.target.value, 10));
      this.props.onChange(isNaN(val) ? '' : val);
    }
  }

  up (event) {
    event.preventDefault();
    this.props.onChange(this.limitValue(this.props.value+1));
  }

  down (event) {
    event.preventDefault();
    this.props.onChange(this.limitValue(this.props.value-1));
  }

  onFocus () {
    this.setState({
      focused: true
    });
  }

  onBlur () {
    this.setState({
      focused: false
    });
  }

  onMouseDown (event) {
    event.preventDefault();

    this.startValue = this.props.value;
    this.startY = event.pageY;

    this.onMouseUpListener = this.onMouseUp.bind(this);
    this.onMouseMoveListener = this.onMouseMove.bind(this);
    document.addEventListener('mouseup', this.onMouseUpListener);
    document.addEventListener('mousemove', this.onMouseMoveListener);
  }

  onMouseMove (event) {
    event.preventDefault();

    const cof = 2;
    var amount = this.startY - event.pageY;

    this.props.onChange(this.limitValue(Math.round(this.startValue + amount/cof)));
  }

  onMouseUp (event) {
    document.removeEventListener('mouseup', this.onMouseUpListener);
    document.removeEventListener('mousemove', this.onMouseMoveListener);
  }

  render () {
    var className = 'number-input';
    var value = this.props.value;

    if (this.state.focused) {
      className += ' focused';
    }

    if (this.props.inactive) {
      value = '--';
    }

    return (
      <div className={className}>
        <input type='text' value={value} onChange={this.onInput.bind(this)} ref='input' onBlur={this.onBlur.bind(this)} onFocus={this.onFocus.bind(this)} />
        <span onMouseDown={this.onMouseDown.bind(this)}>{this.props.label}</span>
        <div className='arrows'>
          <a href='#' onClick={this.up.bind(this)}>
            <i className='fa fa-angle-up'></i>
          </a>
          <a href='#' onClick={this.down.bind(this)}>
            <i className='fa fa-angle-down'></i>
          </a>
        </div>
      </div>
    );
  }
}

NumberInput.propTypes = {
  value: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
  label: React.PropTypes.any,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  inactive: React.PropTypes.bool
};

NumberInput.defaultProps = {
  min: 0,
  max: false,
  label: 'px',
  inactive: false
};
