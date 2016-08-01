import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';

import './App.css';
import CONSTANTS from './CONSTANTS.jsx';

class PasswordField extends React.Component{
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

  componentWillMount() {
    if (this.props.value && this.props.value !== this.state.toDisplay && typeof(this.props.value) === 'string') {
      this.setState({toDisplay: this.props.value});
    }
  }

  componentWillUpdate(newProps) {
    if (!this.typing && newProps.value && typeof(newProps.value) === 'string' && this.state.toDisplay !== newProps.value) this.setState({toDisplay: newProps.value});
  }

  handleOnBlur(e) {
    this.props.onBlur(this.state.toDisplay);
    this.typing = false;
  }

  handleOnChange(e) {
    if (!this.typing) this.typing = true;
    this.setState({toDisplay: e.target.value});
  }

	render() {
		return (
      <div id={`passwordfield_${this.props.alias}`}>
          <TextField
            type='password'
            floatingLabelText={ this.props.label }
            errorText={ this.props.errorText ? this.props.errorText : this.props.warnText }
            errorStyle={ {color: this.props.errorText ? CONSTANTS.COLORS.error : CONSTANTS.COLORS.warning} }
            disabled={ this.props.disabled }
            underlineFocusStyle={ {color: CONSTANTS.COLORS.info} }
            onBlur={ this.handleOnBlur.bind(this) }
            value={ this.state.toDisplay }
            onChange={ this.handleOnChange.bind(this) }
          />
      </div>
		);
	}

};

export default PasswordField;
