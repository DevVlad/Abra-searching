import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import { orange500, blue500, grey500 } from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SvgIcon from 'material-ui/SvgIcon';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog.js';
import moment from 'moment';

import './App.css';

const IconForDatePicker = (props) => {
  return (<SvgIcon
    style={ { width: '20px', height: '20px' } }
    tooltip='select time'
    hoverColor={ blue500 }
    color={ grey500 } { ...props}>
    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
  </SvgIcon>);
};

const DATE_PART = { DAY: 'D', MONTH: 'M', YEAR: 'Y' };

const knownLocales = {};

const getDateParts = (locale) => {
	let result = knownLocales[locale] || [];
	if (result.length == 0) {
		const testDate = new Date(2000, 2 - 1, 3, 12);
		const text = Intl.DateTimeFormat(locale, {
			year: 'numeric', month: 'numeric', day: 'numeric'}).format(testDate);
		const re = /.*?(\d+)(?:\D+(\d+)(?:\D+(\d+))?)?.*/;
		const match = re.exec(text);
		for (let i = 1; i < 4; i++) {
			switch (parseInt(match[i])) {
				case 2000:
					result.push(DATE_PART.YEAR);
					break;
				case 2:
					result.push(DATE_PART.MONTH);
					break;
				case 3:
					result.push(DATE_PART.DAY);
					break;
			}
		}
		knownLocales[locale] = result;
	}
	return result;
};

const CENTURY_WINDOW = 20;

const fixCentury = (year) => {
	if (year > 100) {
		return year;
	}
	const thisYear = new Date().getFullYear();
	const edgeYear = thisYear + CENTURY_WINDOW;
	let result = Math.floor(thisYear / 100) * 100 + year;
	if (result > edgeYear) {
		result = result - 100;
	}
	return result;
};

const parseDate = (parts, text) => {
	const re = /.*?(\d+)(?:\D+(\d+)(?:\D+(\d+))?)?.*/;
	const match = re.exec(text);
	const now = new Date();
	let day = now.getDate()
	let month = now.getMonth() + 1
	let year = now.getFullYear();
	if (!match) {
		throw new Error('unparsed date ' + text);
	}
	if (!match[2]) {
		day = match[1];
	} else {
		parts.forEach((part, index) => {
			if (match[index + 1]) {
				switch (part) {
					case DATE_PART.DAY:
						day = match[index + 1];
						break;
					case DATE_PART.MONTH:
						month = match[index + 1];
						break;
					case DATE_PART.YEAR:
						year = fixCentury(parseInt(match[index + 1]));
						break;
					default:
						throw new Error('unknown part ' + part);
				}
			}
		});
	}
	return new Date(year, month - 1, day);
};

class DateField extends React.Component{
  static PropTypes: {
    alias: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    disabled: PropTypes.bool,
    value: PropTypes.object,
    enableMousePicker: PropTypes.bool,
    submitLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    locale: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.typing = false;
    this.state = {
      toDisplay: ''
    };
  }

  componentWillUpdate(newProps) {
    if (newProps.value && !this.typing && newProps.locale)  {
      const newDate = Intl.DateTimeFormat(newProps.locale).format(newProps.value);

      if (this.state.toDisplay !== newDate && !newProps.displayFormat) {
        this.setState( {toDisplay: newDate} );
      } else if (newProps.displayFormat) {
        const formatedDate = moment.parseZone(newProps.value).format(this.props.displayFormat);
        if (this.state.toDisplay !== formatedDate) this.setState( {toDisplay: formatedDate} );
      }
    }
  }

  handleOnClick() {
    this.refs.DatePickerDialog.show();
  }

  handleOnKeyDown(e) {
    if (e.keyCode === 13) {
      const elem = e.target.value;
      const newDate = parseDate(getDateParts(this.props.locale), elem);
      this.typing = false;
      this.props.onChange(newDate);
    }

  }

  handleOnBlur(e) {
    const elem = e.target.value;
    this.typing = false;
    // const newDate = parseDate(['D', 'M', 'Y'], elem);
    const newDate = parseDate(getDateParts(this.props.locale), elem);
    this.props.onBlur(newDate);
  }

  handleOnChangeOfDatePicker(e) {
    this.props.onBlur(e);
  }

  handleOnChange(e) {
    this.typing = true;
    this.setState({toDisplay: e.target.value});
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
              value={ this.state.toDisplay }
              onKeyDown={ this.handleOnKeyDown.bind(this) }
              onChange={ this.handleOnChange.bind(this) }
        />
        <IconForDatePicker
            visibility={ this.props.enableMousePicker ? 'visible' : 'hidden' }
            onClick={ this.handleOnClick.bind(this) }
        />
        <DatePickerDialog
          ref='DatePickerDialog'
          firstDayOfWeek={ 1 }
          onAccept={ this.handleOnChangeOfDatePicker.bind(this) }
          okLabel={ this.props.submitLabel }
          cancelLabel={ this.props.cancelLabel }
          DateTimeFormat={ global.Intl.DateTimeFormat }
          initialDate={ this.props.value }
          locale={ this.props.locale }
        />
      </div>
		);
	}

};

export default DateField;