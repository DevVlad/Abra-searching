import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import { orange500, blue500 } from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './App.css';

class TextFieldNew extends React.Component{
  static propTypes = {
    alias: PropTypes.string,
    label: PropTypes.string,
    errorText: PropTypes.string,
    disabled: PropTypes.bool,
    onBlur: PropTypes.func,
    value: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.typing = false;
    this.state = {
      toDisplay: ''
    };
  }

  componentWillUpdate(newProps) {
    if (!this.typing && newProps.value && this.state.toDisplay !== newProps.value) this.setState({toDisplay: this.state.props.value});
  }

  handleOnBlur(e) {
    this.props.onBlur(e);
    this.typing = false;
  }

  handleOnChange(e) {
    if (!this.typing) this.typing = true;
    this.setState({toDisplay: e.target.value});
  }

	render() {

		return (
      <div id={`textField_${this.props.alias}`}>
          <TextField
            floatingLabelText={ this.props.label }
            errorText={ this.props.errorText}
            errorStyle={ {color: orange500} }
            disabled={ this.props.disabled }
            underlineFocusStyle={ {color: blue500} }
            onBlur={ this.handleOnBlur.bind(this) }
            value={ this.state.toDisplay }
            onChange={ this.handleOnChange.bind(this) }
          />
      </div>
		);
	}

};

export default TextFieldNew;
