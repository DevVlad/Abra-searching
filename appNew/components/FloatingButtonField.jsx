import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextFieldUnderline from 'material-ui/TextField';
import transitions from 'material-ui/styles/transitions.js';

import CONSTANTS from './CONSTANTS.jsx';

import './App.css';

class FloatingButtonField extends React.Component{
  static propTypes = {
    alias: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func,
    backgroundColor: PropTypes.oneOf(Object.keys(CONSTANTS.COLORS)),
    icon: PropTypes.object,
    onBlur: PropTypes.func,
    onMouseEnter: PropTypes.func,
    errorText: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  handleError() {
    if (this.props.errorText) {
      return (
        <TextFieldUnderline
          id={`${this.props.alias}_errorTexting`}
          style={ {
            position: 'relative',
            display: this.props.errorText ? '' : 'none',
            bottom: 1,
            fontSize: 12,
            lineHeight: '12px',
            color: CONSTANTS.COLORS.error,
            transition: transitions.easeOut(),
            transform: 'translateY(-30px)',
            width: 'inhereit'
          } }
          errorText={ this.props.errorText }
          disabled
        />
      );
    }
  }

	render() {
		return (
      <div id={`FloatingButtonField_${this.props.alias}`}>
          <FloatingActionButton
            label={ this.props.label }
            disabled={ this.props.disabled }
            onClick={ this.props.onClick.bind(this) }
            onMouseEnter={ this.props.onMouseEnter.bind(this) }
            backgroundColor={ !this.props.buttonValue && CONSTANTS.COLORS[this.props.backgroundColor] }
            onBlur={ this.props.onBlur.bind(this) }
          >{ this.props.icon }</FloatingActionButton>
        { this.handleError() }
      </div>
		);
	}

};

export default FloatingButtonField;
