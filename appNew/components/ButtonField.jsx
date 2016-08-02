import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import CONSTANTS from './CONSTANTS.jsx';
import TextFieldUnderline from 'material-ui/TextField';
import transitions from 'material-ui/styles/transitions.js';

import './App.css';

class ButtonField extends React.Component{
  static propTypes = {
    alias: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func,
    buttonValue: PropTypes.string,
    backgroundColor: PropTypes.oneOf(Object.keys(CONSTANTS.COLORS)),
    icon: PropTypes.object,
    onBlur: PropTypes.func,
    onMouseEnter: PropTypes.func,
    errorText: PropTypes.string,
    warnText: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  handleError() {
    if (this.props.errorText || this.props.warnText) {
      const notifMsg = this.props.errorText ? this.props.errorText : this.props.warnText;
      const color = this.props.errorText ? CONSTANTS.COLORS.error : CONSTANTS.COLORS.warning;
      return (
        <TextFieldUnderline
          id={`${this.props.alias}_errorTexting`}
          style={ {
            position: 'relative',
            bottom: 1,
            fontSize: 12,
            lineHeight: '12px',
            color: { color },
            transition: transitions.easeOut(),
            transform: 'translateY(-20px)',
            width: 'inhereit'
          } }
          errorText={ notifMsg }
          disabled
        />
      );
    }
  }

	render() {
		return (
      <div id={`ButtonField_${this.props.alias}`} >
          <RaisedButton
            label={ this.props.label }
            primary={ this.props.buttonValue === 'primary' ? true : false }
            secondary={ this.props.buttonValue === 'secondary' ? true : false }
            disabled={ this.props.disabled }
            onClick={ this.props.onClick.bind(this) }
            backgroundColor={ !this.props.buttonValue && CONSTANTS.COLORS[this.props.backgroundColor] }
            icon={ this.props.icon }
            onBlur={ this.props.onBlur.bind(this) }
            onMouseEnter={ this.props.onMouseEnter.bind(this) }
          />
        <br/>
        { this.handleError() }
      </div>
		);
	}

};

export default ButtonField;
