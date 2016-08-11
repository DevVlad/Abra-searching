import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';

import './App.css';
import CONSTANTS from './CONSTANTS.jsx';

class NumberField extends React.Component {
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
		this.state = {
			typing: false,
			toDisplay: undefined
		};
	}

	componentWillMount() {
		if (this.props.value && this.props.value !== parseInt(this.state.toDisplay) && typeof(this.props.value) === 'number') {
			this.setState({ toDisplay: this.props.value });
		}
	}

	componentWillReceiveProps(newProps) {
		if (newProps.value && newProps.value !== parseInt(this.state.toDisplay) && typeof(newProps.value) === 'number' && !this.state.typing) {
			this.setState({ toDisplay: newProps.value });
		}
	}

	handleOnBlur(e) {
		if (this.props.onBlur) this.props.onBlur(parseInt(this.state.toDisplay));
		this.setState({
			typing: false,
			localErrorText: undefined,
		});
	}

	handleOnChange(e) {
		const rightInput = e.target.value.length > 0 ? this.validate(e.target.value) : true;
		if (rightInput) {
			if (this.props.onChange) this.props.onChange(parseInt(e.target.value));
			this.setState({ toDisplay: e.target.value, typing: true });
		} else {
			console.error(`Inserted input, ${e.target.value}, is not a number!`);
			this.setState({
				localErrorText: `Inserted input, ${e.target.value}, is not a number!`,
			});
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

export default NumberField;
