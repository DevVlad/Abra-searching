import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';

import './App.css';
import CONSTANTS from './CONSTANTS.jsx';

class NumberField extends React.Component{
  static propTypes = {
    alias: PropTypes.string,
    label: PropTypes.string,
    errorText: PropTypes.string,
    warnText: PropTypes.string,
    disabled: PropTypes.bool,
    onBlur: PropTypes.func,
    value: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.typing = false;
    this.state = {
      toDisplay: undefined
    };
  }

  componentWillMount() {
    if (this.props.value && this.props.value !== this.state.toDisplay && typeof(this.props.value) === 'number') {
      this.setState({toDisplay: this.props.value});
    }
  }

  componentWillUpdate(newProps) {
    if (newProps.value && newProps.value !== this.state.toDisplay && typeof(newProps.value) === 'number' && !this.typing) {
      this.setState({toDisplay: newProps.value});
    }
  }

  handleOnBlur(e) {
    this.props.onBlur(parseInt(this.state.toDisplay));
    this.typing = false;
  }

  handleOnChange(e) {
    if (!this.typing) this.typing = true;
    const rightInput = this.validate(e.target.value);
    if (rightInput && this.typing) {
      this.setState({toDisplay: e.target.value});
    } else {
      console.error(`Inserted input, ${e.target.value}, is not a number!`);
    }

  }

  validate(input) {
    const re = /.*\b(\d+)/i;
    const result = re.exec(input);
    return result[1] === input;
  }

	render() {
		return (
      <div id={`numberfield_${this.props.alias}`}>
          <TextField
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

export default NumberField;
