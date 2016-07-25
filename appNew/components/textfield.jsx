import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import { orange500, blue500 } from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './App.css';

class TextFieldNew extends React.Component{
  constructor(props) {
    super(props);
    this.typing = false;
    this.state = {
      value: ''
    };
  }

  componentWillUpdate(newProps) {
    if (!this.typing && newProps.value && this.state.value !== newProps.value) this.setState({value: this.state.props.value});
  }

  handleOnBlur(e) {
    this.props.onBlur({textFieldValue: e.target.value, alias: this.props.alias});
    this.typing = false;
  }

  handleOnChange(e) {
    if (!this.typing) this.typing = true;
    this.setState({value: e.target.value});
  }

	render() {

		return (
      <div id="textField">
  			<h1>TextField: { this.props.alias }</h1>
          <TextField
            floatingLabelText={ this.props.label }
            errorText={ this.props.errorText}
            errorStyle={ {color: orange500} }
            disabled={ this.props.disabled }
            underlineFocusStyle={ {color: blue500} }
            onBlur={ this.handleOnBlur.bind(this) }
            value={ this.state.value }
            onChange={ this.handleOnChange.bind(this) }
          />
      </div>
		);
	}

};

export default TextFieldNew;
