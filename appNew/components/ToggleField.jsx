import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Toggle from 'material-ui/Toggle';
import TextFieldUnderline from 'material-ui/TextField';
import transitions from 'material-ui/styles/transitions.js';

import './App.css';
import CONSTANTS from './CONSTANTS.jsx';

const styles = {
	block: {
		maxWidth: 250,
	},
	toggle: {
		marginBottom: 16,
	},
};

class ToggleField extends React.Component {
	static propTypes = {
		alias: PropTypes.string,
		label: PropTypes.string,
		labelPosition: PropTypes.oneOf(['left', 'right']),
		disabled: PropTypes.bool,
		onBlur: PropTypes.func,
		onChange: PropTypes.func,
		toggledDefault: PropTypes.bool,
		warnText: PropTypes.string,
		errorText: PropTypes.string,
	};

	constructor(props) {
		super(props);
	}

	handleOnToggle(e) {
		this.props.onChange(this.refs.toggleButton);
	}

	handleOnBlur(e) {
		this.props.onBlur(this.refs.toggleButton);
	}

	handleError() {
		if (this.props.errorText || this.props.warnText) {
			return (
				<TextFieldUnderline
					id={`${this.props.alias}_errorTexting`}
					style={ {
						fontSize: 12,
						transition: transitions.easeOut(),
						transform: 'translate(46px, -60px)',
						width: '0px',
					} }
					errorStyle={ { color: this.props.errorText ? CONSTANTS.COLORS.error : CONSTANTS.COLORS.warning } }
					errorText={ this.props.errorText ? this.props.errorText : this.props.warnText }
					disabled
				/>
			);
		}
	}

	render() {
		return (
			<div style={styles.block}>
				<Toggle
					ref="toggleButton"
					alias={ this.props.alias }
					label={ this.props.label }
					labelPosition={ this.props.labelPosition }
					defaultToggled={ this.props.value }
					disabled={ this.props.disabled }
					style={ styles.toggle }
					onBlur={ this.handleOnBlur.bind(this) }
					onToggle={ this.handleOnToggle.bind(this) }
				/>
				{ this.handleError() }
			</div>
		);
	}

}

export default ToggleField;
