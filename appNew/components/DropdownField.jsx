import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DropdownFieldDumb from './DropdownFieldDumb.jsx';
import SvgIcon from 'material-ui/SvgIcon';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import CONSTANTS from './CONSTANTS.jsx';

import './App.css';

const ClearIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </SvgIcon>
);

class DropdownField extends React.Component{
  static propTypes = {
    alias: PropTypes.string,
    label: PropTypes.string,
    entityName: PropTypes.string,
    errorText: PropTypes.string,
    warnText: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    entityId: PropTypes.number,
    entityToText: PropTypes.func,
    filterToCondition: PropTypes.func,
    loadingNotify: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      toDisplay: ''
    };
    this.list = [];
    this.typing = false;
    this.decideOpen = false;
  }


	render() {

		return (
      <div id="DropdownField">

      </div>
		);
	};

};

export default DropdownField;
