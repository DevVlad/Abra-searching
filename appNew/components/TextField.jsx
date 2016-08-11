import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';

import './App.css';
import CONSTANTS from './CONSTANTS.jsx';

class TextFieldNew extends React.Component {
	static propTypes = {
		alias: PropTypes.string,
		label: PropTypes.string,
		errorText: PropTypes.string,
		warnText: PropTypes.string,
		disabled: PropTypes.bool,
		onBlur: PropTypes.func,
		value: PropTypes.string,
		password: PropTypes.bool,
	};

	constructor(props) {
		super(props);
		this.state = {
			toDisplay: '',
			typing: false,
		};
	}

	componentWillMount() {
		if (this.props.value && this.props.value !== this.state.toDisplay && typeof(this.props.value) === 'string') {
			this.setState({ toDisplay: this.props.value });
		}
	}

	componentWillUpdate(newProps) {
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
		const rightInput = e.target.value.length > 0 ? this.validate(e.target.value) : true;
		if (rightInput) {
			if (this.props.onChange) this.props.onChange(e.target.value);
			this.setState({ toDisplay: e.target.value, typing: true });
		} else {
			console.error(`Inserted input, ${e.target.value}, is not a string!`);
			this.setState({
				localErrorText: `Inserted input, ${e.target.value}, is not a string!`,
			});
		}
	}

	validate(input) {
		const re = /.*\b([a-zěščřžýáíéďňťůú]+)/i;
		const result = re.exec(input);
		return result[1] === input;
	}

	render() {

		return (
			<div id={`textField_${this.props.alias}`}>
				<TextField
					floatingLabelText={ this.props.label }
					type={ this.props.password ? 'password' : 'text' }
					errorText={ this.props.errorText ? this.props.errorText : this.props.warnText ? this.props.warnText : this.state.localErrorText }
					errorStyle={ { color: this.props.errorText || this.state.localErrorText ? CONSTANTS.COLORS.error : CONSTANTS.COLORS.warning } }
					disabled={ this.props.disabled }
					underlineFocusStyle={ { color: CONSTANTS.COLORS.info } }
					onBlur={ this.handleOnBlur.bind(this) }
					value={ this.state.toDisplay }
					onChange={ this.handleOnChange.bind(this) }
				/>
			</div>
		);
	}

}

export default TextFieldNew;
