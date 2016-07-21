import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import { orange500, blue500, grey500 } from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SvgIcon from 'material-ui/SvgIcon';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog.js';

import './App.css';

const IconForDatePicker = (props) => {
  return (<SvgIcon { ...props}>
    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
  </SvgIcon>);
};

const makeMeDate = (object) => {
  let myNewDate = {};
  const parsedInput = parse(object.string);
  if (Intl && object.locale && !object.format) {
    let x = parsedInput.separatedString.map(toInt =>  parseInt(toInt));
    let day = '';
    let month = '';
    let year = Math.max(...x);
    day = x[0];
    month=x[1];
    let utcDate = new Date(Date.UTC(year, month-1, day, 0, 0, 0));
    myNewDate = Intl.DateTimeFormat(object.locale).format(utcDate);
  }
  return myNewDate;
  // if (typeof(format) !== 'string') alert('Format must be a string!');
  // const parsedFormat = parse(format);
  //
  // let newDate = undefiend;
  // if (parsedInput) {
  //   if (parsedInput.separatedString[0] === parsedInput.separatedString[1]) newDate = new Date(Date.UTF(parsedInput.separatedString[2], parsedInput.separatedString[0], parsedInput.separatedString[1]));
  //
  // }
  // console.log(parsedFormat, parsedInput);
};

const parse = (string) => {
  const separators = [
    '.',
    '-',
    '/',
    ' ',
    ',',
    '. '
  ];
  let parsed = {};
  separators.forEach( separator => {
    let expr = new RegExp('\\b[0-9|D|M]{1,2}[\\' + separator + ']{'+ separator.length +'}[0-9|D|M]{1,2}[\\' + separator + ']{'+ separator.length +'}[0-9|Y]{1,4}', 'g');
    if (expr.test(string)) {
      parsed = ({separator: separator, pass: true, separatedString: string.split(separator), tested: string});
    }
  });
  if (parsed) {
    return parsed;
  } else alert('Choose another parser, or change input!');
};

class DateField extends React.Component{
  constructor(props) {
    super(props);
    this.typing = false;
    this.state = {
      value: ''
    };
    // this.patternDate = Intl.DateTimeFormat(this.props.locale).format(new Date(2012, 11, 25));
  }

  componentWillUpdate(newProps) {
    if (newProps.value && !this.typing && this.state.value !== newProps.value) this.setState( {value: newProps.value} )
  }

  handleOnClick() {
    this.refs.DatePickerDialog.show();
  }

  handleOnKeyDown(e) {

  }

  handleOnBlur(e) {
    const elem = e.target.value;
    if (elem) {
      let obj = {
        string: elem.toString(),
        // format: 'DD. MM. YYYY',
        locale: this.props.locale
      };
      let newDate = makeMeDate(obj);
      this.typing = false;
      this.props.onBlur({dateFieldValue: newDate, alias: this.props.alias});
      // let parsedPatternDate = getFormat(this.patternDate.toString());
      // console.log(parsedElem, parsedPatternDate);

      // console.log('prdel', new Intl.DateTimeFormat([this.props.locale]).format(patternDate), parsedObject);
    }
  }

  handleOnChangeOfDatePicker(e) {
    let newDate = new Intl.DateTimeFormat(this.props.locale).format(e);
    this.props.onBlur({dateFieldValue: newDate, alias: this.props.alias});
  }

  handleOnChange(e) {
    this.typing = true;
    this.setState({value: e.target.value});
  }

	render() {

		return (
      <div id="datefield">
  			<h1>DateField: { this.props.alias }</h1>
        <TextField
              floatingLabelText={ this.props.label }
              errorText={ this.props.errorText}
              errorStyle={ {color: orange500} }
              disabled={ this.props.disabled }
              underlineFocusStyle={ {color: blue500} }
              onBlur={ this.handleOnBlur.bind(this) }
              value={ this.state.value }
              onKeyDown={ this.handleOnKeyDown.bind(this) }
              onChange={ this.handleOnChange.bind(this) }
        />
        <IconForDatePicker
            style={ { width: '20px', height: '20px' } }
            tooltip='select time'
            visibility={ this.props.enableMousePicker ? 'visible' : 'hidden' }
            hoverColor={ blue500 }
            color={ grey500 }
            onClick={ this.handleOnClick.bind(this) }
        />
      <DatePickerDialog
        ref='DatePickerDialog'
        firstDayOfWeek={ 1 }
        onAccept={ this.handleOnChangeOfDatePicker.bind(this) }
        okLabel={ this.props.submitLabel }
        cancelLabel={ this.props.cancelLabel }
        DateTimeFormat={ global.Intl.DateTimeFormat }
        value={ this.state.value }
        locale={ this.props.locale }
      />
      </div>
		);
	}

};

export default DateField;
