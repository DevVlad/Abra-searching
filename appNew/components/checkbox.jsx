import React from 'react';
import { connect } from 'react-redux';
import RadioButton from 'material-ui/RadioButton';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './App.css';

class CheckboxNew extends React.Component{
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

	render() {
		return (
      <div id="radiobutton">
  			<h1>CheckboxNew: { this.props.alias }</h1>
          <RadioButton
            checkedIcon={ this.props.checkedIcon }
            uncheckedIcon={this.props.uncheckedIcon }
            disabled={ this.props.disabled }
            onClick={ this.handleOnClick.bind(this) }
            onBlur={ this.handleOnBlur.bind(this) }
            label={ this.props.label }
            checked={ this.props.value }
          />
      </div>
		);
	}

};

export default CheckboxNew;
