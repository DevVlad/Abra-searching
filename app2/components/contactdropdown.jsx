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
		this.navigate = 0;
		this.toDisplayLimit = 10;
		this.active = '';
	};

  handleOnSelect(e, v) {
    console.log('selected: ', this.props.alias, e);
  };

  handleOnSearch(e) {
    if (e.length > 0) {
			this.toDisplayLimit = 10;
      this.props.dispatch(setFilter(e, this.props.alias, 0, this.toDisplayLimit));
    }
  };

	handleOnMove(e) {
		console.log(e.id)
		// TODO: div with id=alias => aria-activedescendant=e.id
		let pom = this.props[this.props.alias];
		if ( e ===  $('#' + this.props.alias+'__listbox')[0].lastChild && pom.nextRequestPossible) {
			this.toDisplayLimit = this.toDisplayLimit + 10;
			this.props.dispatch(setFilter(pom.filter, this.props.alias, pom.lastPaging, this.toDisplayLimit));
			this.navigate = 0;
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
					onMove={this.handleOnMove.bind(this)}
					aria-activedescendant={this.active}
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
