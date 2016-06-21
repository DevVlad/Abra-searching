import React from 'react';
import { connect } from 'react-redux';
import { setFilter } from '../actions/actions.jsx';
import { stateSelectorListAlias } from '../selectors/selectors.jsx';
import { DropdownList } from 'react-widgets';

import './App.css';
import 'react-widgets/lib/less/react-widgets.less';

class ContactDropdown extends React.Component{
	constructor(props){
		super(props);
	}

  componentDidMount() {
    console.log('didMount',this.props)
  }

  handleOnSelect(e, v) {
    console.log('selected: ', e);
  }

  handleOnSearch(e) {
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
  console.log('ContactDropdown', state.toJS(), props,'kkk: ',state.set(props.alias, stateSelectorListAlias(state, props)).toJS())
  return stateSelectorListAlias(state, props);
}

const appConnect = connect(mapStateToProps)(ContactDropdown);
export default appConnect;
