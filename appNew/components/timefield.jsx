import React from 'react';
import { connect } from 'react-redux';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog.js';
import TextField from 'material-ui/TextField';
import {orange500, blue500} from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SvgIcon from 'material-ui/SvgIcon';

import './App.css';

const IconForTimePicker = (props) => (
  <SvgIcon {...props}>
    <path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
  </SvgIcon>
);

class TimeField extends React.Component{
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.typing = false;
    this.format = '24hr';
  }

  componentWillUpdate(newProps) {
    if (!this.typing && newProps.value && this.state.value !== newProps.value) this.setState({value: newProps.value});
    if (this.props.timeFormat === 24) {
      this.format = '24hr';
    } else {
      this.format = 'ampm';
    }
    console.log('willUpd', this.props.timeFormat,this.format);
  }

  handleOnBlur(e) {
    console.log('blur',e.target.value, this.format);
    if (e.target.value) {
      this.typing = false;
      let pom = 0;
      let suffix = 0;
      let suffixAMPM = '';
      if (this.props.timeFormat === 12) {
        suffix = 12;
      }

      if (e.target.value === 0 && this.props.timeFormat === 12) pom = '00:00'
      if (e.target.value.length === 2) pom = e.target.value-suffix + ":00";
      if (e.target.value.length === 4) {
        pom = e.target.value.slice(0, 2)-suffix + ':' + e.target.value.slice(-2);
      }
      if (e.target.value.length === 3) {
        let firstPart = e.target.value.slice(0, 2);
        if (firstPart < 10) {
          pom = firstPart + ":" + e.target.value.slice(-1);
        } else {
          pom = e.target.value.slice(0, 1) + ":" + e.target.value.slice(-2);
        }
      }
      console.log(pom);
      if (this.props.timeFormat === 12 && pom.split(':')[0] < 12) {
        suffixAMPM = ' am';
      } else if(this.props.timeFormat === 12 && pom.split(':')[0] > 12) {
        suffixAMPM = ' pm';
      }
      this.props.onBlur({timeFieldValue: pom + suffixAMPM, alias: this.props.alias});
      if (this.props.value === this.state.value) this.setState({clicked: false});
    }

  }

  handleOnClick() {
    this.refs.timePicker.show();
  }

  handleOnChange(e) {
    this.typing = true;
    this.setState({value: e.target.value});
  }

  handleOnChangeOfTimePicker(e) {
    let pom = '' + e + '';
    pom = pom.split(' ')[4].split(':').slice(0, -1).join(':');
    this.props.onBlur({timeFieldValue: pom, alias: this.props.alias});
  }

  handleOnKeyDown(e) {
    if (e.keyCode === 32) this.refs.timePicker.show();
  }

	render() {
		return (
      <div id="timefield">
  			<h1>TimeField: { this.props.alias }</h1>
        <TextField
            floatingLabelText={ this.props.label }
            errorText={ this.props.errorText}
            errorStyle={ {color: orange500} }
            disabled={ this.props.disabled }
            underlineFocusStyle={ {color: blue500} }
            onBlur={ this.handleOnBlur.bind(this) }
            onChange={ this.handleOnChange.bind(this) }
            value={ this.state.value }
            onKeyDown={this.handleOnKeyDown.bind(this)}
        />
      <TimePickerDialog
          ref="timePicker"
          format={ this.format }
          disabled={ true }
          onAccept={ this.handleOnChangeOfTimePicker.bind(this) }
        />
        <IconForTimePicker
          visibility={ this.props.enableMousePicker ? 'visible' : 'hidden' }
          color={ this.state.clicked ? blue500 : null }
          onClick={ this.handleOnClick.bind(this) }
        />
      </div>
		);
	}

};

export default TimeField;
