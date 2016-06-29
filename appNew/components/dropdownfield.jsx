import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import AutoComplete from 'material-ui/AutoComplete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import * as DropdownField from '../redux/ducks/dropdownfield.jsx';

import './App.css';

injectTapEventPlugin();
class ContactDropdown extends React.Component{
	constructor(props){
		super(props);
	};

	handleInput(e) {
		this.props.dispatch(DropdownField.setList(e, this.props.alias, 0, 10));
	};

	handleOnSelect(e) {
		console.log('onSelect',e)
		this.props.dispatch(DropdownField.setValueOfEntityToText(e.text, this.props.alias));
		this.props.dispatch(DropdownField.setIdOfSelectedItem(e.id, this.props.alias));
	};

	render() {
		this.list = [{}];
		if (this.props.hint !== undefined) {
			this.list = this.props.hint.toJS().map(item => {
	      return {
	        'text': [item.prijmeni, item.jmeno].join(' '),
	        'id': item.id,
	        'body': {...item}
	      };
	    });
		};
		if (this.props.entityId !== undefined && this.props.entityToText === '') this.props.dispatch(DropdownField.setValueOfEntityToText(this.props.entityId, this.props.alias));
		if (typeof this.props.entityToText === 'object') {
			this.toDisplay = [this.props.entityToText.jmeno, this.props.entityToText.prijmeni].join(' ');
		} else {
			this.toDisplay = this.props.entityToText
		};

		return (
      <div id="ContactDropdown">
  			<h1>ContactDropdown { this.props.alias }</h1>
				<MuiThemeProvider>
	        <AutoComplete
						id='dropdown'
						filter={ item => item }
	          placeholder='Search...'
						openOnFocus={ true }
						searchText={this.toDisplay}
						menuStyle = { { maxHeight: '300px' } }
						dataSource={ this.list }
						dataSourceConfig={ {  text: 'text', value: 'text'  } }
						onUpdateInput={ this.handleInput.bind(this) }
						onNewRequest={ this.handleOnSelect.bind(this) }
	        />
				</MuiThemeProvider>
      </div>
		)
	};

};

function mapStateToProps(state, props) {
	return DropdownField.getOwnState(state, props.alias);
};

const appConnect = connect(mapStateToProps)(ContactDropdown);
export default appConnect;





//
// import React from 'react';
// import { connect } from 'react-redux';
// import $ from 'jquery';
//
// import { setFilter } from '../logic/logic.jsx';
// import { stateSelectorListAlias } from '../redux/ducks/dropDownContact/selectors.jsx';
// import { DropdownList } from 'react-widgets';
//
// import './App.css';
// import 'react-widgets/lib/less/react-widgets.less';
//
// class ContactDropdown extends React.Component{
// 	constructor(props){
// 		super(props);
// 		this.navigate = 0;
// 		this.toDisplayLimit = 10;
// 		this.active = '';
// 	};
//
//   handleOnSelect(e, v) {
//     console.log('selected: ', this.props.alias, e);
//   };
//
//   handleOnSearch(e) {
//     if (e.length > 0) {
// 			this.toDisplayLimit = 10;
//       this.props.dispatch(setFilter(e, this.props.alias, 0, this.toDisplayLimit));
//     }
//   };
//
// 	handleOnMove(e) {
// 		console.log(e.id)
// 		// TODO: solve notification of reaching end of list
// 		let pom = this.props[this.props.alias];
// 		if ( e ===  $('#' + this.props.alias+'__listbox')[0].lastChild && pom.nextRequestPossible) {
// 			this.toDisplayLimit = this.toDisplayLimit + 10;
// 			this.props.dispatch(setFilter(pom.filter, this.props.alias, pom.lastPaging, this.toDisplayLimit));
// 			this.navigate = 0;
// 		}
// 	};
//
// 	render() {
//     this.list = [];
//     this.list = this.props[this.props.alias].hint.toJS().map(item => {
//       return {
//         'text': [item.prijmeni, item.jmeno].join(' '),
//         'id': item.id,
//         'body': {...item}
//       };
//     });
//
// 		$('.rw-list').scroll(function () {
//       if ($(this)[0].scrollHeight - $(this).scrollTop() <= $(this).outerHeight()) {
// 				 console.log("end of scroll");
//       }
// 		});
//
// 		return (
//       <div id="ContactDropdown">
//   			<h1>ContactDropdown {this.props.alias}</h1>
//         <DropdownList
// 					id={this.props.alias}
//           placeholder='Search...'
//           valueField='id' textField='text'
//           data={this.list}
//           busy={this.props[this.props.alias].loading}
//           caseSensitive={false}
//           onSelect={this.handleOnSelect.bind(this)}
//           filter={item => item}
//           onSearch={this.handleOnSearch.bind(this)}
//         />
//       </div>
// 		)
// 	};
//
// };
//
// function mapStateToProps(state, props) {
// 	return stateSelectorListAlias(state, props.alias);
// };
//
// const appConnect = connect(mapStateToProps)(ContactDropdown);
// export default appConnect;
