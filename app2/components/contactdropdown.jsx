import React from 'react';
import { connect } from 'react-redux';
import { setFilter } from '../logic/logic.jsx';
import { stateSelectorListAlias, stateSelectorList } from '../selectors/selectors.jsx';
import { DropdownList } from 'react-widgets';

import './App.css';
import 'react-widgets/lib/less/react-widgets.less';

class ContactDropdown extends React.Component{
	constructor(props){
		super(props);
	}

  handleOnSelect(e, v) {
    console.log('selected: ', this.props.alias, e);
  }

  handleOnSearch(e) {
    console.log('search: ', this.props.alias, 'elem: ',e.length)
    if (e.length > 0) {
      this.props.dispatch(setFilter(e, this.props.alias));
    }
    // this.props.dispatch(setFilter(e, this.props.alias));
  }

	render() {
    this.list = [];
    this.list = this.props[this.props.alias].hint.toJS().map(item => {
      return {
        'text': [item.prijmeni, item.jmeno].join(' '),
        'id': item.id,
        'body': {...item}
      }
    });

		return (
      <div id="ContactDropdown">
  			<h1>ContactDropdown {this.props.alias}</h1>
        <DropdownList
          placeholder='Search...'
          valueField='id' textField='text'
          data={this.list}
          busy={this.props[this.props.alias].loading}
          caseSensitive={false}
          onSelect={this.handleOnSelect.bind(this)}
          filter={item => item}
          onSearch={this.handleOnSearch.bind(this)}
        />
      </div>
		)
	}
}

function mapStateToProps(state, props) {
	return stateSelectorListAlias(state, props.alias);
}

const appConnect = connect(mapStateToProps)(ContactDropdown);
export default appConnect;
