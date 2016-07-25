import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CONSTANTS from './CONSTANTS.jsx';

import './App.css';

class FloatingButtonField extends React.Component{
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
      <div id="FloatingButtonField">
          <FloatingActionButton
            label={ this.props.label }
            primary={ this.props.buttonValue === 'primary' ? true : false }
            secondary={ this.props.buttonValue === 'secondary' ? true : false }
            disabled={ this.props.disabled }
            onClick={ this.props.onClick.bind(this) }
            onMouseEnter={ this.props.onMouseEnter.bind(this) }
            backgroundColor={ !this.props.buttonValue && CONSTANTS.COLORS[this.props.backgroundColor] }
            onBlur={ this.props.onBlur.bind(this) }
          >{ this.props.icon }</FloatingActionButton>

      </div>
		);
	}

};

export default FloatingButtonField;
