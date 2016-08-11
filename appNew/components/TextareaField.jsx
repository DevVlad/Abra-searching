import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';

import './App.css';
import CONSTANTS from './CONSTANTS.jsx';

class TextareaField extends React.Component {
	static propTypes = {
		alias: PropTypes.string,
		label: PropTypes.string,
		errorText: PropTypes.string,
		warnText: PropTypes.string,
		disabled: PropTypes.bool,
		onBlur: PropTypes.func,
		value: PropTypes.string
	};

	constructor(props) {
		super(props);
		this.state = {
			typing: false,
			toDisplay: ''
		};
	}

	componentWillMount() {
		if (this.props.value && this.props.value !== this.state.toDisplay && typeof(this.props.value) === 'string') {
			this.setState({ toDisplay: this.props.value });
		}
	}

	componentWillReceiveProps(newProps) {
		if (!this.state.typing && newProps.value && typeof(newProps.value) === 'string' && this.state.toDisplay !== newProps.value) this.setState({ toDisplay: newProps.value });
	}

	handleOnBlur(e) {
		if (this.props.onBlur) this.props.onBlur(this.state.toDisplay);
		this.setState({
			typing: false,
			localErrorText: undefined,
		});
	}

	handleOnChange(e) {
		if (this.props.onChange) this.props.onChange(e.target.value);
		this.setState({ toDisplay: e.target.value, typing: true });
	}

	render() {

		return (
			<div id={`textField_${this.props.alias}`}>
				<TextField
					floatingLabelText={ this.props.label }
					errorText={ this.props.errorText ? this.props.errorText : this.props.warnText }
					errorStyle={ { color: this.props.errorText ? CONSTANTS.COLORS.error : CONSTANTS.COLORS.warning } }
					disabled={ this.props.disabled }
					underlineFocusStyle={ { color: CONSTANTS.COLORS.info } }
					onBlur={ this.handleOnBlur.bind(this) }
					value={ this.state.toDisplay }
					multiLine={ true }
					disabled={ this.props.disabled }
					textareaStyle={ { height: '125px' } }
					rowsMax={5}
					onChange={ this.handleOnChange.bind(this) }
				/>
			</div>
		);
	}

}

export default TextareaField;
