import React from 'react';
import { connect } from 'react-redux';
import { setFilter } from '../actions/actions.jsx';
import { stateSelectorList, stateSelectorFirstRecord } from '../selectors/selectors.jsx';
import { DropdownList, Multiselect } from 'react-widgets';

import './App.css';
import 'react-widgets/lib/less/react-widgets.less';

class whisperWidgets extends React.Component{
	constructor(props){
		super(props);
	}

  handleOnSelect(e, v) {
    console.log('selcted: ', e);
  }

  handleFilter(optionsItem, valueOfFilter) {
    return optionsItem;
  }

  handleOnChange(e) {
    this.props.dispatch(setFilter(e));
  }

	render() {
    this.list = [];
    this.list = this.props.hint.toJS().map(item => {
      return {
        'text': [item.prijmeni, item.jmeno].join(' '),
        'id': item.id,
        'body': {...item}
      }
    });

		return (
      <div id="whisperWidgets">
  			<h1>react-widgets</h1>
        <DropdownList
          placeholder='Search...'
          valueField='id' textField='text'
          data={this.list}
          caseSensitive={false}
          onSelect={this.handleOnSelect.bind(this)}
          filter={this.handleFilter.bind(this)}
          onSearch={this.handleOnChange.bind(this)}
        />
      </div>
		)
	}
}

function mapStateToProps(state) {
  return stateSelectorList(state)
}

const appConnect = connect(mapStateToProps)(whisperWidgets);
export default appConnect;
