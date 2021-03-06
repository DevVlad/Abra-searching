import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import RadioButton from 'material-ui/RadioButton';
import TextFieldUnderline from 'material-ui/TextField';
import transitions from 'material-ui/styles/transitions.js';

import './App.css';
import CONSTANTS from './CONSTANTS.jsx';

class CheckboxField extends React.Component{
  static propTypes = {
    alias: PropTypes.string,
    label: PropTypes.string,
    checkedIcon: PropTypes.object,
    uncheckedIcon: PropTypes.object,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    value: PropTypes.bool,
    errorText: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  handleOnClick() {
    if (!this.props.value) {
      this.props.onChange(true)
    } else {
      this.props.onChange(false);
    }
  }

  handleOnBlur(e) {
    if (!this.props.value) {
      this.props.onBlur({checkboxValue: false, alias: this.props.alias});
    } else {
      this.props.onBlur({checkboxValue: this.props.value, alias: this.props.alias});
    }
  }

  handleError() {
    if (this.props.errorText || this.props.warnText) {
      return (
        <TextFieldUnderline
          id={`${this.props.alias}_errorTexting`}
          style={ {
            fontSize: 12,
            transition: transitions.easeOut(),
            transform: 'translate(42px, -40px)',
            width: '0px',
          } }
          errorStyle= { {color: this.props.errorText ? CONSTANTS.COLORS.error : CONSTANTS.COLORS.warning} }
          errorText={ this.props.errorText ? this.props.errorText : this.props.warnText }
        />
      );
    }
  }

	render() {
		return (
      <div id={ `checkbox_${this.props.alias}` } style={ {width: '100px'} }>
          <RadioButton
            checkedIcon={ this.props.checkedIcon }
            uncheckedIcon={this.props.uncheckedIcon }
            disabled={ this.props.disabled }
            onClick={ this.handleOnClick.bind(this) }
            onBlur={ this.handleOnBlur.bind(this) }
            label={ this.props.label }
            checked={ this.props.value }
          />
        { this.handleError() }
      </div>
		);
	}

};

export default CheckboxField;
