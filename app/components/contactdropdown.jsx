import React from 'react';
import { connect } from 'react-redux';
import { setFilter } from '../actions/actions.jsx';
import { stateSelectorListAlias, stateSelectorList } from '../selectors/selectors.jsx';
import { DropdownList } from 'react-widgets';

import './App.css';
import 'react-widgets/lib/less/react-widgets.less';

class ContactDropdown extends React.Component{
	constructor(props){
		super(props);
	}

  componentDidMount() {
    this.name = this.props.alias;
    console.log('didMount',this.name)
  }

  handleOnSelect(e, v) {
    console.log('selected: ', e);
  }

  handleOnSearch(e) {
    this.props.dispatch(setFilter(e, this.name));
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
  			<h1>ContactDropdown</h1>
        <DropdownList
          placeholder='Search...'
          valueField='id' textField='text'
          data={this.list}
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
  console.log('ContactDropdown2', stateSelectorListAlias(state, props.alias));
  console.log('ContactDropdownState', state.toJS());
  return stateSelectorListAlias(state, props.alias);
}

const appConnect = connect(mapStateToProps)(ContactDropdown);
export default appConnect;
