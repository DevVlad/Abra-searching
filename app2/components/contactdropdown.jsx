import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import { setFilter } from '../logic/logic.jsx';
import { stateSelectorListAlias, stateSelectorPartOfListAlias } from '../redux/ducks/dropDownContact/selectors.jsx';
import { DropdownList } from 'react-widgets';

import './App.css';
import 'react-widgets/lib/less/react-widgets.less';

class ContactDropdown extends React.Component{
	constructor(props){
		super(props);
	};

  handleOnSelect(e, v) {
    console.log('selected: ', this.props.alias, e);
  };

  handleOnSearch(e) {
    if (e.length > 0) {
      this.props.dispatch(setFilter(e, this.props.alias, 0));
    }
  };

	render() {
    this.list = [];
    this.list = this.props[this.props.alias].hint.toJS().map(item => {
      return {
        'text': [item.prijmeni, item.jmeno].join(' '),
        'id': item.id,
        'body': {...item}
      };
    });

		let element = '';
		if ( this.list.length > 9) {
			element = '#'+this.props.alias+'__listbox__option__' + 9;
			if ($(element)[0] !== undefined) {
				console.log($(element)[0])
			};
		};

		// let ele = '#'+this.props.alias;
		// if ( this.list.length > 9) {
		// 	console.log($(ele)[0])
		// }

		$('.rw-list').scroll(function () {
      if ($(this)[0].scrollHeight - $(this).scrollTop() <= $(this).outerHeight()) {
				 console.log("end of scroll");
      }
		});

		return (
      <div id="ContactDropdown">
  			<h1>ContactDropdown {this.props.alias}</h1>
        <DropdownList
					id={this.props.alias}
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
	};

};

function mapStateToProps(state, props) {
	return stateSelectorListAlias(state, props.alias);
};

const appConnect = connect(mapStateToProps)(ContactDropdown);
export default appConnect;
