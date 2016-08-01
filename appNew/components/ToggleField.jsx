import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Toggle from 'material-ui/Toggle';

import './App.css';
const styles = {
  block: {
    maxWidth: 250,
  },
  toggle: {
    marginBottom: 16,
  },
};

class ToggleField extends React.Component{
  static propTypes = {
    alias: PropTypes.string,
    label: PropTypes.string,
    labelPosition: PropTypes.oneOf(['left', 'right']),
    disabled: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    toggledDefault: PropTypes.bool
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
      </div>
		);
	}

};

export default ToggleField;
