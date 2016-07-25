import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './App.css';

const ErrorCondition = true;

class MenuList extends React.Component{
  static propTypes = {
      alias: PropTypes.string,
      menuItems: PropTypes.array,
      onChange: PropTypes.func,
      errorText: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOnChange(e, i, v) {
    this.props.onChange(v);
  }

	render() {
    let items = this.props.menuItems.map( (x, k) => {
      return (
        <MenuItem key={k} value={x.text} primaryText={x.text} />
      );
    });

		return (
      <div id="MenuList">
  			<h1>MenuList: { this.props.alias }</h1>
        <SelectField
          value={ this.props.value }
          onChange={ this.handleOnChange.bind(this) }
          errorText={ ErrorCondition && this.props.errorText }
          errorStyle={ {color: 'orange'} }
        >{items}</SelectField>
      </div>
		);
	}

};

export default MenuList;
