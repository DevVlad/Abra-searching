import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog.js';
import TextField from 'material-ui/TextField';
import SvgIcon from 'material-ui/SvgIcon';
import moment from 'moment';

import CONSTANTS from './CONSTANTS.jsx';

import './App.css';

const IconForTimePicker = (props) => {
  return (<SvgIcon
    color={ CONSTANTS.COLORS.disabled }
    hoverColor={ CONSTANTS.COLORS.info } { ...props}>
    <path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
  </SvgIcon>);
};

class TimeField extends React.Component{
  static propTypes = {
    alias: PropTypes.string,
    timeFormat: PropTypes.number,
    label: PropTypes.string,
    onBlur: PropTypes.func,
    disabled: PropTypes.bool,
    locale: PropTypes.string,
    value: PropTypes.object,
    enableMousePicker: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {toDisplay: ''};
    this.typing = false;
  }

  giveMeTime(elem) {
    let newDate = new Date();
    const day = newDate.getDate();
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const re = /\b(\d{1,2})(?:\D{0,}?(\d{1,2}))?(?:\D{0,}?([a-z]+))?/i;
    const result = re.exec(elem);
    let hours = parseInt(result[1]);
    let minutes = 0;
    let suffix;
    if (result[2]) minutes = parseInt(result[2]);
    if (result[3]) suffix = result[3];
    if (suffix) {
      if (suffix === 'pm') hours = hours + 12;
    }
    let subDate = new Date(year, month, day, hours, minutes)
    newDate = subDate;
    return newDate;
  }

  getFormatedTime(date) {
    let formatForMoment;
    if (this.props.timeFormat === 12) {
      formatForMoment = 'h:mm a';
    } else {
      formatForMoment = 'HH:mm';
    }
    return moment.parseZone(date).format(formatForMoment);
  }

  componentWillUpdate(newProps) {
    if (!this.typing && newProps.value) {
      const momentTime = this.getFormatedTime(e);
      if (this.state.toDisplay !== momentTime) {
        this.initTime = newProps.value;
        this.setState({toDisplay: momentTime});
      }
    }
  }

  handleOnBlur(e) {
    const elem = e.target.value;
    this.typing = false;
    if (elem) {
      const outputDate = this.giveMeTime(elem);
      const momentTime = this.getFormatedTime(outputDate);
      this.initTime = outputDate;
      this.props.onBlur(outputDate);
      if (this.state.toDisplay !== momentTime) this.setState({toDisplay: momentTime});
    }

  }

  handleOnClick() {
    this.refs.timePicker.show();
  }

  handleOnChange(e) {
    this.typing = true;
    this.setState({toDisplay: e.target.value});
  }

  handleOnChangeOfTimePicker(e) {
    this.typing = false;
    const momentTime = this.getFormatedTime(e);
    if (this.state.toDisplay !== momentTime) this.setState({toDisplay: momentTime});
    this.initTime = e;
    this.props.onBlur(e);
  }

  handleOnKeyDown(e) {
    if (e.keyCode === 13) {
      const outputDate = this.giveMeTime(e.target.value);
      this.initTime = outputDate;
      const momentTime = this.getFormatedTime(outputDate);
      if (this.state.toDisplay !== momentTime) this.setState({toDisplay: momentTime});
      this.props.onChange(outputDate);
    }
  }

	render() {
		return (
      <div id="timefield">
        <TextField
            floatingLabelText={ this.props.label }
            errorText={ this.props.errorText}
            errorStyle={ {color: CONSTANTS.COLORS.error} }
            disabled={ this.props.disabled }
            underlineFocusStyle={ {color: CONSTANTS.COLORS.info} }
            onBlur={ this.handleOnBlur.bind(this) }
            onChange={ this.handleOnChange.bind(this) }
            value={ this.state.toDisplay }
            onKeyDown={this.handleOnKeyDown.bind(this)}
        />
        <IconForTimePicker
          style={ CONSTANTS.COMPONENT_ICONS_INLINE_STYLE }
          visibility={ this.props.enableMousePicker ? 'visible' : 'hidden' }
          onClick={ this.handleOnClick.bind(this) }
        />
        <TimePickerDialog
            ref="timePicker"
            format={ this.props.timeFormat === 24 ? '24hr' : 'ampm' }
            onAccept={ this.handleOnChangeOfTimePicker.bind(this) }
            initialTime={ this.initTime }
        />
      </div>
		);
	}

};

export default TimeField;
