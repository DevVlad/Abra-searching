import React from 'react';
import { connect } from 'react-redux';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog.js';
import TextField from 'material-ui/TextField';
import {orange500, blue500, grey500 } from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SvgIcon from 'material-ui/SvgIcon';
import moment from 'moment';

import './App.css';

const IconForTimePicker = (props) => {
  return (<SvgIcon { ...props}>
    <path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
  </SvgIcon>);
};

class TimeField extends React.Component{
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.typing = false;
    if (this.props.timeFormat === 24) {
      this.formatForTimePicker = '24hr';
      this.timeFormat = 'HH:MM';
    } else {
      this.formatForTimePicker = 'ampm';
      this.timeFormat = 'h:mm a';
    }

  }

  componentWillUpdate(newProps) {
    if (!this.typing && newProps.value) {
      console.log(newProps.value);
      const momentTime = moment.parseZone(newProps.value).format(this.timeFormat);
      if (this.state.value !== momentTime) this.setState({value: momentTime});
    }
  }

  handleOnBlur(e) {
    const elem = e.target.value;
    this.typing = false;
    let newDate = new Date();
    const day = newDate.getDate();
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    if (elem && this.props.timeFormat === 24) {
        if (elem.length === 1 || elem.length === 2) {
          let subDate = new Date(year, month, day, parseInt(elem));
          newDate = subDate;
        } else if (elem.length === 4) {
          let subDate = new Date(year, month, day, parseInt(elem.slice(0, 2)), parseInt(elem.slice(-2)));
          newDate = subDate;
        }else if (elem.length === 3) {
          let subDate = new Date(year, month, day, parseInt(elem.slice(0, 1)), parseInt(elem.slice(-2)));
          newDate = subDate;
        }
    } else if (elem && this.props.timeFormat === 12) {
      // const re = /.*?(?:(\d+)?)(?:\D(?:(\d+)?)\D((?:[a-z]+))?)/;
      const re = /.*?(\d+)(?:\D(\d+)?(?:(\D+[a-z]+)?)).*/
      const match = re.exec(elem);
      let suffix = 0;
      let hours = 0;
      let minutes = 0;
      if (match) {
        if (match[3].split(' ').join('') !== 'am') suffix = 12;
        for (let i = 1; i < 3; i++) {
          if (match[i]) {
            switch(i) {
              case 1:
                hours = parseInt(match[i]);
                break;
              case 2:
                minutes = parseInt(match[i]);
                break;
            }
          }
        }
        let subDate = new Date(year, month, day, hours + suffix, minutes);
        newDate = subDate;
        console.log(match);
      }
    }

    this.props.onBlur(newDate);

  }

  handleOnClick() {
    this.refs.timePicker.show();
  }

  handleOnChange(e) {
    this.typing = true;
    this.setState({value: e.target.value});
  }

  handleOnChangeOfTimePicker(e) {
    this.typing = false;
    this.props.onBlur(e);
  }

  handleOnKeyDown(e) {
    if (e.keyCode === 13) this.refs.timePicker.show();
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
          format={ this.formatForTimePicker }
          onAccept={ this.handleOnChangeOfTimePicker.bind(this) }
      />
      <IconForTimePicker
          style={ { width: '20px', height: '20px' } }
          tooltip='select time'
          visibility={ this.props.enableMousePicker ? 'visible' : 'hidden' }
          color={ grey500 }
          hoverColor={ blue500 }
          onClick={ this.handleOnClick.bind(this) }
        />
      </div>
		);
	}

};

export default TimeField;
