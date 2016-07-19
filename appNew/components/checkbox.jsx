import React from 'react';
import { connect } from 'react-redux';
import RadioButton from 'material-ui/RadioButton';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './App.css';

const style = {

};

class Checkbox extends React.Component{
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
      this.props.onBlur(false);
    } else {
      this.props.onBlur(this.props.value);
    }
  }

	render() {
		return (
      <div id="checkbox" style={ style }>
  			<h1>Checkbox: { this.props.alias }</h1>
          <RadioButton
            onClick={ this.handleOnClick.bind(this) }
            onBlur={ this.handleOnBlur.bind(this) }
            label={ this.props.label }
            checked={ this.props.value }
          />
      </div>
		);
	}

};

export default Checkbox;
