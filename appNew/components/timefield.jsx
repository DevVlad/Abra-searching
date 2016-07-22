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
      const momentTime = moment.parseZone(newProps.value).format(this.timeFormat);
      if (this.state.value !== momentTime) this.setState({value: momentTime});

    }
  }

  handleOnBlur(e) {
    const elem = e.target.value;
    this.typing = false;
    let newDate = new Date();
    if (elem && this.props.timeFormat === 24) {
        if (elem.length === 1) {
          newDate.setHours(parseInt(elem));
        }else if (elem.length === 2) {
          newDate.setHours(parseInt(elem));
        } else if (elem.length === 4) {
          newDate.setHours(parseInt(elem.slice(0, 2)));
          newDate.setMinutes(parseInt(elem.slice(-2)));
        }else if (elem.length === 3) {
          newDate.setHours(parseInt(elem.slice(0, 1)));
          newDate.setMinutes(parseInt(elem.slice(-2)));
        }
    }
    console.log(newDate);
    // this.props.onBlur(newDate);



    // inserting just numbers
    // if (elem) {
    //   this.typing = false;
    //
    //   let pom = 0;
    //   let suffix = 0;
    //   let suffixAMPM = '';
    //   let firstPart = 0;
    //   let secondPart = 0;
    //   let time = new Date();
    //
    //   if (this.props.timeFormat === 24) {
    //     if (elem.length === 1 || elem.length === 2) {
    //       firstPart = elem;
    //       secondPart = '00';
    //     }
    //
    //     if (elem.length === 3) {
    //       firstPart = '0' + elem.slice(0, 1);
    //       secondPart = elem.slice(-2);
    //     }
    //
    //     if (elem.length === 4) {
    //       firstPart = elem.slice(0, 2);
    //       secondPart = elem.slice(-2);
    //     }
    //     time = time.setUTCHours(10)
    //     // time = time.setMinutes(17);
    //     // pom = firstPart + ':' + secondPart;
    //     console.log(time);
    //
    //     // this.props.onBlur({timeFieldValue: pom, alias: this.props.alias});
    //   }
    //
    //   if (this.props.timeFormat === 12) {
    //     if (elem.length === 1) {
    //       firstPart = elem;
    //       secondPart = '00';
    //       suffixAMPM = 'am';
    //     }
    //
    //     if (elem.length === 2) {
    //       firstPart = elem.slice(0, 2);
    //       if (firstPart < 12) {
    //         suffixAMPM = 'am';
    //       } else {
    //         suffixAMPM = 'pm';
    //         if (firstPart != 12) firstPart= firstPart - 12;
    //       }
    //       secondPart = '00';
    //     }
    //
    //     if (elem.length === 3) {
    //       firstPart = '0' + elem.slice(0, 1);
    //       secondPart = elem.slice(-2);
    //       if (firstPart < 12) {
    //         suffixAMPM = 'am';
    //       }
    //     }
    //
    //     if (elem.length === 4) {
    //       firstPart = elem.slice(0 , 2);
    //       if (firstPart < 12 || firstPart == 24) {
    //         suffixAMPM = 'am';
    //         if (firstPart == 24) firstPart = '00';
    //       } else {
    //         suffixAMPM = 'pm';
    //         if (firstPart != 12) {
    //           firstPart = firstPart - 12;
    //         }
    //       }
    //       secondPart = elem.slice(-2);
    //     }
    //
    //     pom = firstPart + ':' + secondPart + ' ' + suffixAMPM;
    //     console.log(pom);
    //     // this.props.onBlur({timeFieldValue: pom, alias: this.props.alias});
    //   }
    //
    // }

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
