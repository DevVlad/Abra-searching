import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import CONSTANTS from './CONSTANTS.jsx';

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
    onMouseEnter: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

	render() {
		return (
      <div id={`ButtonField_${this.props.alias}`}>
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
      </div>
		);
	}

};

export default ButtonField;
