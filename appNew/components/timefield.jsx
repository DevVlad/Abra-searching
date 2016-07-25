import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog.js';
import TextField from 'material-ui/TextField';
import { orange500, blue500, grey500 } from 'material-ui/styles/colors';
import SvgIcon from 'material-ui/SvgIcon';
import moment from 'moment';

import './App.css';

const IconForTimePicker = (props) => {
  return (<SvgIcon
    style={ { width: '20px', height: '20px' } }
    tooltip='select time'
    color={ grey500 }
    hoverColor={ blue500 } { ...props}>
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

  componentWillUpdate(newProps) {
    if (!this.typing && newProps.value) {
      let formatForMoment;
      if (this.props.timeFormat === 24) {
        formatForMoment = 'HH:mm';
      } else {
        formatForMoment = 'h:mm a';
      }
      const momentTime = moment.parseZone(newProps.value).format(formatForMoment);
      if (this.state.toDisplay !== momentTime) this.setState({toDisplay: momentTime});
    }
  }

  handleOnBlur(e) {
    const elem = e.target.value;
    this.typing = false;
    if (elem) {
      let newDate = new Date();
      const day = newDate.getDate();
      const year = newDate.getFullYear();
      const month = newDate.getMonth();
      if (elem && this.props.timeFormat === 24) {
          if (elem.length === 1 || elem.length === 2) {
            let subDate = new Date(year, month, day, parseInt(elem), 0);
            newDate = subDate;
          } else if (elem.length === 4) {
            let subDate = new Date(year, month, day, parseInt(elem.slice(0, 2)), parseInt(elem.slice(-2)));
            newDate = subDate;
          }else if (elem.length === 3) {
            let subDate = new Date(year, month, day, parseInt(elem.slice(0, 1)), parseInt(elem.slice(-2)));
            newDate = subDate;
          }
      } else if (elem && this.props.timeFormat === 12) {
        //format of input d+\Dd+\D[a-z]+
        const re = /.*?(\d+)(?:\D(\d+)?(?:(\D+[a-z]+)?)).*/;
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
        }
      }
      this.props.onBlur(newDate);
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
    this.props.onBlur(e);
  }

  handleOnKeyDown(e) {
    if (e.keyCode === 13) this.refs.timePicker.show();
  }

	render() {
		return (
      <div id="timefield">
        <TextField
            floatingLabelText={ this.props.label }
            errorText={ this.props.errorText}
            errorStyle={ {color: orange500} }
            disabled={ this.props.disabled }
            underlineFocusStyle={ {color: blue500} }
            onBlur={ this.handleOnBlur.bind(this) }
            onChange={ this.handleOnChange.bind(this) }
            value={ this.state.toDisplay }
            onKeyDown={this.handleOnKeyDown.bind(this)}
        />
        <IconForTimePicker
          visibility={ this.props.enableMousePicker ? 'visible' : 'hidden' }
          onClick={ this.handleOnClick.bind(this) }
        />
        <TimePickerDialog
            ref="timePicker"
            format={ this.props.timeFormat === 24 ? '24hr' : 'ampm' }
            onAccept={ this.handleOnChangeOfTimePicker.bind(this) }
            initialTime={ this.props.value }
        />
      </div>
		);
	}

};

export default TimeField;
