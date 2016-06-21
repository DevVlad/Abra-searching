import React from 'react';
import { connect } from 'react-redux';
import { setFilter } from '../actions/actions.jsx';
import { getFilter, getHint, getLoading } from '../selectors/selectors.jsx';
import { DropdownList, Multiselect } from 'react-widgets';

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
    this.props.dispatch(setFilter(e, this.props.alias));
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
  let obj = {};
  obj[props.alias] = {
    filter: getFilter(state, props),
    hint: getHint(state, props),
    loading: getLoading(state, props)
  };
  console.log(obj)
  return obj;
}

const appConnect = connect(mapStateToProps)(ContactDropdown);
export default appConnect;
